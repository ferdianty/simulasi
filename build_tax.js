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
        if (content.includes('Kepatuhan Fiskal Distribusi') || content.includes('Tax Reporting')) {
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

  // Remove the script block from mainContent if it exists
  const scriptStartIdx = lastUserInput.lastIndexOf('<script>', endIdx);
  const scriptEndIdx = lastUserInput.lastIndexOf('</script>');
  let inlineScript = '';
  if (scriptStartIdx !== -1 && scriptEndIdx !== -1 && scriptStartIdx > startIdx) {
    inlineScript = lastUserInput.substring(scriptStartIdx + 8, scriptEndIdx);
    mainContent = mainContent.substring(0, mainContent.lastIndexOf('<script>')) + '</main>';
  }

  // Rewrite inline onclick to id based listeners to avoid polluting global namespace
  mainContent = mainContent.replace('onclick="printRekap()"', 'id="btn-print-rekap"');
  mainContent = mainContent.replace('onclick="exportCSV()"', 'id="btn-export-csv"');
  mainContent = mainContent.replace('onclick="verifikasiDraft()"', ''); // id="btnVerifikasi" is already there

  // Use warehouse as base layout
  const viewDir = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\view';
  const baseHtmlFile = path.join(viewDir, 'warehouse-inventory.html');
  const targetHtmlFile = path.join(viewDir, 'tax-reporting.html');

  let baseHtml = fs.readFileSync(baseHtmlFile, 'utf-8');

  // Update Title
  baseHtml = baseHtml.replace('<title>Warehouse &amp; Manajemen Stok Semen - ERP PAD</title>', '<title>Tax Reporting - ERP PAD</title>');

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

  // 2. Promote Tax Reporting in Sidebar
  baseHtml = baseHtml.replace(
    /<a class="group flex items-center gap-2\.5 px-3 py-2 rounded-lg text-text-secondary hover:bg-brand-blue-soft hover:text-brand-blue transition-colors cursor-pointer" href="#">\s*<span class="material-symbols-outlined text-\[19px\] text-text-muted group-hover:text-brand-blue transition-colors">account_balance<\/span>([\s\S]*?)<\/a>/,
    `<a aria-current="page" class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors bg-brand-blue-soft text-brand-blue font-semibold border border-brand-blue-border/60 shadow-xs cursor-pointer" href="tax-reporting.html">
<span class="material-symbols-outlined text-[19px] text-brand-blue">account_balance</span>
<div class="sidebar-text flex flex-col min-w-0 transition-opacity duration-300">
<span class="text-[13px] leading-tight font-semibold">Tax Reporting</span>
<span class="text-[10px] text-brand-blue/70 font-normal leading-tight">Pelaporan Pajak &amp; Faktur</span>
</div>
</a>`
  );

  // Layout normalizer
  const replacements = {
    // Spacing
    'px-margin': 'px-6',
    'py-margin': 'pb-10', 
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
    'pt-space-sm': 'pt-2',
    'pt-space-xs': 'pt-1',
    'pb-space-xs': 'pb-1',
    'mb-space-sm': 'mb-2',
    'mb-space-md': 'mb-4',
    'mt-space-md': 'mt-4',
    'mt-space-sm': 'mt-2',
  
    // Fonts & Typography
    'font-headline-xl': 'font-bold text-[24px]',
    'text-headline-xl': '',
    'font-headline-lg': 'font-bold text-[20px]',
    'text-headline-lg': '',
    'font-headline-md': 'font-bold text-[16px]',
    'text-headline-md': '',
    'font-label-md': 'font-semibold text-[13px]',
    'text-label-md': '',
    'font-label-sm': 'font-semibold text-[11px]',
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
  console.log('Successfully generated view/tax-reporting.html');

  // 4. Append logic to js/script.js securely
  const safeScript = `
/* From tax-reporting.html */
(function() {
  const filterJenis = document.getElementById('filterJenis');
  const filterStatus = document.getElementById('filterStatus');
  const btnExport = document.getElementById('btn-export-csv');
  const btnPrint = document.getElementById('btn-print-rekap');
  const btnVerifikasi = document.getElementById('btnVerifikasi');
  const chkNTPN = document.getElementById('chkNTPN');

  if(filterJenis && filterStatus) {
    filterJenis.addEventListener('change', function(e) {
      var val = e.target.value;
      var rows = document.querySelectorAll('#fakturTableBody tr');
      rows.forEach(function(row) {
        var badge = row.querySelector('td span.font-mono');
        if (!badge) return;
        var type = badge.textContent.trim();
        if (val === 'ALL' || type === val) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });

    filterStatus.addEventListener('change', function(e) {
      var val = e.target.value;
      var rows = document.querySelectorAll('#fakturTableBody tr');
      rows.forEach(function(row) {
        var statusCell = row.cells[8] ? row.cells[8].textContent.trim() : "";
        if (val === 'ALL') {
          row.style.display = '';
        } else if (val === 'VALID' && statusCell.includes('Tervalidasi')) {
          row.style.display = '';
        } else if (val === 'PENDING' && statusCell.includes('Menunggu Kelengkapan Dokumen')) {
          row.style.display = '';
        } else if (val === 'PENDING' && statusCell.includes('Perlu Review Finance')) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      // Use existing showActionToast if available
      if (typeof showActionToast === 'function') {
        showActionToast('File CSV e-Faktur Pajak Keluaran & Masukan Masa 10-2024 telah diunduh.');
      } else {
        alert('File CSV e-Faktur Pajak Keluaran & Masukan Masa 10-2024 telah diunduh.');
      }
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => window.print());
  }

  if (btnVerifikasi && chkNTPN) {
    btnVerifikasi.addEventListener('click', () => {
      if (!chkNTPN.checked) {
        alert('Peringatan: NTPN bukti setor belum divalidasi. Harap centang konfirmasi pelunasan kurang bayar sebelum memverifikasi final draft SPT.');
      } else {
        if (typeof showActionToast === 'function') {
          showActionToast('Draft SPT Masa PPN 1111 berhasil diverifikasi dan siap diserahkan ke DJP.');
        } else {
          alert('Draft SPT Masa PPN 1111 berhasil diverifikasi dan siap diserahkan ke DJP.');
        }
      }
    });
  }
})();
`;
  const scriptJsPath = 'd:\\Semester 7-IT DEL\\Magang\\simulasi\\js\\script.js';
  let scriptJsContent = fs.readFileSync(scriptJsPath, 'utf-8');
  
  if (!scriptJsContent.includes('From tax-reporting.html')) {
    scriptJsContent += '\\n' + safeScript;
    fs.writeFileSync(scriptJsPath, scriptJsContent, 'utf-8');
    console.log('Successfully extracted script to js/script.js');
  }

  // 5. Update Links across all files
  const files = [
    'index.html',
    'master-data-akses.html',
    'procurement.html',
    'warehouse-inventory.html',
    'sales-commercial.html',
    'distribution-planning.html',
    'finance-accounting.html',
    'tax-reporting.html'
  ].map(f => path.join(viewDir, f));

  files.forEach(file => {
    if(fs.existsSync(file)) {
      let html = fs.readFileSync(file, 'utf-8');
      html = html.replace(/(<a[^>]+href=")(#)("[^>]*>\s*<span[^>]*>account_balance<\/span>\s*<div[^>]*>\s*<span[^>]*>Tax Reporting)/g, '$1tax-reporting.html$3');
      fs.writeFileSync(file, html, 'utf-8');
    }
  });

  console.log('Successfully updated Tax Reporting links in all files.');
}

processHtml().catch(console.error);
