class TemplateManager {
    constructor() {
        this.templates = JSON.parse(localStorage.getItem('templates') || '[]');
        this.defaultVariables = {
            '{订单号}': '订单号',
            '{航班号}': '航班号',
            '{到达日期}': '到达日期',
            '{hawb号}': 'HAWB号',
            '{mawb号}': 'MAWB号',
            '{件数}': '件数',
            '{重量}': '重量',
            '{磅数}': '磅数',
            '{起运地}': '起运地',
            '{目的地}': '目的地'
        };
    }

    // 保存模板
    saveTemplate(template) {
        if (!template.id) {
            template.id = Date.now();
            template.createdAt = new Date().toISOString();
            this.templates.push(template);
        } else {
            const index = this.templates.findIndex(t => t.id === template.id);
            if (index !== -1) {
                this.templates[index] = {...this.templates[index], ...template};
            }
        }
        this.saveToStorage();
        return template;
    }

    // 从Gmail创建模板
    async createTemplateFromEmail(emailData) {
        const template = {
            id: Date.now(),
            name: '来自Gmail的模板 - ' + new Date().toLocaleDateString(),
            subject: emailData.subject,
            content: emailData.content,
            variables: this.extractVariables(emailData.content),
            type: this.detectTemplateType(emailData.content),
            createdAt: new Date().toISOString()
        };
        return this.saveTemplate(template);
    }

    // 检测模板类型
    detectTemplateType(content) {
        const typePatterns = {
            EXW: /EXW.*自清关/,
            FCA: /FCA.*清关/,
            DAP: /DAP.*清关/,
            DDP: /DDP.*清关/
        };

        for (let [type, pattern] of Object.entries(typePatterns)) {
            if (pattern.test(content)) {
                return type;
            }
        }
        return 'CUSTOM';
    }

    // 提取变量
    extractVariables(content) {
        const variables = new Set();
        const pattern = /{([^}]+)}/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            variables.add(match[1]);
        }
        return Array.from(variables);
    }

    // 应用模板
    applyTemplate(templateId, data) {
        const template = this.getTemplate(templateId);
        if (!template) return null;

        let subject = template.subject;
        let content = template.content;

        // 替换所有变量
        Object.entries(data).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}}`, 'g');
            subject = subject.replace(regex, value);
            content = content.replace(regex, value);
        });

        return { subject, content };
    }

    // 获取模板
    getTemplate(id) {
        return this.templates.find(t => t.id === id);
    }

    // 删除模板
    deleteTemplate(id) {
        this.templates = this.templates.filter(t => t.id !== id);
        this.saveToStorage();
    }

    // 保存到localStorage
    saveToStorage() {
        localStorage.setItem('templates', JSON.stringify(this.templates));
    }
}
