// js/gmail.js
class GmailService {
    constructor() {
        this.token = localStorage.getItem('gmail_token');
    }

    // Gmail认证
    async handleAuth() {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.GMAIL.CLIENT_ID,
            scope: CONFIG.GMAIL.SCOPES,
            callback: this.handleAuthCallback.bind(this)
        });
        client.requestAccessToken();
    }

    // 处理认证回调
    handleAuthCallback(response) {
        if (response.access_token) {
            this.token = response.access_token;
            localStorage.setItem('gmail_token', response.access_token);
            this.updateUIStatus(true);
        }
    }

    // 搜索订单邮件
    async searchOrder(orderNumber) {
        if (!this.token) {
            throw new Error('未连接Gmail');
        }

        try {
            const response = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:${orderNumber}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
                return await this.getEmailContent(data.messages[0].id);
            }
            return null;
        } catch (error) {
            console.error('搜索邮件失败:', error);
            throw error;
        }
    }

    // 获取邮件内容
    async getEmailContent(messageId) {
        try {
            const response = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );
            return await response.json();
        } catch (error) {
            console.error('获取邮件内容失败:', error);
            throw error;
        }
    }

    // 更新UI状态
    updateUIStatus(connected) {
        const button = document.getElementById('gmailBtn');
        if (button) {
            button.textContent = connected ? 'Gmail已连接' : '连接Gmail';
            button.classList.toggle('bg-green-500', connected);
            button.classList.toggle('bg-blue-500', !connected);
        }
    }

    // 检查连接状态
    checkConnection() {
        return !!this.token;
    }
}

// 创建全局实例
const gmailService = new GmailService();
