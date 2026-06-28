const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3001";

const checks = [
  { path: "/", expect: [200], contains: "A premium UAE marketplace" },
  { path: "/search", expect: [200], contains: "Search across GulfHabibi" },
  { path: "/search?keyword=marina&location=dubai", expect: [200], contains: "All-section search should" },
  { path: "/search?section=property&keyword=marina&location=dubai", expect: [200], contains: "Showing structured search lanes for property" },
  { path: "/property", expect: [200], contains: "Property should feel" },
  { path: "/property/long_term", expect: [200], contains: "Sale and rent discovery" },
  { path: "/property/long_term/dubai", expect: [200], contains: "Dubai should feel like" },
  { path: "/property/search?marketMode=long_term&keyword=marina&emirate=dubai", expect: [200], contains: "Property search should" },
  { path: "/property/project/harbor-crest-residences", expect: [200], contains: "Harbor Crest Residences" },
  { path: "/motors", expect: [200], contains: "Motors should feel" },
  { path: "/jobs", expect: [200], contains: "Jobs should feel" },
  { path: "/jobs/dubai", expect: [200], contains: "Dubai should feel like a premium local hiring hub" },
  { path: "/jobs/dubai/sales", expect: [200], contains: "Sales jobs in Dubai" },
  { path: "/jobs/senior-sales-manager-dubai", expect: [200], contains: "Senior Sales Manager" },
  { path: "/jobs/company/aurora-commercial-group", expect: [200], contains: "Aurora Commercial Group" },
  { path: "/services", expect: [200], contains: "Services should feel local, trustworthy, and marketplace-ready" },
  { path: "/services/dubai", expect: [200], contains: "Dubai services pages" },
  { path: "/services/dubai/ac-repair", expect: [200], contains: "AC Repair in Dubai" },
  { path: "/services/dubai/ac-repair/emergency", expect: [200], contains: "Emergency" },
  { path: "/services/provider/prime-cool-technical-services", expect: [200], contains: "Prime Cool Technical Services" },
  { path: "/directory", expect: [200], contains: "Directory should become" },
  { path: "/directory/dubai", expect: [200], contains: "Dubai should feel like a real local business discovery hub" },
  { path: "/directory/dubai/restaurants", expect: [200], contains: "Restaurants in Dubai" },
  { path: "/businesses/harbor-table-bistro", expect: [200], contains: "Harbor Table Bistro" },
  { path: "/areas/dubai/dubai-marina", expect: [200], contains: "Dubai Marina" },
  { path: "/classifieds", expect: [200], contains: "Classifieds should stay" },
  { path: "/classifieds/dubai/electronics", expect: [200], contains: "Electronics in Dubai" },
  { path: "/classifieds/dubai/electronics/iphone-15-pro-max-natural-titanium", expect: [200], contains: "iPhone 15 Pro Max 256GB in natural titanium" },
  { path: "/about", expect: [200], contains: "About GulfHabibi" },
  { path: "/pricing", expect: [200], contains: "Free to start, structured to grow" },
  { path: "/contact", expect: [200], contains: "One contact layer, routed into the right operational queue" },
  { path: "/login", expect: [200], contains: "Sign in" },
  { path: "/register", expect: [200], contains: "Create account" },
  { path: "/dashboard", expect: [307], locationContains: "/login" },
  { path: "/admin/command-center", expect: [307], locationContains: "/login" }
];

async function runCheck(check) {
  let lastResult = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(`${baseUrl}${check.path}`, {
      redirect: "manual",
      headers: {
        Accept: "text/html"
      }
    });

    const body = response.status === 307 || response.status === 308 || response.status === 303 || response.status === 302
      ? ""
      : await response.text();

    const statusOk = check.expect.includes(response.status);
    const bodyOk = check.contains ? body.includes(check.contains) : true;
    const location = response.headers.get("location") || "";
    const locationOk = check.locationContains ? location.includes(check.locationContains) : true;

    lastResult = {
      ok: statusOk && bodyOk && locationOk,
      path: check.path,
      status: response.status,
      location,
      contains: check.contains || "",
      expected: check.expect.join(","),
      bodyMatched: bodyOk,
      locationMatched: locationOk
    };

    if (lastResult.ok) {
      return lastResult;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }

  return lastResult;
}

async function main() {
  console.log(`Smoke testing routes against ${baseUrl}`);
  let failed = 0;

  for (const check of checks) {
    const result = await runCheck(check);
    if (result.ok) {
      const locationSuffix = result.location ? ` -> ${result.location}` : "";
      console.log(`OK   ${result.status} ${result.path}${locationSuffix}`);
    } else {
      failed += 1;
      const pieces = [`expected ${result.expected}`, `got ${result.status}`];
      if (!result.bodyMatched && result.contains) {
        pieces.push(`missing text: "${result.contains}"`);
      }
      if (!result.locationMatched) {
        pieces.push(`bad location: ${result.location || "<none>"}`);
      }
      console.error(`FAIL ${result.path} (${pieces.join(" | ")})`);
    }
  }

  console.log(`\nChecks run: ${checks.length}`);
  console.log(`Passed: ${checks.length - failed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

await main();
