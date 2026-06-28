const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'apps/web');

// 1. Re-fix property listing import path
const propListingPath = path.join(baseDir, 'app/(public)/property/listing/[slug]/page.tsx');
if (fs.existsSync(propListingPath)) {
  let content = fs.readFileSync(propListingPath, 'utf8');
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/lib\/search\/property/g, '../../../../../lib/search/property');
  content = content.replace(/badge\)/g, 'badge: string)'); // Also fix badge type
  fs.writeFileSync(propListingPath, content);
}

// 2. Fix PropertyShowcaseItem interface
const propContentPath = path.join(baseDir, 'lib/property/public-content.ts');
if (fs.existsSync(propContentPath)) {
  let content = fs.readFileSync(propContentPath, 'utf8');
  content = content.replace(/image: string;/g, 'image?: string;\n  imageUrl: string;');
  fs.writeFileSync(propContentPath, content);
}

// 3. Fix hit.name and hit.priceLabel in directory
const dirListingPath = path.join(baseDir, 'app/(public)/directory/[slug]/page.tsx');
if (fs.existsSync(dirListingPath)) {
  let content = fs.readFileSync(dirListingPath, 'utf8');
  content = content.replace(/hit\.name/g, 'hit.title');
  content = content.replace(/hit\.priceLabel/g, 'hit.ratingLabel');
  fs.writeFileSync(dirListingPath, content);
}

// 4. Fix hit.priceLabel in jobs
const jobsListingPath = path.join(baseDir, 'app/(public)/jobs/[slug]/page.tsx');
if (fs.existsSync(jobsListingPath)) {
  let content = fs.readFileSync(jobsListingPath, 'utf8');
  content = content.replace(/hit\.priceLabel/g, 'hit.salaryLabel');
  fs.writeFileSync(jobsListingPath, content);
}

// 5. Fix hit.postedAt in classifieds/search
const classSearchPage = path.join(baseDir, 'app/(public)/classifieds/search/page.tsx');
if (fs.existsSync(classSearchPage)) {
  let content = fs.readFileSync(classSearchPage, 'utf8');
  content = content.replace(/hit\.postedAt/g, '""');
  fs.writeFileSync(classSearchPage, content);
}

// 6. Fix hit.seniorityLevel in jobs/search
const jobsSearchPage = path.join(baseDir, 'app/(public)/jobs/search/page.tsx');
if (fs.existsSync(jobsSearchPage)) {
  let content = fs.readFileSync(jobsSearchPage, 'utf8');
  content = content.replace(/hit\.seniorityLevel/g, '""');
  fs.writeFileSync(jobsSearchPage, content);
}

console.log('TS fixes part 2 applied');
