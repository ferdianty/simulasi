const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove the previously injected global tooltip wrapper
const tooltipWrapperRegex = /<!-- Tooltip Style -->[\s\S]*?<!-- Grid lines -->/;
if (tooltipWrapperRegex.test(html)) {
  html = html.replace(tooltipWrapperRegex, '<!-- Grid lines -->');
}

// Regex to find each chart-bar-col and inject the tooltip
const barRegex = /<div class="flex flex-col items-center gap-2 flex-1 h-full justify-end chart-bar-col([^"]*)"\s+data-date="([^"]+)"\s+data-shift="([^"]+)"\s+data-out="([^"]+)"\s+data-in="([^"]+)"\s+data-surplus="([^"]+)"\s+data-surplus-color="([^"]+)">\s*<div class="flex items-end/g;

html = html.replace(barRegex, (match, classes, date, shift, outVal, inVal, surplus, surplusColor) => {
  // Ensure the column has relative and group classes
  let newClasses = classes;
  if (!newClasses.includes('relative')) newClasses += ' relative';
  if (!newClasses.includes('group')) newClasses += ' group cursor-pointer';

  const tooltipHtml = `
                    <!-- Pure CSS Tooltip -->
                    <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#E2E8F0] shadow-lg rounded-lg p-3 w-48 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                      <div class="flex items-center justify-between mb-1.5 pb-1.5 border-b border-[#E2E8F0]">
                        <span class="text-[12px] font-bold text-[#0F172A]">${date}</span>
                        <span class="text-[10px] text-[#475569]">${shift}</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="text-[#475569] flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-slate-400"></span>Masuk</span>
                          <span class="font-mono font-bold text-[#0F172A]">${inVal}</span>
                        </div>
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="text-[#475569] flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-brand-blue"></span>Keluar</span>
                          <span class="font-mono font-bold text-[#0F172A]">${outVal}</span>
                        </div>
                        <div class="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-[#E2E8F0] border-dashed">
                          <span class="text-[#475569]">Selisih</span>
                          <span class="font-mono font-bold ${surplusColor}">${surplus}</span>
                        </div>
                      </div>
                      <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#E2E8F0] rotate-45"></div>
                    </div>
`;

  return `<div class="flex flex-col items-center gap-2 flex-1 h-full justify-end chart-bar-col${newClasses}"
                       data-date="${date}" data-shift="${shift}" data-out="${outVal}" data-in="${inVal}" data-surplus="${surplus}" data-surplus-color="${surplusColor}">
${tooltipHtml}
                    <div class="flex items-end`;
});

fs.writeFileSync(indexPath, html);
console.log('Tooltip HTML updated successfully.');
