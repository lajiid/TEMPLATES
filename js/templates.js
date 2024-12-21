class TemplateService {
    constructor() {
        this.templates = JSON.parse(localStorage.getItem('templates') || '[]');
    }

    createTemplate(name, variables, content) {
        const template = {
            id: Date.now(),
            name,
            variables,
            content,
            createdAt: new Date().toISOString()
        };
        this.templates.push(template);
        this.saveTemplates();
        utils.showNotification('模板创建成功', 'success');
        return template;
    }

    async extractTemplateFromGmail(orderNumber) {
        try {
            const emailContent = await gmailService.searchOrder(orderNumber);
            
            const variables = this.identifyVariables(emailContent);
            
            return {
                variables,
                content: emailContent
            };
        } catch (error) {
            console.error('提取Gmail模板失败:', error);
            return null;
        }
    }

    identifyVariables(content) {
        const potentialVariables = [
            { name: 'clientName', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'orderNumber', type: 'text' },
            { name: 'phone', type: 'text' }
        ];

        return potentialVariables.filter(variable => 
            content.toLowerCase().includes(variable.name.toLowerCase())
        );
    }

    saveTemplates() {
        localStorage.setItem('templates', JSON.stringify(this.templates));
    }
}

const templateService = new TemplateService();

function extractTemplateFromGmail(orderNumber) {
    templateService.extractTemplateFromGmail(orderNumber)
        .then(result => {
            if (result) {
                document.getElementById('templateName').value = `订单${orderNumber}模板`;
                document.getElementById('templateContent').value = result.content;
                
                const container = document.getElementById('variablesContainer');
                container.innerHTML = '';
                result.variables.forEach(variable => {
                    const variableDiv = document.createElement('div');
                    variableDiv.innerHTML = `
                        <div class="flex space-x-2">
                            <input type="text" value="${variable.name}" placeholder="变量名" class="variable-name flex-1 rounded-md border-gray-300">
                            <select class="variable-type rounded-md border-gray-300">
                                <option value="text" ${variable.type === 'text' ? 'selected' : ''}>文本</option>
                                <option value="number" ${variable.type === 'number' ? 'selected' : ''}>数字</option>
                                <option value="email" ${variable.type === 'email' ? 'selected' : ''}>邮箱</option>
                            </select>
                        </div>
                    `;
                    container.appendChild(variableDiv);
                });

                openTemplateModal();
            }
        });
}
