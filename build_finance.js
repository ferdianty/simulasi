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
        if (content.includes('Penerbitan Invoice Penjualan Semen') || content.includes('Finance & Accounting')) {
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
  const scriptStartIdx = lastUserInput.lastIndexOf('<script>', endIdx);
  const scriptEndIdx = lastUserInput.lastIndexOf('</script>');
  let inlineScript = '';
  if (scriptStartIdx !== -1 && scriptEndIdx !== -1 && scriptStartIdx > startIdx) {
    inlineScript = lastUserInput.substring(scriptStartIdx + 8, scriptEndIdx);
    // Remove script from mainContent
    mainContent = mainContent.substring(0, mainContent.lastIndexOf('<script>')) + '</main>';
  }

  // Use warehouse as base layout
  const viewDir = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\view';
  const baseHtmlFile = path.join(viewDir, 'warehouse-inventory.html');
  const targetHtmlFile = path.join(viewDir, 'finance-accounting.html');

  let baseHtml = fs.readFileSync(baseHtmlFile, 'utf-8');

  // Update Title
  baseHtml = baseHtml.replace('<title>Warehouse &amp; Manajemen Stok Semen - ERP PAD</title>', '<title>Finance &amp; Accounting - ERP PAD</title>');

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

  // 2. Promote Finance in Sidebar
  baseHtml = baseHtml.replace(
    /<a class="group flex items-center gap-2\.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="#">\s*<span class="material-symbols-outlined text-\[19px\] text-text-muted group-hover:text-brand-blue transition-colors">receipt_long<\/span>([\s\S]*?)<\/a>/,
    `<a aria-current="page" class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors bg-brand-blue-soft text-brand-blue font-semibold border border-brand-blue-border/60 shadow-xs cursor-pointer" href="finance-accounting.html">
<span class="material-symbols-outlined text-[19px] text-brand-blue">receipt_long</span>
<div class="sidebar-text flex flex-col min-w-0 transition-opacity duration-300">
<span class="text-[13px] leading-tight font-semibold">Finance &amp; Accounting</span>
<span class="text-[10px] text-brand-blue/70 font-normal leading-tight">Faktur, Piutang &amp; Hutang</span>
</div>
</a>`
  );

  // Layout normalizer
  const replacements = {
    // Spacing & Layout
    'px-margin': 'px-6',
    'py-margin': 'pb-10', // To match warehouse pb-10 and pt-20
    'pt-12': 'pt-20',
    'gap-space-md': 'gap-4',
    'gap-space-sm': 'gap-2',
    'gap-space-xs': 'gap-1',
    'gap-space-lg': 'gap-6',
    'gap-space-xl': 'gap-8',
    'px-space-md': 'px-4',
    'py-space-md': 'py-4',
    'px-space-sm': 'px-2',
    'py-space-sm': 'py-2',
    'px-space-lg': 'px-6',
    'py-space-lg': 'py-6',
    'px-space-xl': 'px-8',
    'py-space-xl': 'py-8',
    'px-space-xs': 'px-1',
    'py-space-xs': 'py-1',
    'p-space-lg': 'p-6',
    'p-space-md': 'p-4',
    'p-space-sm': 'p-2',
    'p-space-xs': 'p-1',
    'p-space-xl': 'p-8',
    'pt-space-md': 'pt-4',
    'pt-space-xs': 'pt-1',
    'pb-space-xs': 'pb-1',
    'mb-space-sm': 'mb-2',
    'mt-space-md': 'mt-4',
  
    // Colors
    'bg-surface-container-lowest': 'bg-white',
    'bg-surface-container': 'bg-slate-50',
    'bg-canvas-bg': 'bg-[#F8FAFC]',
    'border-border-subtle': 'border-[#E2E8F0]',
    'divide-border-subtle': 'divide-[#E2E8F0]',
    
    'text-text-main': 'text-[#0F172A]',
    'text-text-secondary': 'text-[#475569]',
    'text-text-muted': 'text-[#94A3B8]',
    
    'text-brand-blue-royal': 'text-[#1E3A8A]',
    'bg-brand-blue-royal': 'bg-[#1E3A8A]',
    'border-brand-blue-royal': 'border-[#1E3A8A]',
    
    'text-brand-blue-vivid': 'text-blue-700',
    'bg-brand-blue-vivid': 'bg-blue-700',
    
    'text-success-deep': 'text-emerald-700',
    'bg-success-bg': 'bg-emerald-50',
    'border-success-border': 'border-emerald-200',
    'text-success-text': 'text-emerald-700',
    
    'text-critical-text': 'text-red-600',
    'bg-critical-bg': 'bg-red-50',
    'border-critical-border': 'border-red-200',
    
    'bg-warning-bg': 'bg-amber-50',
    'text-warning-text': 'text-amber-700',
    'border-warning-border': 'border-amber-200',
    
    'text-on-primary': 'text-white',

    // Extra from finance html
    'text-on-surface-variant': 'text-slate-600',
    'text-on-surface': 'text-slate-900',
    'text-outline': 'text-slate-400',
    'text-error': 'text-red-600',
  
    // Typography
    'font-headline-xl': 'text-[24px] font-bold',
    'text-headline-xl': '',
    'font-headline-lg': 'text-[20px] font-semibold',
    'text-headline-lg': '',
    'font-headline-md': 'text-[16px] font-semibold',
    'text-headline-md': '',
    'font-label-md': 'text-[13px] font-medium',
    'text-label-md': '',
    'font-label-sm': 'text-[11px] font-semibold',
    'text-label-sm': '',
    'font-body-md': 'text-[13px]',
    'text-body-md': '',
    'font-body-sm': 'text-[12px]',
    'text-body-sm': '',
    'font-code-sm': 'font-mono text-[12px]',
    'text-code-sm': ''
  };

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    mainContent = mainContent.replace(regex, value);
  }

  // Ensure <main> has the right classes
  mainContent = mainContent.replace(/<main[^>]*>/, '<main class="relative pt-20 px-6 pb-10 flex-1 space-y-6">');
  
  // Cleanup empty classes
  mainContent = mainContent.replace(/class="\s+/g, 'class="').replace(/\s+"/g, '"').replace(/class=""/g, '');

  // 3. Replace <main> block in baseHtml
  const baseMainStart = baseHtml.indexOf('<main class="relative pt-20 px-6 pb-10 flex-1 space-y-6">');
  const baseMainEnd = baseHtml.lastIndexOf('</main>') + 7;
  
  if (baseMainStart === -1 || baseMainEnd === 6) {
    console.error("Could not find main element in base html!");
    process.exit(1);
  }

  const finalHtml = baseHtml.substring(0, baseMainStart) + mainContent + baseHtml.substring(baseMainEnd);
  
  fs.writeFileSync(targetHtmlFile, finalHtml, 'utf-8');
  console.log('Successfully generated view/finance-accounting.html');

  // 4. Append inline script to js/script.js securely
  if (inlineScript) {
    // Add safety wrappers for event listeners
    let safeScript = `
/* From finance-accounting.html */
(function() {
  const tabAr = document.getElementById('tab-ar');
  const tabAp = document.getElementById('tab-ap');
  const ledgerTableBody = document.getElementById('ledger-table-body');
  const btnPullDo = document.getElementById('btn-pull-do');
  const receiptInvPicker = document.getElementById('receipt-inv-picker');
  const btnPublish = document.getElementById('btn-publish-invoice');
  const btnPostPayment = document.getElementById('btn-post-payment');

  if(tabAr && tabAp && ledgerTableBody) {
    ${inlineScript.replace(/const tabAr = [^\n]+;\n/g, '')
                 .replace(/const tabAp = [^\n]+;\n/g, '')
                 .replace(/const ledgerTableBody = [^\n]+;\n/g, '')
                 .replace(/const btnPullDo = [^\n]+;\n/g, '')
                 .replace(/const receiptInvPicker = [^\n]+;\n/g, '')
                 .replace(/const btnPublish = [^\n]+;\n/g, '')
                 .replace(/const btnPostPayment = [^\n]+;\n/g, '')}
  }
})();
`;
    const scriptJsPath = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\js\\script.js';
    let scriptJsContent = fs.readFileSync(scriptJsPath, 'utf-8');
    
    if (!scriptJsContent.includes('From finance-accounting.html')) {
      scriptJsContent += '\\n' + safeScript;
      fs.writeFileSync(scriptJsPath, scriptJsContent, 'utf-8');
      console.log('Successfully extracted script to js/script.js');
    }
  }

  // 5. Update Links across all files
  const files = [
    'index.html',
    'master-data-akses.html',
    'procurement.html',
    'warehouse-inventory.html',
    'sales-commercial.html',
    'distribution-planning.html',
    'finance-accounting.html'
  ].map(f => path.join(viewDir, f));

  files.forEach(file => {
    if(fs.existsSync(file)) {
      let html = fs.readFileSync(file, 'utf-8');
      html = html.replace(/(<a[^>]+href=")(#)("[^>]*>\s*<span[^>]*>receipt_long<\/span>\s*<div[^>]*>\s*<span[^>]*>Finance)/g, '$1finance-accounting.html$3');
      fs.writeFileSync(file, html, 'utf-8');
    }
  });

  console.log('Successfully updated Finance links in all files.');
}

processHtml().catch(console.error);
