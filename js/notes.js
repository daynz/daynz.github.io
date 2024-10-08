document.addEventListener('DOMContentLoaded', function () {
    const note = new URLSearchParams(window.location.search).get('note');
    const markdownFilePath = `./markdown/${note}.md`;
    fetchMarkdown(markdownFilePath).then(markdown => {
        const html = marked.parse(markdown);
        document.getElementById('content').innerHTML = html;
    }).catch(error => {
        console.error('Error loading the markdown file:', error);
    });
});

function fetchMarkdown(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load the markdown file');
            }
            return response.text();
        });
}