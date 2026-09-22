document.addEventListener('DOMContentLoaded', () => {
  const tooltipWrapper = document.getElementById('chart-tooltip-wrapper');
  
  if (!tooltipWrapper) return;
  
  const tooltipDate = document.getElementById('tooltip-date');
  const tooltipShift = document.getElementById('tooltip-shift');
  const tooltipOut = document.getElementById('tooltip-out');
  const tooltipIn = document.getElementById('tooltip-in');
  const tooltipSurplus = document.getElementById('tooltip-surplus');
  
  const chartCols = document.querySelectorAll('.chart-bar-col');
  const chartContainer = document.querySelector('.chart-container');
  
  chartCols.forEach(col => {
    col.addEventListener('mouseenter', (e) => {
      // Get data
      const date = col.getAttribute('data-date');
      const shift = col.getAttribute('data-shift') || 'Shift 1 & 2';
      const outVal = col.getAttribute('data-out');
      const inVal = col.getAttribute('data-in');
      const surplusVal = col.getAttribute('data-surplus');
      const surplusColor = col.getAttribute('data-surplus-color') || 'text-emerald-400';
      
      // Update tooltip content
      if (tooltipDate) tooltipDate.textContent = date;
      if (tooltipShift) tooltipShift.textContent = shift;
      if (tooltipOut) tooltipOut.textContent = outVal;
      if (tooltipIn) tooltipIn.textContent = inVal;
      if (tooltipSurplus) {
        tooltipSurplus.textContent = surplusVal;
        tooltipSurplus.className = `font-mono font-semibold ${surplusColor}`;
      }
      
      // Position calculation
      const containerRect = chartContainer.getBoundingClientRect();
      const colRect = col.getBoundingClientRect();
      
      // Calculate position relative to container
      const relativeLeft = colRect.left - containerRect.left + (colRect.width / 2);
      
      tooltipWrapper.style.left = `${(relativeLeft / containerRect.width) * 100}%`;
      tooltipWrapper.classList.add('active');
    });
    
    col.addEventListener('mouseleave', () => {
      tooltipWrapper.classList.remove('active');
    });
  });

  // Global Search Logic
  const globalSearchInput = document.getElementById('global-search-input');
  const taskTableBody = document.getElementById('task-table-body');
  
  if (globalSearchInput && taskTableBody) {
    globalSearchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = taskTableBody.querySelectorAll('tr');
      
      rows.forEach(row => {
        // Get all text content from the row and convert to lowercase for case-insensitive search
        const textContent = row.textContent.toLowerCase();
        
        // Show row if it contains the search term, hide otherwise
        if (textContent.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
});


// Sidebar Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('sidebar-toggle');
  
  // Load preference
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
      const isCollapsed = document.body.classList.contains('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
  }
});


/* --- Extracted Inline Scripts --- */

/* From master-data-akses.html */

function openConfirmArrivalModal(po, vendor, vol, loc) {
  document.getElementById('modalPONumber').textContent = po;
  document.getElementById('modalVendor').textContent = vendor;
  document.getElementById('modalVolume').textContent = vol;
  document.getElementById('modalLocation').textContent = loc;
  document.getElementById('confirmArrivalModal').classList.remove('hidden');
}

function closeConfirmArrivalModal() {
  document.getElementById('confirmArrivalModal').classList.add('hidden');
}

if(document.getElementById('dischargePlanForm')) document.getElementById('dischargePlanForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Rencana Bongkar Tongkang diverifikasi! Surat izin bongkar & integrasi jembatan timbang diaktifkan.');
});


/* From procurement.html */

function openConfirmArrivalModal(po, vendor, vol, loc) {
  document.getElementById('modalPONumber').textContent = po;
  document.getElementById('modalVendor').textContent = vendor;
  document.getElementById('modalVolume').textContent = vol;
  document.getElementById('modalLocation').textContent = loc;
  document.getElementById('confirmArrivalModal').classList.remove('hidden');
}

function closeConfirmArrivalModal() {
  document.getElementById('confirmArrivalModal').classList.add('hidden');
}

if(document.getElementById('dischargePlanForm')) document.getElementById('dischargePlanForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Rencana Bongkar Tongkang diverifikasi! Surat izin bongkar & integrasi jembatan timbang diaktifkan.');
});


/* From warehouse-inventory.html */

    let currentTxMode = 'receipt';

    function switchTxTab(mode, btn) {
      currentTxMode = mode;
      const tabs = document.querySelectorAll('.tx-tab-btn');
      tabs.forEach(t => {
        t.className = 'tx-tab-btn px-4 py-2 rounded-lg font-medium text-[13px] transition-all bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer';
      });
      btn.className = 'tx-tab-btn px-4 py-2 rounded-lg font-semibold text-[13px] transition-all bg-[#1E3A8A] text-white shadow-xs cursor-pointer';

      const destGroup = document.getElementById('dest-wh-group');
      const labelSource = document.getElementById('label-source-wh');
      const refInput = document.getElementById('form-ref');

      if (mode === 'receipt') {
        labelSource.innerText = 'Penerimaan ke Depo/Gudang';
        destGroup.style.display = 'none';
        refInput.placeholder = 'No. PO Pabrik (misal: PO-GRN-2024-XXXX)';
      } else if (mode === 'issue') {
        labelSource.innerText = 'Gudang Pengeluaran (DO)';
        destGroup.style.display = 'none';
        refInput.placeholder = 'No. Delivery Order (misal: DO-SO-2024-XXXX)';
      } else if (mode === 'transfer') {
        labelSource.innerText = 'Gudang Asal (Pengirim)';
        destGroup.style.display = 'block';
        refInput.placeholder = 'No. Surat Jalan Transfer (misal: TF-PAD-XXXX)';
      } else if (mode === 'adjust') {
        labelSource.innerText = 'Gudang Opname / Penyesuaian';
        destGroup.style.display = 'none';
        refInput.placeholder = 'No. Berita Acara Opname (misal: BAP-ADJ-2024)';
      }
    }

    function calculateTonnage(val) {
      const sku = document.getElementById('form-sku').value;
      const count = parseFloat(val) || 0;
      let ton = 0;

      if (sku.includes('BULK')) {
        ton = count;
      } else if (sku.includes('50')) {
        ton = (count * 50) / 1000;
      } else {
        ton = (count * 40) / 1000;
      }
      document.getElementById('ton-converter').innerText = ton.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Ton';
    }

    function prefillTransaction(warehouse, sku) {
      document.getElementById('form-source-wh').value = warehouse;
      document.getElementById('form-sku').value = sku;
      document.getElementById('quick-transaction-panel').scrollIntoView({ behavior: 'smooth' });
      calculateTonnage(document.getElementById('form-qty').value);
    }

    function submitQuickTransaction() {
      const qty = document.getElementById('form-qty').value;
      const ref = document.getElementById('form-ref').value;
      const sku = document.getElementById('form-sku').value;
      const sourceWh = document.getElementById('form-source-wh').value;
      const operator = 'Budi Santoso';

      if (!qty || qty <= 0) {
        alert('Mohon masukkan kuantitas yang valid');
        return;
      }

      const tbody = document.getElementById('history-tbody');
      const newRow = document.createElement('tr');
      newRow.className = 'hover:bg-slate-50/80 transition-colors';

      const now = new Date();
      const timeStr = now.toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: 'numeric'}) + ' ' + 
                      now.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'});

      let badgeClass = 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]';
      let badgeText = 'Masuk (GRN)';
      let qtySign = '+' + qty;
      let qtyClass = 'text-[#15803D]';

      if (currentTxMode === 'issue') {
        badgeClass = 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
        badgeText = 'Keluar (DO)';
        qtySign = '-' + qty;
        qtyClass = 'text-[#DC2626]';
      } else if (currentTxMode === 'transfer') {
        badgeClass = 'bg-blue-50 text-[#1E3A8A] border border-blue-200';
        badgeText = 'Transfer Depo';
        qtySign = qty;
        qtyClass = 'text-[#0F172A]';
      } else if (currentTxMode === 'adjust') {
        badgeClass = 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]';
        badgeText = 'Penyesuaian';
        qtySign = '±' + qty;
        qtyClass = 'text-[#64748B]';
      }

      const unitLabel = sku.includes('BULK') ? 'MT' : 'Zak';

      newRow.innerHTML = `
        <td class="py-3 px-4 font-mono text-[#64748B] text-[12px]">${timeStr}</td>
        <td class="py-3 px-4 font-mono text-[#1E3A8A] font-semibold">${ref}</td>
        <td class="py-3 px-4">
          <div class="font-semibold text-[#0F172A]">${sku}</div>
          <div class="text-[11px] text-[#64748B]">${sourceWh}</div>
        </td>
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}">
            ${badgeText}
          </span>
        </td>
        <td class="py-3 px-4 text-right font-mono font-bold ${qtyClass}">${qtySign} ${unitLabel}</td>
        <td class="py-3 px-4 text-right font-mono font-bold text-[#0F172A]">Terupdate</td>
        <td class="py-3 px-4 text-[#475569]">${operator}</td>
      `;

      tbody.insertBefore(newRow, tbody.firstChild);

      document.getElementById('form-qty').value = '';
      document.getElementById('form-ref').value = '';
      document.getElementById('form-notes').value = '';
      document.getElementById('ton-converter').innerText = '0.00 Ton';

      alert('Transaksi berhasil dicatat ke buku mutasi gudang.');
    }

    function filterStockTable() {
      const skuFilter = document.getElementById('filter-sku-input').value.toLowerCase();
      const whFilter = document.getElementById('filter-warehouse-select').value;
      const statusFilter = document.getElementById('filter-status-select').value;
      
      const rows = document.querySelectorAll('#inventory-table tbody tr');

      rows.forEach(row => {
        const textContent = row.innerText.toLowerCase();
        const warehouseMatch = (whFilter === 'ALL') || textContent.includes(whFilter.toLowerCase());
        const statusMatch = (statusFilter === 'ALL') || textContent.includes(statusFilter.toLowerCase());
        const skuMatch = textContent.includes(skuFilter);

        if (warehouseMatch && statusMatch && skuMatch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  


/* From distribution-planning.html */

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
  }

  function populateSoForm(soNumber, originWh, clientAddress, volumeInfo) {
    document.getElementById('input-so-ref').value = soNumber;
    document.getElementById('banner-so-number').innerText = soNumber + ' • ' + clientAddress.split(' - ')[0];
    document.getElementById('banner-so-detail').innerText = volumeInfo + ' • Pengambilan: ' + originWh;
    
    // Auto scroll smoothly to form
    const formSection = document.getElementById('delivery-form');
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Sales Order ' + soNumber + ' dipilih ke formulir manual.');
  }

  function handleCreateDO(e) {
    e.preventDefault();
    const soNumber = document.getElementById('input-so-ref').value;
    const driver = document.getElementById('input-driver-name').value;
    const plate = document.getElementById('input-truck-plate').value;
    const phone = document.getElementById('input-driver-phone').value;
    const origin = document.getElementById('input-origin-wh').value;
    const eta = document.getElementById('input-eta').value;

    const newDoNumber = 'DO-PAD-2410-0' + Math.floor(423 + Math.random() * 30);

    const tbody = document.getElementById('dispatch-table-body');
    const newRow = document.createElement('tr');
    newRow.className = 'hover:bg-slate-50/80 transition-colors bg-blue-50/40';

    newRow.innerHTML = `
      <td class="py-3 px-space-md">
        <span class="font-code-sm font-bold text-text-main">${newDoNumber}</span>
        <span class="block text-[10px] text-brand-blue-royal font-semibold">Baru Terbit</span>
      </td>
      <td class="py-3 px-space-md font-code-sm text-text-secondary">${soNumber}</td>
      <td class="py-3 px-space-md">
        <div class="font-label-md font-semibold text-text-main">${driver}</div>
        <div class="font-code-sm text-[11px] text-text-secondary">${plate}</div>
        <div class="text-[10px] text-text-muted">HP: ${phone}</div>
      </td>
      <td class="py-3 px-space-md">
        <div class="font-body-sm font-medium text-text-main truncate max-w-xs">Proyek Tertera di SO</div>
        <div class="text-text-muted text-[11px]">Asal: ${origin}</div>
      </td>
      <td class="py-3 px-space-md text-text-secondary font-code-sm">
        Baru Dijadwalkan
        <span class="block text-[10px] text-text-muted">ETA: ${eta} WIB</span>
      </td>
      <td class="py-3 px-space-md">
        <span class="inline-flex items-center px-2.5 py-1 rounded text-label-sm font-semibold bg-warning-bg text-warning-text border border-warning-border">
          Persiapan Muat
        </span>
      </td>
      <td class="py-3 px-space-md text-right">
        <button onclick="openStatusModal('${newDoNumber}', '${driver} (${plate})', 'Persiapan Muat')" class="h-7 px-space-sm bg-slate-100 hover:bg-slate-200 border border-border-subtle rounded text-label-sm font-semibold text-text-main inline-flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined text-[15px]">edit_note</span>
          <span>Update Status</span>
        </button>
      </td>
    `;

    tbody.insertBefore(newRow, tbody.firstChild);

    // Add DO to the quick select options
    const select = document.getElementById('quick-do-select');
    const opt = document.createElement('option');
    opt.value = newDoNumber;
    opt.innerText = newDoNumber + ' (' + driver + ')';
    opt.selected = true;
    select.insertBefore(opt, select.firstChild);

    showToast('Surat Jalan ' + newDoNumber + ' berhasil dibuat & siap cetak!');
  }

  function handleQuickUpdate() {
    const doNum = document.getElementById('quick-do-select').value;
    const newStatus = document.getElementById('quick-status-select').value;
    const notes = document.getElementById('quick-status-notes').value;
    
    showToast('Status ' + doNum + ' berhasil diubah menjadi: ' + newStatus);
  }

  function openStatusModal(doNum, driverTruck, currentStatus) {
    document.getElementById('modal-do-number').innerText = doNum;
    document.getElementById('modal-driver-truck').innerText = driverTruck;
    
    const radios = document.getElementsByName('modal-status-choice');
    for (let r of radios) {
      if (r.value === currentStatus) {
        r.checked = true;
      }
    }

    document.getElementById('status-modal').classList.remove('hidden');
  }

  function closeStatusModal() {
    document.getElementById('status-modal').classList.add('hidden');
  }

  function saveModalStatus() {
    const doNum = document.getElementById('modal-do-number').innerText;
    let selectedStatus = 'Tiba di Lokasi';
    const radios = document.getElementsByName('modal-status-choice');
    for (let r of radios) {
      if (r.checked) {
        selectedStatus = r.value;
        break;
      }
    }
    closeStatusModal();

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
  }

  function populateSoForm(soNumber, originWh, clientAddress, volumeInfo) {
    document.getElementById('input-so-ref').value = soNumber;
    document.getElementById('banner-so-number').innerText = soNumber + ' • ' + clientAddress.split(' - ')[0];
    document.getElementById('banner-so-detail').innerText = volumeInfo + ' • Pengambilan: ' + originWh;
    
    // Auto scroll smoothly to form
    const formSection = document.getElementById('delivery-form');
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Sales Order ' + soNumber + ' dipilih ke formulir manual.');
  }

  function handleCreateDO(e) {
    e.preventDefault();
    const soNumber = document.getElementById('input-so-ref').value;
    const driver = document.getElementById('input-driver-name').value;
    const plate = document.getElementById('input-truck-plate').value;
    const phone = document.getElementById('input-driver-phone').value;
    const origin = document.getElementById('input-origin-wh').value;
    const eta = document.getElementById('input-eta').value;

    const newDoNumber = 'DO-PAD-2410-0' + Math.floor(423 + Math.random() * 30);

    const tbody = document.getElementById('dispatch-table-body');
    const newRow = document.createElement('tr');
    newRow.className = 'hover:bg-slate-50/80 transition-colors bg-blue-50/40';

    newRow.innerHTML = `
      <td class="py-3 px-space-md">
        <span class="font-code-sm font-bold text-text-main">${newDoNumber}</span>
        <span class="block text-[10px] text-brand-blue-royal font-semibold">Baru Terbit</span>
      </td>
      <td class="py-3 px-space-md font-code-sm text-text-secondary">${soNumber}</td>
      <td class="py-3 px-space-md">
        <div class="font-label-md font-semibold text-text-main">${driver}</div>
        <div class="font-code-sm text-[11px] text-text-secondary">${plate}</div>
        <div class="text-[10px] text-text-muted">HP: ${phone}</div>
      </td>
      <td class="py-3 px-space-md">
        <div class="font-body-sm font-medium text-text-main truncate max-w-xs">Proyek Tertera di SO</div>
        <div class="text-text-muted text-[11px]">Asal: ${origin}</div>
      </td>
      <td class="py-3 px-space-md text-text-secondary font-code-sm">
        Baru Dijadwalkan
        <span class="block text-[10px] text-text-muted">ETA: ${eta} WIB</span>
      </td>
      <td class="py-3 px-space-md">
        <span class="inline-flex items-center px-2.5 py-1 rounded text-label-sm font-semibold bg-warning-bg text-warning-text border border-warning-border">
          Persiapan Muat
        </span>
      </td>
      <td class="py-3 px-space-md text-right">
        <button onclick="openStatusModal('${newDoNumber}', '${driver} (${plate})', 'Persiapan Muat')" class="h-7 px-space-sm bg-slate-100 hover:bg-slate-200 border border-border-subtle rounded text-label-sm font-semibold text-text-main inline-flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined text-[15px]">edit_note</span>
          <span>Update Status</span>
        </button>
      </td>
    `;

    tbody.insertBefore(newRow, tbody.firstChild);

    // Add DO to the quick select options
    const select = document.getElementById('quick-do-select');
    const opt = document.createElement('option');
    opt.value = newDoNumber;
    opt.innerText = newDoNumber + ' (' + driver + ')';
    opt.selected = true;
    select.insertBefore(opt, select.firstChild);

    showToast('Surat Jalan ' + newDoNumber + ' berhasil dibuat & siap cetak!');
  }

  function handleQuickUpdate() {
    const doNum = document.getElementById('quick-do-select').value;
    const newStatus = document.getElementById('quick-status-select').value;
    const notes = document.getElementById('quick-status-notes').value;
    
    showToast('Status ' + doNum + ' berhasil diubah menjadi: ' + newStatus);
  }

  function openStatusModal(doNum, driverTruck, currentStatus) {
    document.getElementById('modal-do-number').innerText = doNum;
    document.getElementById('modal-driver-truck').innerText = driverTruck;
    
    const radios = document.getElementsByName('modal-status-choice');
    for (let r of radios) {
      if (r.value === currentStatus) {
        r.checked = true;
      }
    }

    document.getElementById('status-modal').classList.remove('hidden');
  }

  function closeStatusModal() {
    document.getElementById('status-modal').classList.add('hidden');
  }

  function saveModalStatus() {
    const doNum = document.getElementById('modal-do-number').innerText;
    let selectedStatus = 'Tiba di Lokasi';
    const radios = document.getElementsByName('modal-status-choice');
    for (let r of radios) {
      if (r.checked) {
        selectedStatus = r.value;
        break;
      }
    }
    closeStatusModal();
    showToast('Status fisik ' + doNum + ' diperbarui ke "' + selectedStatus + '"');
  }

  // Quick live search filter on SO list
  const soSearch = document.getElementById('so-search');
  if (soSearch) {
    soSearch.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
\n
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
    
  const tabAr = document.getElementById('tab-ar');
  const tabAp = document.getElementById('tab-ap');
  const ledgerTableBody = document.getElementById('ledger-table-body');

  const apDataHtml = `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-2.5 px-space-md font-code-sm text-code-sm font-semibold text-[#1e3a8a]">AP/SIG/24/10/7710</td>
      <td class="py-2.5 px-space-sm font-code-sm text-[12px] text-outline">02/10/2024</td>
      <td class="py-2.5 px-space-md font-medium text-on-surface truncate max-w-[200px]">PT Semen Indonesia (Persero) Tbk - Pabrik Tuban</td>
      <td class="py-2.5 px-space-md font-code-sm text-code-sm text-right text-on-surface">2.450.000.000</td>
      <td class="py-2.5 px-space-md font-code-sm text-code-sm text-right text-on-surface-variant">1.000.000.000</td>
      <td class="py-2.5 px-space-md font-code-sm text-code-sm font-semibold text-right text-on-surface">1.450.000.000</td>
      <td class="py-2.5 px-space-sm font-code-sm text-[12px] text-on-surface">31/10/2024</td>
      <td class="py-2.5 px-space-md text-center">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
          Parsial
        </span>
      </td>
      <td class="py-2.5 px-space-sm text-center">
        <button class="p-1 hover:bg-slate-100 rounded text-outline hover:text-on-surface cursor-pointer"><span class="material-symbols-outlined text-[16px]">visibility</span></button>
      </td>
    </tr>
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-2.5 px-space-md font-code-sm text-code-sm font-semibold text-[#1e3a8a]">AP/SIG/24/10/7719</td>
      <td class="py-2.5 px-space-sm font-code-sm text-[12px] text-outline">15/10/2024</td>
      <td class="py-2.5 px-space-md font-medium text-on-surface truncate max-w-[200px]">PT Semen Gresik Distribusi Jatim</td>
      <td class="py-2.5 px-space-md font-code-sm text-code-sm text-right text-on-surface">870.400.000</td>
      <td class="py-2.5 px-space-md font-code-sm text-code-sm text-right text-on-surface-variant">0</td>
      <td class="py-2.5 px-space-md font-code-sm text-code-sm font-semibold text-right text-on-surface">870.400.000</td>
      <td class="py-2.5 px-space-sm font-code-sm text-[12px] text-on-surface">14/11/2024</td>
      <td class="py-2.5 px-space-md text-center">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Belum Bayar
        </span>
      </td>
      <td class="py-2.5 px-space-sm text-center">
        <button class="p-1 hover:bg-slate-100 rounded text-outline hover:text-on-surface cursor-pointer"><span class="material-symbols-outlined text-[16px]">payments</span></button>
      </td>
    </tr>
  `;

  const arDataOriginal = ledgerTableBody.innerHTML;

  tabAr.addEventListener('click', () => {
    tabAr.className = "px-space-md py-1 rounded-md bg-[#1e3a8a] text-white font-headline-md text-label-md font-semibold shadow-xs transition-all cursor-pointer";
    tabAp.className = "px-space-md py-1 rounded-md text-on-surface-variant font-headline-md text-label-md font-semibold hover:text-on-surface hover:bg-slate-100 transition-all cursor-pointer";
    ledgerTableBody.innerHTML = arDataOriginal;
  });

  tabAp.addEventListener('click', () => {
    tabAp.className = "px-space-md py-1 rounded-md bg-[#1e3a8a] text-white font-headline-md text-label-md font-semibold shadow-xs transition-all cursor-pointer";
    tabAr.className = "px-space-md py-1 rounded-md text-on-surface-variant font-headline-md text-label-md font-semibold hover:text-on-surface hover:bg-slate-100 transition-all cursor-pointer";
    ledgerTableBody.innerHTML = apDataHtml;
  });

  const doSelector = document.getElementById('do-selector');
  const btnPullDo = document.getElementById('btn-pull-do');
  const doDisplayNo = document.getElementById('do-display-no');
  const doDisplayCustomer = document.getElementById('do-display-customer');

  btnPullDo.addEventListener('click', () => {
    const selected = doSelector.value;
    doDisplayNo.textContent = selected;
    if(selected.includes('8842')) {
      doDisplayCustomer.textContent = "CV Sinar Bangunan Jaya";
    } else if (selected.includes('8843')) {
      doDisplayCustomer.textContent = "PT Wijaya Karya Beton";
    } else {
      doDisplayCustomer.textContent = "PT Adhi Karya Tbk";
    }
    btnPullDo.classList.add('bg-[#DCFCE7]', 'text-[#15803D]', 'border-[#BBF7D0]');
    btnPullDo.textContent = "Data Berhasil Dimuat!";
    setTimeout(() => {
      btnPullDo.classList.remove('bg-[#DCFCE7]', 'text-[#15803D]', 'border-[#BBF7D0]');
      btnPullDo.innerHTML = `<span class="material-symbols-outlined text-[16px] text-[#1e3a8a]">sync</span> Tarik Detail DO`;
    }, 1400);
  });

  const receiptInvPicker = document.getElementById('receipt-inv-picker');
  const receiptCustomerName = document.getElementById('receipt-customer-name');
  const receiptOutstandingVal = document.getElementById('receipt-outstanding-val');
  const paymentAmountInput = document.getElementById('payment-amount-input');

  receiptInvPicker.addEventListener('change', (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const saldo = parseInt(selectedOption.getAttribute('data-saldo'), 10);
    const cust = selectedOption.getAttribute('data-cust');

    
    receiptCustomerName.textContent = cust;
    receiptOutstandingVal.textContent = "Rp " + saldo.toLocaleString('id-ID');
    paymentAmountInput.value = saldo.toLocaleString('id-ID');
  });

  const btnPublish = document.getElementById('btn-publish-invoice');
  const btnPostPayment = document.getElementById('btn-post-payment');

  function showActionToast(msg) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-space-md py-space-sm rounded-lg shadow-xl font-label-md text-label-md flex items-center gap-space-sm transition-all duration-300 transform translate-y-2 opacity-0";
    toast.innerHTML = `<span class="material-symbols-outlined text-[#15803D] text-[20px]">check_circle</span> <span>${msg}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 50);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  btnPublish.addEventListener('click', () => {
    showActionToast("Invoice INV/PAD/2024/10/0942 berhasil diterbitkan &amp; tercatat di Buku AR!");
  });

  btnPostPayment.addEventListener('click', () => {
    showActionToast("Pelunasan Rp " + paymentAmountInput.value + " berhasil diposting ke Jurnal Kas!");
  });

  }
})();
\n
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
