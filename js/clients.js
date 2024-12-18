// js/clients.js
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
            const nameMatch = !criteria.name || client.clientName.toLowerCase().includes(criteria.name.toLowerCase());
            const emailMatch = !criteria.email || client.email.toLowerCase().includes(criteria.email.toLowerCase());
            const orderMatch = !criteria.orderId || client.orderId === criteria.orderId;
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

    // 显示客户详情
    displayClientDetails(id) {
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
                                    <p><span class="font-medium">地址：</span>${client.address}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="font-medium mb-2">相关文件</h3>
                                <div class="space-y-2">
                                    ${client.files ? `<p>${client.files}</p>` : '<p class="text-gray-500">无相关文件</p>'}
                                </div>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h3 class="font-medium mb-2">备注</h3>
                            <div class="bg-gray-50 p-3 rounded">
                                ${client.notes || '无备注信息'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('clientDetails').innerHTML = detailsHtml;
            document.getElementById('clientDetails').classList.remove('hidden');
        }
    }
}

// 创建全局实例
const clientService = new ClientService();
