const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processHtml() {
  const transcriptPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\96069ed6-e927-47be-af14-f5cee252b726\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(transcriptPath);
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastUserInput = '';

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'USER_INPUT') {
        const content = parsed.content;
        if (content.includes('Rencana &amp; Penugasan Armada Manual') || content.includes('Distribution Planning')) {
          lastUserInput = content;
        }
      }
    } catch (e) {}
  }

  const startIdx = lastUserInput.indexOf('<main');
  const endIdx = lastUserInput.lastIndexOf('</main>') + 7;
  
  if (startIdx === -1 || endIdx === 6) {
    console.error('Main tag not found in the last user message.');
    process.exit(1);
  }

  let mainContent = lastUserInput.substring(startIdx, endIdx);

  // Extract the inline script from the provided HTML
  const scriptStartIdx = lastUserInput.indexOf('<script>', endIdx);
  const scriptEndIdx = lastUserInput.lastIndexOf('</script>');
  let inlineScript = '';
  if (scriptStartIdx !== -1 && scriptEndIdx !== -1) {
    inlineScript = lastUserInput.substring(scriptStartIdx + 8, scriptEndIdx);
  }

  // Use warehouse as base layout
  const viewDir = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\view';
  const baseHtmlFile = path.join(viewDir, 'warehouse-inventory.html');
  const targetHtmlFile = path.join(viewDir, 'distribution-planning.html');

  let baseHtml = fs.readFileSync(baseHtmlFile, 'utf-8');

  // Update Title
  baseHtml = baseHtml.replace('<title>Warehouse &amp; Manajemen Stok Semen - ERP PAD</title>', '<title>Distribution Planning - ERP PAD</title>');

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

  // 2. Promote Distribution Planning in Sidebar
  baseHtml = baseHtml.replace(
    /<a class="group flex items-center gap-2\.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="#">\s*<span class="material-symbols-outlined text-\[19px\] text-text-muted group-hover:text-brand-blue transition-colors">local_shipping<\/span>([\s\S]*?)<\/a>/,
    `<a aria-current="page" class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors bg-brand-blue-soft text-brand-blue font-semibold border border-brand-blue-border/60 shadow-xs cursor-pointer" href="distribution-planning.html">
<span class="material-symbols-outlined text-[19px] text-brand-blue">local_shipping</span>
<div class="sidebar-text flex flex-col min-w-0 transition-opacity duration-300">
<span class="text-[13px] leading-tight font-semibold">Distribution Planning</span>
<span class="text-[10px] text-brand-blue/70 font-normal leading-tight">Rencana &amp; Pengiriman</span>
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
  console.log('Successfully generated view/distribution-planning.html');

  // 4. Append inline script to js/script.js securely
  if (inlineScript) {
    inlineScript = inlineScript.replace(
      /document\.getElementById\('so-search'\)\.addEventListener/g,
      `const soSearch = document.getElementById('so-search');\n  if (soSearch) soSearch.addEventListener`
    );

    const scriptJsPath = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\js\\script.js';
    let scriptJsContent = fs.readFileSync(scriptJsPath, 'utf-8');
    
    if (!scriptJsContent.includes('function handleCreateDO')) {
      scriptJsContent += '\\n\\n/* From distribution-planning.html */\\n' + inlineScript + '\\n';
      fs.writeFileSync(scriptJsPath, scriptJsContent, 'utf-8');
      console.log('Successfully extracted script to js/script.js');
    }
  }
}

processHtml().catch(console.error);
