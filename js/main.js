// 模态框相关函数
function openTemplateModal() {
    document.getElementById('templateModal').classList.remove('hidden');
}

function closeTemplateModal() {
    document.getElementById('templateModal').classList.add('hidden');
}

function addVariable() {
    const container = document.getElementById('variablesContainer');
    const variableDiv = document.createElement('div');
    variableDiv.innerHTML = `
        <div class="flex space-x-2">
            <input type="text" placeholder="变量名" class="variable-name flex-1 rounded-md border-gray-300">
            <select class="variable-type rounded-md border-gray-300">
                <option value="text">文本</option>
                <option value="number">数字</option>
                <option value="email">邮箱</option>
            </select>
            <button type="button" onclick="this.parentElement.remove()" class="text-red-500">删除</button>
        </div>
    `;
    container.appendChild(variableDiv);
}

function saveTemplate(event) {
    event.preventDefault();
    const name = document.getElementById('templateName').value;
    const content = document.getElementById('templateContent').value;
    
    const variables = Array.from(document.querySelectorAll('.variable-name'))
        .map((input, index) => ({
            name: input.value,
            type: document.querySelectorAll('.variable-type')[index].value
        }));
    
    templateService.createTemplate(name, variables, content);
    closeTemplateModal();
}
