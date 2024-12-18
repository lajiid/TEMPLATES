// js/templates.js
class TemplateService {
    constructor() {
        this.templates = JSON.parse(localStorage.getItem('templates') || '[]');
        this.baseTemplates = {
            EXW: {
                name: "EXW基础模板",
                type: "EXW",
                description: "贵司自清关送货",
                content: `Dear all,

此票预报请见附件，尽量{到达日期}提供到通+舱单
发票条款EXW，贵司自清关送货，麻烦邮件确认，谢谢

PCS/WT: {件数} / {重量} kg ({磅数} lbs)
HAWB：{hawb号}
MAWB：{mawb号}
FLIGHT: {航班号} ETA: {到达日期} {到达时间}`
            },
            FCA: {
                name: "FCA基础模板",
                type: "FCA",
                description: "自清关送货",
                content: `Dear all,

此票预报请见附件，尽量{到达日期}提供到通+舱单
发票条款FCA，自清关送货，麻烦邮件确认，谢谢

PCS/WT: {件数} / {重量} kg ({磅数} lbs)
HAWB：{hawb号}
MAWB：{mawb号}
FLIGHT: {航班号} ETA: {到达日期} {到达时间}`
            },
            DAP: {
                name: "DAP基础模板",
                type: "DAP",
                description: "贵司清关我们送货",
                content: `Dear all,

此票预报请见附件，尽量{到达日期}提供到通+舱单
发票条款DAP，贵司清关我们送货，麻烦邮件确认，谢谢

PCS/WT: {件数} / {重量} kg ({磅数} lbs)
HAWB：{hawb号}
MAWB：{mawb号}
FLIGHT: {航班号} ETA: {到达日期} {到达时间}`
            }
            // 可以继续添加其他基础模板
        };
    }

    // 获取所有模板
    getAllTemplates() {
        return [...Object.values(this.baseTemplates), ...this.templates];
    }

    // 添加新模板
    addTemplate(templateData) {
        const template = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            ...templateData
        };
        this.templates.push(template);
        this.saveTemplates();
        return template;
    }

    // 更新模板
    updateTemplate(id, data) {
        const index = this.templates.findIndex(t => t.id === id);
        if (index !== -1) {
            this.templates[index] = { ...this.templates[index], ...data };
            this.saveTemplates();
            return true;
        }
        return false;
    }

    // 删除模板
    deleteTemplate(id) {
        this.templates = this.templates.filter(t => t.id !== id);
        this.saveTemplates();
    }

    // 获取模板
    getTemplate(id) {
        return this.templates.find(t => t.id === id) || this.baseTemplates[id];
    }

    // 保存模板
    saveTemplates() {
        localStorage.setItem('templates', JSON.stringify(this.templates));
    }

    // 应用模板
    applyTemplate(templateId, data) {
        const template = this.getTemplate(templateId);
        if (!template) return null;

        let content = template.content;
        // 替换所有变量
        Object.entries(data).forEach(([key, value]) => {
            content = content.replace(new RegExp(`{${key}}`, 'g'), value);
        });

        return content;
    }
}

// 创建全局实例
const templateService = new TemplateService();
