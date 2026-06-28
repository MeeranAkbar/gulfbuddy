"""
GulfHabibi — Propspace CRM Sync Script
Runs nightly via cron job: 0 3 * * * python3 sync_propspace.py
Fetches XML feed → parses → inserts/updates listings in Supabase
"""

import requests, json, time
from datetime import datetime
from xml.etree import ElementTree as ET

# ── CONFIG ──────────────────────────────────────────────────────
SB_URL  = "https://chfkssclmdshdcijfzdr.supabase.co"
SB_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmtzc2NsbWRzaGRjaWpmemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODc2ODUsImV4cCI6MjA4OTE2MzY4NX0.cbJBIgeDRIqFvk3WMmxRoDWo1C73wM44oBDekdcc3sE"

# Replace with actual Propspace feed URL after partner registration
PROPSPACE_FEED_URL = "https://feeds.propspace.com/gulfhabibi/listings.xml"

HEADERS = {
    "apikey": SB_KEY,
    "Authorization": f"Bearer {SB_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# ── FIELD MAPPING ────────────────────────────────────────────────
# Maps Propspace XML field names → GulfHabibi Supabase column names
FIELD_MAP = {
    "ReferenceNumber":  "external_id",
    "Title":            "title",
    "Description":      "description",
    "PropertyType":     "property_type",
    "Purpose":          "purpose",
    "Price":            "price",
    "Size":             "size_sqft",
    "Bedrooms":         "beds",
    "Bathrooms":        "baths",
    "Emirate":          "emirate",
    "Area":             "area",
    "Community":        "building",
    "Furnished":        "furnishing",
    "AgentName":        "contact_name",
    "AgentPhone":       "contact_phone",
    "AgentWhatsApp":    "contact_whatsapp",
    "RERAPermit":       "rera_number",
    "Latitude":         "lat",
    "Longitude":        "lng",
    "PhotoURL1":        "photo1",
    "PhotoURL2":        "photo2",
    "PhotoURL3":        "photo3",
}

PURPOSE_MAP = {
    "Rent": "rent",
    "Sale": "sale",
    "For Rent": "rent",
    "For Sale": "sale",
}

# ── MAIN SYNC ────────────────────────────────────────────────────
def run_sync():
    print(f"\n{'='*50}")
    print(f"GulfHabibi Propspace Sync — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*50}")

    # 1. Fetch the XML feed
    print("\n[1] Fetching Propspace feed...")
    try:
        resp = requests.get(PROPSPACE_FEED_URL, timeout=30)
        resp.raise_for_status()
        xml_data = resp.text
        print(f"    ✓ Feed fetched — {len(xml_data):,} bytes")
    except Exception as e:
        print(f"    ✗ Failed to fetch feed: {e}")
        return

    # 2. Parse the XML
    print("\n[2] Parsing listings...")
    try:
        root = ET.fromstring(xml_data)
        listings_xml = root.findall(".//Listing") or root.findall(".//property") or root.findall(".//Property")
        print(f"    ✓ Found {len(listings_xml)} listings in feed")
    except Exception as e:
        print(f"    ✗ Failed to parse XML: {e}")
        return

    # 3. Transform each listing
    synced = 0
    errors = 0
    for item in listings_xml:
        try:
            listing = transform_listing(item)
            if not listing:
                continue
            result = upsert_listing(listing)
            if result:
                synced += 1
            else:
                errors += 1
        except Exception as e:
            print(f"    ✗ Error on listing: {e}")
            errors += 1
        time.sleep(0.05)  # Rate limit - 20 per second max

    # 4. Summary
    print(f"\n{'='*50}")
    print(f"SYNC COMPLETE")
    print(f"  Synced:  {synced}")
    print(f"  Errors:  {errors}")
    print(f"  Total:   {len(listings_xml)}")
    print(f"{'='*50}\n")

    return {"synced": synced, "errors": errors, "total": len(listings_xml)}

def transform_listing(item):
    """Transform Propspace XML element → GulfHabibi listing dict"""
    def get(field):
        el = item.find(field)
        return el.text.strip() if el is not None and el.text else None

    ref = get("ReferenceNumber") or get("ID") or get("id")
    title = get("Title") or get("Description")
    if not title:
        return None  # Skip listings with no title

    photos = []
    for i in range(1, 6):
        p = get(f"PhotoURL{i}") or get(f"Photo{i}") or get(f"Image{i}")
        if p:
            photos.append(p)

    purpose_raw = get("Purpose") or get("OfferingType") or "rent"
    purpose = PURPOSE_MAP.get(purpose_raw, "rent")

    return {
        "external_id":    ref,
        "external_source": "propspace",
        "title":          title,
        "description":    get("Description") or "",
        "category":       "property",
        "property_type":  (get("PropertyType") or "Apartment").lower(),
        "purpose":        purpose,
        "price":          try_float(get("Price") or get("AnnualRent") or get("SalePrice")),
        "size_sqft":      try_float(get("Size") or get("SizeSqFt")),
        "beds":           get("Bedrooms"),
        "baths":          get("Bathrooms"),
        "emirate":        get("Emirate") or get("City") or "Dubai",
        "area":           get("Area") or get("Community") or get("Location"),
        "building":       get("BuildingName") or get("Community"),
        "furnishing":     get("Furnished"),
        "contact_name":   get("AgentName"),
        "contact_phone":  get("AgentPhone") or get("ContactPhone"),
        "contact_whatsapp": get("AgentWhatsApp"),
        "rera_number":    get("RERAPermit") or get("PermitNumber"),
        "lat":            try_float(get("Latitude")),
        "lng":            try_float(get("Longitude")),
        "images":         photos if photos else None,
        "plan":           "free",
        "posted_by":      "agent",
        "status":         "active",
        "source":         "propspace_sync",
    }

def upsert_listing(listing):
    """Insert or update listing in Supabase (upsert on external_id + external_source)"""
    r = requests.post(
        f"{SB_URL}/rest/v1/listings",
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=listing,
        timeout=10
    )
    return r.ok or r.status_code == 201

def try_float(val):
    try:
        return float(str(val).replace(",","").replace(" ","")) if val else None
    except:
        return None

if __name__ == "__main__":
    run_sync()
