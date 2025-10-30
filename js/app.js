document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot tr');
  const addProductBtn = document.getElementById('add-product');
  const addWorkTypeBtn = document.getElementById('add-work-type');
  const exportBtn = document.getElementById('export-csv');
  const navButtons = document.querySelectorAll('#top-buttons button');
  const views = document.querySelectorAll('#views .view');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-view') + '-view';
      views.forEach(view => {
        view.classList.toggle('active', view.id === target);
      });
    });
  });

  // Helper: Recalculate totals
  function updateTotals() {
    const totals = Array.from(table.rows[0].cells)
      .map((_, i) => i >= 1 && i <= table.rows[0].cells.length - 3 ? 0 : null);

    Array.from(tbody.rows).forEach(row => {
      let rowTotal = 0;
      for (let i = 1; i < row.cells.length - 2; i++) {
        const input = row.cells[i].querySelector('input');
        const val = parseFloat(input?.value || 0);
        rowTotal += val;
        totals[i - 1] += val;
      }
      row.cells[row.cells.length - 2].textContent = rowTotal;
    });

    totals.forEach((val, i) => {
      if (val !== null) tfoot.cells[i + 1].textContent = val;
    });

    const grandTotal = totals.reduce((sum, val) => sum + (val || 0), 0);
    tfoot.cells[tfoot.cells.length - 2].textContent = grandTotal;
  }

  // Add new product row
  addProductBtn.addEventListener('click', () => {
    const row = document.createElement('tr');
    const workTypes = table.rows[0].cells.length - 3;

    row.innerHTML = `<td>New Product</td>` +
      Array(workTypes).fill().map((_, i) => {
        const isEnhancement = i === 2; // Assuming Enhancements is the 3rd column
        return `<td><input type="number" value="0" ${isEnhancement ? 'disabled' : ''} /></td>`;
      }).join('') +
      `<td>0</td><td><button class="delete-btn">Delete</button></td>`;

    tbody.appendChild(row);
    updateTotals();
  });

  // Add new work type column
  addWorkTypeBtn.addEventListener('click', () => {
    const newHeader = document.createElement('th');
    newHeader.textContent = `Work Type ${table.rows[0].cells.length - 4 + 1}`;
    table.rows[0].insertBefore(newHeader, table.rows[0].cells[table.rows[0].cells.length - 2]);

    Array.from(tbody.rows).forEach(row => {
      const cell = document.createElement('td');
      cell.innerHTML = `<input type="number" value="0" />`;
      row.insertBefore(cell, row.cells[row.cells.length - 2]);
    });

    const totalCell = document.createElement('td');
    totalCell.textContent = '0';
    tfoot.insertBefore(totalCell, tfoot.cells[tfoot.cells.length - 2]);

    updateTotals();
  });

  // Delete product row
  tbody.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
      e.target.closest('tr').remove();
      updateTotals();
    }
  });

  // Recalculate on input change
  tbody.addEventListener('input', e => {
    if (e.target.tagName === 'INPUT') updateTotals();
  });

  // Export to CSV
  exportBtn.addEventListener('click', () => {
    let csv = [];
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cols = row.querySelectorAll('th, td');
      const rowData = Array.from(cols).map(col => {
        const input = col.querySelector('input');
        return input ? input.value : col.textContent.trim();
      });
      csv.push(rowData.join(','));
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'operating-model.csv';
    link.click();
  });

  // Initial totals
  updateTotals();

  // Recalculate enhancement totals in Demand Planning
  function updateEnhancementTotals() {
    const demandRows = document.querySelectorAll('#demand-table tbody tr');
    const enhancementMap = {};

    demandRows.forEach(row => {
      const product = row.cells[0].textContent.trim();
      let total = 0;
      for (let i = 1; i <= 3; i++) {
        const val = parseFloat(row.cells[i].querySelector('input')?.value || 0);
        total += val;
      }
      row.querySelector('.enh-total').textContent = total;
      enhancementMap[product] = total;
    });

    // Update Operating Model Enhancements column
    const opRows = document.querySelectorAll('#calculator tbody tr');
    opRows.forEach(row => {
      const product = row.cells[0].textContent.trim();
      const enhCell = row.cells[3].querySelector('input');
      if (enhCell) {
        enhCell.value = enhancementMap[product] || 0;
      }
    });

    updateTotals();
  }

  // Trigger recalculation when demand inputs change
  document.querySelector('#demand-table').addEventListener('input', updateEnhancementTotals);

  function updateCapacityAnalysis() {
    const demandMap = {};

    // Use the Operating Model table inside #calculator
    const opTable = document.querySelector('#calculator table');
    const opRows = opTable.querySelectorAll('tbody tr');

    opRows.forEach(row => {
      const product = row.cells[0].textContent.trim();
      const totalCell = row.cells[4]; // Total column index
      const total = parseFloat(totalCell.textContent || 0);
      demandMap[product] = total;
    });

    // Now update the Capacity Analysis table
    const capTable = document.querySelector('#capacity-table');
    const capRows = capTable.querySelectorAll('tbody tr');

    capRows.forEach(row => {
      const product = row.cells[0].textContent.trim();
      const capacityInput = row.cells[1].querySelector('input');
      const demandCell = row.querySelector('.total-demand');
      const varianceCell = row.querySelector('.variance');

      const capacity = parseFloat(capacityInput?.value || 0);
      const demand = demandMap[product] || 0;
      const variance = capacity - demand;

      demandCell.textContent = demand;
      varianceCell.textContent = variance;

      varianceCell.classList.toggle('negative', variance < 0);
    });
  }

  // Trigger updates when capacity changes or operating model updates
  document.querySelector('#capacity-table').addEventListener('input', updateCapacityAnalysis);
  tbody.addEventListener('input', updateCapacityAnalysis);
});

