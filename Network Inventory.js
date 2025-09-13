// --- DATA ---
let offices = [{
    id: 1, name: 'Main Office',
    switches: [
        { itemId: 1, name: 'Core Switch 1', ports: Array.from({length: 24}, (_, i) => ({ portId: i + 1, pcname: '', department: '', ipAddress: '', mac: '', status: 'inactive', remarks: '' })) },
        { itemId: 2, name: 'Access Switch A-Wing', ports: Array.from({length: 16}, (_, i) => ({ portId: i + 1, pcname: '', department: '', ipAddress: '', mac: '', status: 'inactive', remarks: '' })) }
    ],
    patchPanels: [
        { itemId: 1, name: 'IDF-01 Patch Panel A', ports: Array.from({length: 24}, (_, i) => ({ portId: i + 1, user: '', department: '', pcname: '', location: '', status: 'inactive', remarks: '' })) }
    ],
    routers: [
        { itemId: 1, name: 'Edge Router', ports: Array.from({length: 8}, (_, i) => ({ portId: i + 1, interface: `Gi0/${i}`, ipAddress: '', subnet: '', status: 'inactive', remarks: '' })) }
    ]
}];
let activeOfficeId = 1;

// --- INITIALIZATION ---
function initializeWithSampleData() {
    const office = offices[0];
    // Sample Switch Data
    office.switches[0].ports[0] = { portId: 1, pcname: 'SRV-DC01', department: 'IT', ipAddress: '192.168.1.10', mac: '0A-1B-2C-3D-4E-5F', status: 'active', remarks: 'Domain Controller' };
    office.switches[0].ports[1] = { portId: 2, pcname: 'SRV-FS01', department: 'IT', ipAddress: '192.168.1.11', mac: '0A-1B-2C-3D-4E-6A', status: 'active', remarks: 'File Server' };
    office.switches[1].ports[4] = { portId: 5, pcname: 'FIN-PC05', department: 'Finance', ipAddress: '192.168.2.25', mac: '0B-2C-3D-4E-5F-7B', status: 'active', remarks: '' };
    // Sample Patch Panel Data
    office.patchPanels[0].ports[0] = { portId: 1, user: 'John Doe', department: 'IT', pcname: 'IT-DEV01', location: 'A-101', status: 'active', remarks: 'Dev machine' };
    office.patchPanels[0].ports[1] = { portId: 2, user: 'Jane Smith', department: 'HR', pcname: 'HR-PC01', location: 'B-203', status: 'active', remarks: 'Manager' };
    // Sample Router Data
    office.routers[0].ports[0] = { portId: 1, interface: 'Gi0/0', ipAddress: '203.0.113.1', subnet: '255.255.255.252', status: 'active', remarks: 'ISP Uplink' };
    office.routers[0].ports[1] = { portId: 2, interface: 'Gi0/1', ipAddress: '192.168.1.1', subnet: '255.255.255.0', status: 'active', remarks: 'Internal LAN' };

    renderAll();
    renderTabs();
}

// --- THEME ---
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zM11 17a1 1 0 10-2 0v1a1 1 0 102 0v-1z"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>`;

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// --- MODAL CONTROLS ---
const switchModal = document.getElementById('switch-config-modal');

function showSwitchModal() {
    switchModal.classList.add('visible');
}

function hideSwitchModal() {
    switchModal.classList.remove('visible');
}

// --- CRUD & RENDER ---
const getActiveOffice = () => offices.find(o => o.id === activeOfficeId);

function renderAll() {
    const office = getActiveOffice();
    if (!office) {
        document.getElementById('switches-visuals').innerHTML = '';
        document.getElementById('patch-panel-visuals').innerHTML = '';
        document.getElementById('routers-visuals').innerHTML = '';
        return;
    }
    renderGeneric('switches', office.switches, 'switches-visuals', 'View Connections');
    renderGeneric('patchPanels', office.patchPanels, 'patch-panel-visuals', 'View Details');
    renderGeneric('routers', office.routers, 'routers-visuals', 'View Config');
}

function renderGeneric(type, items, containerId, buttonText) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'rounded-lg p-4';
        itemDiv.style.backgroundColor = 'var(--bg-hover)';
        itemDiv.style.border = '1px solid var(--border-color)';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex justify-between items-center mb-4 gap-2';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'editable-title-input';
        titleInput.value = item.name;
        titleInput.onblur = (e) => updateItemName(type, item.itemId, e.target.value);
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'flex items-center gap-2 flex-shrink-0';
        buttonsDiv.innerHTML = `
            <button onclick="openSidebar('${type}', ${item.itemId})" class="text-white font-semibold py-1 px-3 rounded-full text-xs transition-colors" style="background-color: var(--primary);">${buttonText}</button>
            <button onclick="deleteItem('${type}', ${item.itemId})" class="text-white font-semibold p-1.5 rounded-full text-xs transition-colors" style="background-color: var(--danger);"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></button>
        `;
        
        headerDiv.appendChild(titleInput);
        headerDiv.appendChild(buttonsDiv);
        itemDiv.appendChild(headerDiv);

        const grid = document.createElement('div');
        const cols = item.ports.length > 16 ? 12 : 8;
        grid.className = `grid grid-cols-6 sm:grid-cols-8 md:grid-cols-${cols} gap-3`;
        item.ports.forEach(port => {
            const portDiv = document.createElement('div');
            portDiv.className = 'rj45-port';
            portDiv.innerHTML = `<span class="port-number">${port.portId}</span><div class="port-light ${port.status === 'active' ? 'active' : ''}"></div>`;
            portDiv.onclick = (e) => { e.stopPropagation(); showPortDetailsPopup(e, type, item.itemId, port.portId); };
            grid.appendChild(portDiv);
        });
        itemDiv.appendChild(grid);
        container.appendChild(itemDiv);
    });
}

function createSwitch(portCount) {
    const office = getActiveOffice();
    if (!office) return;

    const nextId = (office.switches.length > 0 ? Math.max(...office.switches.map(s => s.itemId)) : 0) + 1;
    const newSwitch = { 
        itemId: nextId, 
        name: `Switch ${nextId}`, 
        ports: Array.from({ length: portCount }, (_, i) => ({ 
            portId: i + 1, pcname: '', department: '', ipAddress: '', mac: '', status: 'inactive', remarks: '' 
        })) 
    };
    
    office.switches.push(newSwitch);
    renderAll();
    hideSwitchModal();
}

function addSwitch() {
    showSwitchModal();
}

function addPanel() {
    const office = getActiveOffice();
    const nextId = (office.patchPanels.length > 0 ? Math.max(...office.patchPanels.map(p => p.itemId)) : 0) + 1;
    const newPanel = { itemId: nextId, name: `Patch Panel ${nextId}`, ports: [] };
    for (let i = 1; i <= 24; i++) {
        newPanel.ports.push({ portId: i, user: '', department: '', pcname: '', location: '', status: 'inactive', remarks: '' });
    }
    office.patchPanels.push(newPanel);
    renderAll();
}

function addRouter() {
    const office = getActiveOffice();
    const nextId = (office.routers.length > 0 ? Math.max(...office.routers.map(r => r.itemId)) : 0) + 1;
    const newRouter = { itemId: nextId, name: `Router ${nextId}`, ports: [] };
    for (let i = 1; i <= 8; i++) {
        newRouter.ports.push({ portId: i, interface: `Gi0/${i-1}`, ipAddress: '', subnet: '', status: 'inactive', remarks: '' });
    }
    office.routers.push(newRouter);
    renderAll();
}

let pendingDelete = { type: null, itemId: null };

function deleteItem(type, itemId) {
    if (type === 'offices' && offices.length === 1) {
        // Show warning modal instead of deleting
        document.getElementById('last-office-modal').classList.add('visible');
        return;
    }

    // Store what to delete and show delete confirmation modal
    pendingDelete = { type, itemId };
    document.getElementById('delete-confirm-modal').classList.add('visible');
}


function confirmDelete() {
    const { type, itemId } = pendingDelete;
    if (!type || !itemId) return;

    if (type === 'offices') {
        offices = offices.filter(o => o.id !== itemId);

        // Switch to first office if deleted active one
        if (activeOfficeId === itemId && offices.length > 0) {
        activeOfficeId = offices[0].id;
        }

        renderAll();
        renderTabs();
        closeDeleteModal();
        return;
    }

    // Existing logic for switches, panels, routers...
    const office = getActiveOffice();
    office[type] = office[type].filter(item => item.itemId !== itemId);
    
    const sidebar = document.getElementById('details-sidebar');
    if (!sidebar.classList.contains('hidden') && sidebar.dataset.type === type && sidebar.dataset.itemId == itemId) {
        closeSidebar();
    }

    renderAll();
    closeDeleteModal();
}

function closeDeleteModal() {
    document.getElementById('delete-confirm-modal').classList.remove('visible');
    pendingDelete = { type: null, itemId: null };
}

function updateItemName(type, itemId, newName) {
    if (!newName.trim()) {
        renderAll(); // Re-render to restore original name if input is empty
        return;
    };
    const item = getActiveOffice()[type].find(i => i.itemId === itemId);
    if (item) item.name = newName.trim();
}

function updateData(type, itemId, portId, field, newValue) {
    const item = getActiveOffice()[type].find(i => i.itemId == itemId);
    if (item) {
        const port = item.ports.find(p => p.portId == portId);
        if (port) port[field] = newValue;
    }
}

function toggleStatus(type, itemId, portId) {
    const port = getActiveOffice()[type].find(i => i.itemId == itemId).ports.find(p => p.portId == portId);
    if (port) {
        port.status = port.status === 'active' ? 'inactive' : 'active';
        renderAll(); 
        openSidebar(type, itemId); 
    }
}

// --- TABS & SIDEBAR ---
function renderTabs() {
    const tabsContainer = document.getElementById('office-tabs');
    tabsContainer.innerHTML = '';

    offices.forEach(office => {
        const tab = document.createElement('div');
        tab.className = `tab flex items-center gap-2 ${office.id === activeOfficeId ? 'active' : ''}`;
        tab.onclick = () => switchOffice(office.id);

        // Editable office name
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'editable-office-title';
        titleInput.value = office.name;
        titleInput.readOnly = true;
        titleInput.style.width = `${office.name.length}ch`;

        titleInput.addEventListener('click', (e) => {
            e.stopPropagation();
            titleInput.readOnly = false;
            titleInput.focus();
        });

        const saveName = () => {
            titleInput.readOnly = true;
            if (titleInput.value.trim() !== '') {
                office.name = titleInput.value.trim();
                titleInput.style.width = `${office.name.length}ch`;
            } else {
                titleInput.value = office.name;
            }
        };

        titleInput.addEventListener('blur', saveName);
        titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                titleInput.blur();
        }
        });
        titleInput.addEventListener('input', () => {
            titleInput.style.width = `${Math.max(5, titleInput.value.length)}ch`;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`;
        deleteBtn.className = "p-1.5 rounded-full transition-colors";
        deleteBtn.style.backgroundColor = "var(--danger)";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteItem('offices', office.id);
        };

        tab.appendChild(titleInput);
        tab.appendChild(deleteBtn);

        tabsContainer.appendChild(tab);
    });

    const addButton = document.createElement('button');
    addButton.className = 'add-tab-button';
    addButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>`;
    addButton.onclick = addOfficeTab;
    tabsContainer.appendChild(addButton);
}

function switchOffice(id) { 
    activeOfficeId = id; 
    renderAll(); 
    renderTabs(); 
    closeSidebar(); 
}

function addOfficeTab() {
    const nextId = offices.length > 0 ? Math.max(...offices.map(o => o.id)) + 1 : 1;
    const newOffice = {
        id: nextId,
        name: `Office ${nextId}`,
        switches: [],
        patchPanels: [],
        routers: []
    };
    
    offices.push(newOffice);
    switchOffice(nextId);
}

function openSidebar(type, itemId) {
    const sidebar = document.getElementById('details-sidebar');
    const item = getActiveOffice()[type].find(i => i.itemId == itemId);
    if (!item) return;

    sidebar.classList.remove('hidden');
    sidebar.dataset.type = type;
    sidebar.dataset.itemId = itemId;
    document.getElementById('sidebar-title').innerText = item.name;

    let headers, portFields;
    switch(type) {
        case 'switches':
            headers = ['Port', 'PC Name', 'Dept.', 'IP Address', 'MAC', 'Status', 'Remarks'];
            portFields = ['pcname', 'department', 'ipAddress', 'mac'];
            break;
        case 'patchPanels':
            headers = ['Port', 'User', 'Dept.', 'PC Name', 'Location', 'Status', 'Remarks'];
            portFields = ['user', 'department', 'pcname', 'location'];
            break;
        case 'routers':
            headers = ['Port', 'Interface', 'IP Address', 'Subnet', 'Status', 'Remarks'];
            portFields = ['interface', 'ipAddress', 'subnet'];
            break;
    }

    document.getElementById('sidebar-table-header').innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const body = document.getElementById('sidebar-table-body');
    body.innerHTML = '';
    item.ports.forEach(port => {
        const tr = document.createElement('tr');
        let cells = `<td>${port.portId}</td>`;
        portFields.forEach(field => {
            cells += `<td class="table-cell-editable" data-field="${field}" contenteditable="true">${port[field] || ''}</td>`;
        });
        cells += `
            <td><button onclick="toggleStatus('${type}', ${itemId}, ${port.portId})" class="text-white text-xs font-bold py-1 px-3 rounded-full ${port.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}">${port.status}</button></td>
            <td class="table-cell-editable" data-field="remarks" contenteditable="true">${port.remarks || ''}</td>`;
        tr.innerHTML = cells;
        tr.dataset.portId = port.portId;
        body.appendChild(tr);
    });
    
    body.querySelectorAll('.table-cell-editable').forEach(cell => {
        cell.addEventListener('blur', e => {
            const row = e.target.closest('tr');
            updateData(type, itemId, row.dataset.portId, e.target.dataset.field, e.target.innerText.trim());
        });
    });
}

function closeSidebar() { document.getElementById('details-sidebar').classList.add('hidden'); }

// --- POPUP ---
function closePopup() { 
    const popup = document.getElementById('port-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function showPortDetailsPopup(e, type, itemId, portId) {
    const popup = document.getElementById('port-popup');
    const activeOffice = getActiveOffice();
    const item = activeOffice[type].find(i => i.itemId == itemId);
    const port = item.ports.find(p => p.portId == portId);
    
    const rect = e.currentTarget.getBoundingClientRect();
    let content = '';

    switch(type) {
        case 'switches':
            content = `
                <p><strong>PC Name:</strong> ${port.pcname || 'N/A'}</p>
                <p><strong>Department:</strong> ${port.department || 'N/A'}</p>
                <p><strong>IP Address:</strong> ${port.ipAddress || 'N/A'}</p>
                <p><strong>MAC:</strong> ${port.mac || 'N/A'}</p>
            `;
            break;
        case 'patchPanels':
            content = `
                <p><strong>User:</strong> ${port.user || 'N/A'}</p>
                <p><strong>Department:</strong> ${port.department || 'N/A'}</p>
                <p><strong>PC Name:</strong> ${port.pcname || 'N/A'}</p>
                <p><strong>Location:</strong> ${port.location || 'N/A'}</p>
            `;
            break;
        case 'routers':
            content = `
                <p><strong>Interface:</strong> ${port.interface || 'N/A'}</p>
                <p><strong>IP Address:</strong> ${port.ipAddress || 'N/A'}</p>
                <p><strong>Subnet:</strong> ${port.subnet || 'N/A'}</p>
            `;
            break;
    }
    
    popup.innerHTML = `
        <h5>${item.name} - Port ${port.portId}</h5>
        <p><strong>Status:</strong> <span style="font-weight: bold; color: ${port.status === 'active' ? 'var(--green)' : '#94a3b8'};">${port.status}</span></p>
        ${content}
        <p><strong>Remarks:</strong> ${port.remarks || 'N/A'}</p>
    `;
    
    popup.style.display = 'block';
    
    const topPosition = rect.bottom + window.scrollY + 8;
    const leftPosition = rect.left + window.scrollX + (rect.width / 2) - (popup.offsetWidth / 2);
    
    popup.style.left = `${Math.max(8, leftPosition)}px`;
    popup.style.top = `${topPosition}px`;
}

// --- LIFECYCLE ---
document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Data initialization
    initializeWithSampleData();

    // Modal event listeners
    document.getElementById('modal-create-16').addEventListener('click', () => createSwitch(16));
    document.getElementById('modal-create-24').addEventListener('click', () => createSwitch(24));
    document.getElementById('modal-cancel').addEventListener('click', hideSwitchModal);
    document.getElementById('modal-delete-confirm').addEventListener('click', confirmDelete);
    document.getElementById('modal-delete-cancel').addEventListener('click', closeDeleteModal);

    const lastOfficeModal = document.getElementById('last-office-modal');
    document.getElementById('modal-last-office-ok').addEventListener('click', () => {
        lastOfficeModal.classList.remove('visible');
    });

    lastOfficeModal.addEventListener('click', (event) => {
    if (event.target === lastOfficeModal) {
        lastOfficeModal.classList.remove('visible');
    }
    });

    const deleteModal = document.getElementById('delete-confirm-modal');
    deleteModal.addEventListener('click', (event) => {
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
    });

    switchModal.addEventListener('click', (event) => {
        if (event.target === switchModal) {
            hideSwitchModal();
        }
    });
});