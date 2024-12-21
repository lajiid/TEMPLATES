class ClientService {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('clients') || '[]');
    }

    // 添加客户
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

    // 更新客户
    updateClient(id, data) {
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...data };
            this.saveClients();
            return true;
        }
        return false;
    }

    // 删除客户
    deleteClient(id) {
        this.clients = this.clients.filter(c => c.id !== id);
        this.saveClients();
    }

    // 搜索客户
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

    // 获取客户详情
    getClientDetails(id) {
        return this.clients.find(c => c.id === id);
    }

    // 保存到localStorage
    saveClients() {
        localStorage.setItem('clients', JSON.stringify(this.clients));
    }

    // 编辑客户
    editClient(id) {
        const client = this.getClientDetails(id);
        if (client) {
            // 填充表单
            document.getElementById('clientForm').classList.remove('hidden');
            
            // 获取表单中的输入元素
            const form = document.querySelector('#clientForm form');
            form.querySelector('input[name="clientName"]').value = client.clientName;
            form.querySelector('input[name="contactPerson"]').value = client.contactPerson;
            form.querySelector('input[name="email"]').value = client.email;
            form.querySelector('input[name="phone"]').value = client.phone;
            form.querySelector('input[name="address"]').value = client.address || '';
            form.querySelector('textarea[name="notes"]').value = client.notes || '';
        }
    }

    // 查看客户详情
    viewClientDetails(id) {
        const client = this.getClientDetails(id);
        if (client) {
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
                                <h3 class="font-medium mb-2">其他信息</h3>
                                <div class="bg-gray-50 p-3 rounded">
                                    <p><span class="font-medium">创建时间：</span>${new Date(client.createdAt).toLocaleString()}</p>
                                    <p class="mt-2"><span class="font-medium">备注：</span>${client.notes || '暂无备注'}</p>
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

// 创建全局实例
const clientService = new ClientService();

// 全局函数，便于在HTML中直接调用
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
