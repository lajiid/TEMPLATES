class TemplateExtractor {
    constructor(gmailService) {
        this.gmailService = gmailService;
    }

    // 从Gmail搜索邮件
    async searchEmails(query) {
        return await this.gmailService.searchMessages(query);
    }

    // 获取邮件内容
    async getEmailContent(messageId) {
        const email = await this.gmailService.getEmailContent(messageId);
        return this.parseEmail(email);
    }

    // 解析邮件内容
    parseEmail(email) {
        const headers = email.payload.headers;
        const subject = headers.find(h => h.name === 'Subject').value;
        let content = '';

        if (email.payload.parts) {
            // 多部分邮件
            content = this.getTextFromParts(email.payload.parts);
        } else if (email.payload.body.data) {
            // 单部分邮件
            content = atob(email.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }

        return {
            subject,
            content,
            variables: this.detectVariables(content)
        };
    }

    // 检测可能的变量
    detectVariables(content) {
        const patterns = {
            orderNumber: /\b\d{8,}\b/g,
            flightNumber: /[A-Z]{2}\d{3,4}/g,
            date: /\d{2,4}[-/]\d{1,2}[-/]\d{1,2}/g,
            weight: /\d+(\.\d+)?\s*(kg|lbs)/gi,
            hawb: /\d{9,11}/g,
            mawb: /\d{3}-\d{8}/g
        };

        let variables = {};
        for (let [key, pattern] of Object.entries(patterns)) {
            let matches = [...new Set(content.match(pattern) || [])];
            if (matches.length > 0) {
                variables[key] = matches;
            }
        }
        return variables;
    }

    // 从邮件部分获取文本内容
    getTextFromParts(parts) {
        let text = '';
        for (let part of parts) {
            if (part.mimeType === 'text/plain') {
                text += atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else if (part.parts) {
                text += this.getTextFromParts(part.parts);
            }
        }
        return text;
    }
}
