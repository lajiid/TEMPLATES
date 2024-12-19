class DraftGenerator {
    constructor(gmailService) {
        this.gmailService = gmailService;
    }

    async createDraft(emailData) {
        const { to, subject, content, attachments = [] } = emailData;

        // 创建邮件原始数据
        const email = this.createEmailData(to, subject, content, attachments);

        try {
            const response = await this.gmailService.createDraft({
                message: {
                    raw: email
                }
            });
            return response;
        } catch (error) {
            console.error('创建草稿失败:', error);
            throw error;
        }
    }

    createEmailData(to, subject, content, attachments) {
        const email = [
            'Content-Type: text/html; charset="UTF-8"',
            'MIME-Version: 1.0',
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            content
        ].join('\r\n');

        return btoa(unescape(encodeURIComponent(email)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}
