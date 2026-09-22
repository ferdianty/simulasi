const fs = require('fs');
const path = require('path');

async function processHtml() {
  const mainContent = fs.readFileSync('main_extracted.html', 'utf-8');

  // Use warehouse as base layout
  const viewDir = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\view';
  const baseHtmlFile = path.join(viewDir, 'warehouse-inventory.html');
  const targetHtmlFile = path.join(viewDir, 'controlled-upload.html');

  let baseHtml = fs.readFileSync(baseHtmlFile, 'utf-8');

  // Update Title
  baseHtml = baseHtml.replace('<title>Warehouse &amp; Manajemen Stok Semen - ERP PAD</title>', '<title>Controlled Upload - ERP PAD</title>');

  // 1. Demote Warehouse in Sidebar
  baseHtml = baseHtml.replace(
    /<a aria-current="page" class="flex items-center gap-2\.5 px-3 py-2 rounded-lg transition-colors bg-brand-blue-soft text-brand-blue font-semibold border border-brand-blue-border\/60 shadow-xs cursor-pointer" href="warehouse-inventory\.html">([\s\S]*?)<\/a>/,
    `<a class="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="warehouse-inventory.html">
<span class="material-symbols-outlined text-[19px] text-text-muted group-hover:text-brand-blue transition-colors">warehouse</span>
<div class="sidebar-text flex flex-col min-w-0 transition-opacity duration-300">
<span class="text-[13px] font-medium leading-tight group-hover:font-semibold">Warehouse &amp; Inventory</span>
<span class="text-[10px] text-text-muted leading-tight group-hover:text-brand-blue/70">Gudang &amp; Stok Semen</span>
</div>
</a>`
  );

  // 2. Promote Controlled Upload in Sidebar
  baseHtml = baseHtml.replace(
    /<a class="group flex items-center gap-2\.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="#">\s*<span class="material-symbols-outlined text-\[19px\] text-text-muted group-hover:text-brand-blue transition-colors">file_upload<\/span>([\s\S]*?)<\/a>/,
    `<a aria-current="page" class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors bg-brand-blue-soft text-brand-blue font-semibold border border-brand-blue-border/60 shadow-xs cursor-pointer" href="controlled-upload.html">
<span class="material-symbols-outlined text-[19px] text-brand-blue">file_upload</span>
<div class="sidebar-text flex flex-col min-w-0 transition-opacity duration-300">
<span class="text-[13px] leading-tight font-semibold">Controlled Upload</span>
<span class="text-[10px] text-brand-blue/70 font-normal leading-tight">Upload Template Excel</span>
</div>
</a>`
  );

  // 3. Replace <main> block
  const baseMainStart = baseHtml.indexOf('<main class="relative pt-20 px-6 pb-10 flex-1 space-y-6">');
  const baseMainEnd = baseHtml.lastIndexOf('</main>') + 7;
  
  if (baseMainStart === -1 || baseMainEnd === 6) {
    console.error("Could not find main element in base html!");
    process.exit(1);
  }

  const finalHtml = baseHtml.substring(0, baseMainStart) + mainContent + baseHtml.substring(baseMainEnd);
  
  fs.writeFileSync(targetHtmlFile, finalHtml, 'utf-8');
  console.log('Successfully generated view/controlled-upload.html');

  // Also update all other HTML files to point to controlled-upload.html instead of "#" for that specific menu item.
  const files = fs.readdirSync(viewDir);
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'controlled-upload.html') {
      let content = fs.readFileSync(path.join(viewDir, file), 'utf-8');
      content = content.replace(
        /<a class="group flex items-center gap-2\.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="#">\s*<span class="material-symbols-outlined text-\[19px\] text-text-muted group-hover:text-brand-blue transition-colors">file_upload<\/span>/,
        `<a class="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="controlled-upload.html">
<span class="material-symbols-outlined text-[19px] text-text-muted group-hover:text-brand-blue transition-colors">file_upload</span>`
      );
      fs.writeFileSync(path.join(viewDir, file), content, 'utf-8');
    }
  }
  console.log('Successfully updated sidebar links in other HTML files.');
}

processHtml().catch(console.error);
