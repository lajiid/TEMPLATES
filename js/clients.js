class ClientService {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('clients') || '[]');
    }

    addClient(clientData) {
        const client = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            ...clientData
        };
        this.clients.push(client);
        this.saveClients();
        return client;
    }

    updateClient(id, data) {
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...data };
            this.saveClients();
            return true;
        }
        return false;
    }

    deleteClient(id) {
        this.clients = this.clients.filter(c => c.id !== id);
        this.saveClients();
    }

    searchClients(criteria) {
        return this.clients.filter(client => {
            const nameMatch = !criteria.name || 
                client.clientName.toLowerCase().includes(criteria.name.toLowerCase());
            const emailMatch = !criteria.email || 
                client.email.toLowerCase().includes(criteria.email.toLowerCase());
            const orderMatch = !criteria.orderId || 
                client.orderId === criteria.orderId;
            return nameMatch && emailMatch && orderMatch;
        });
    }

    getClientDetails(id) {
        return this.clients.find(c => c.id === id);
    }

    saveClients() {
        localStorage.setItem('clients', JSON.stringify(this.clients));
    }

    editClient(id) {
        const client = this.getClientDetails(id);
        if (client) {
            document.getElementById('clientForm').classList.remove('hidden');
            
            const form = document.querySelector('#clientForm form');
            form.querySelector('input[name="clientName"]').value = client.clientName;
            form.querySelector('input[name="contactPerson"]').value = client.contactPerson;
            form.querySelector('input[name="email"]').value = client.email;
            form.querySelector('input[name="phone"]').value = client.phone;
            form.querySelector('input[name="address"]').value = client.address || '';
            form.querySelector('textarea[name="notes"]').value = client.notes || '';
        }
    }

    viewClientDetails(id) {
        const client = this.getClientDetails(id);
        if (client) {
            const filesHtml = client.files && client.files.length > 0 
                ? client.files.map(file => `
                    <div class="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span>${file.name}</span>
                        <span class="text-sm text-gray-500">${(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                `).join('')
                : '<p class="text-gray-500">无相关文件</p>';

            const detailsHtml = `
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div class="flex justify-between items-start mb-4">
                            <h2 class="text-xl font-bold">${client.clientName}</h2>
                            <button onclick="closeDetails()" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 class="font-medium mb-2">基本信息</h3>
                                <div class="space-y-2">
                                    <p><span class="font-medium">联系人：</span>${client.contactPerson}</p>
                                    <p><span class="font-medium">邮箱：</span>${client.email}</p>
                                    <p><span class="font-medium">电话：</span>${client.phone}</p>
                                    <p><span class="font-medium">地址：</span>${client.address || '暂无'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="font-medium mb-2">相关文件</h3>
                                <div class="space-y-2">
                                    ${filesHtml}
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 flex justify-end space-x-2">
                            <button onclick="editClient(${client.id})" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                编辑
                            </button>
                            <button onclick="closeDetails()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            const detailsContainer = document.getElementById('clientDetails');
            detailsContainer.innerHTML = detailsHtml;
            detailsContainer.classList.remove('hidden');
        }
    }
}

const clientService = new ClientService();

function editClient(id) {
    clientService.editClient(id);
}

function viewDetails(id) {
    clientService.viewClientDetails(id);
}

function closeDetails() {
    const detailsContainer = document.getElementById('clientDetails');
    detailsContainer.classList.add('hidden');
}
