// ===== GULFBUDDY IMAGE HANDLER =====
// Compresses images before upload — saves 80%+ storage
// Max output: 1200px wide, 85% quality JPEG
// Usage: const urls = await uploadImages(files, supabaseUrl, supabaseKey, bucket)

const IMG_MAX_WIDTH  = 1200;  // px
const IMG_MAX_HEIGHT = 1200;  // px
const IMG_QUALITY    = 0.82;  // 82% JPEG quality — great quality, small size
const IMG_MAX_MB     = 8;     // reject files over 8MB original
const IMG_MAX_COUNT  = 5;     // max images per listing

// Compress a single image file → returns a Blob
function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (file.size > IMG_MAX_MB * 1024 * 1024) {
      reject(new Error(`${file.name} is too large. Max ${IMG_MAX_MB}MB.`));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      // Scale down if needed
      if (width > IMG_MAX_WIDTH || height > IMG_MAX_HEIGHT) {
        const ratio = Math.min(IMG_MAX_WIDTH / width, IMG_MAX_HEIGHT / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Compression failed'));
      }, 'image/jpeg', IMG_QUALITY);
    };
    img.onerror = () => reject(new Error(`Cannot load ${file.name}`));
    img.src = url;
  });
}

// Preview images in container before upload
// Returns preview URLs array
function previewImages(files, previewContainerId) {
  const container = document.getElementById(previewContainerId);
  if (!container) return;
  container.innerHTML = '';
  const limited = Array.from(files).slice(0, IMG_MAX_COUNT);
  limited.forEach((file, i) => {
    const url = URL.createObjectURL(file);
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;display:inline-block';
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'width:76px;height:76px;object-fit:cover;border-radius:8px;border:1px solid #1a1828';
    const del = document.createElement('button');
    del.textContent = '✕';
    del.style.cssText = 'position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;padding:0';
    del.onclick = () => { wrap.remove(); window._uploadFiles = window._uploadFiles?.filter((_, fi) => fi !== i); };
    wrap.appendChild(img);
    wrap.appendChild(del);
    container.appendChild(wrap);
  });
  window._uploadFiles = limited;
  if (limited.length < files.length) {
    showImgMsg(`Max ${IMG_MAX_COUNT} photos allowed. First ${IMG_MAX_COUNT} selected.`);
  }
}

// Upload all images — compress first, then upload to Supabase Storage
// Returns array of public URLs
async function uploadImages(supabaseUrl, supabaseKey, bucket, folder) {
  const files = window._uploadFiles || [];
  if (!files.length) return [];
  const urls = [];
  for (const file of files) {
    try {
      const compressed = await compressImage(file);
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
      const r = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
        method: 'POST',
        headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey, 'Content-Type': 'image/jpeg' },
        body: compressed
      });
      if (r.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
        urls.push(publicUrl);
      }
    } catch(e) {
      console.warn('Image upload failed:', e.message);
    }
  }
  return urls;
}

function showImgMsg(msg) {
  const el = document.getElementById('imgMsg');
  if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => el.style.display='none', 3000); }
}

window.compressImage  = compressImage;
window.previewImages  = previewImages;
window.uploadImages   = uploadImages;
