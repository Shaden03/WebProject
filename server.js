const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = './';

    // Set the file path based on the request URL
    if (req.url === '/') {
        filePath += 'index.html';
    } else if (req.url === '/addRecipe') {
        filePath += 'addRecipe.html';
    } else if (req.url === '/main.js') {
        filePath += 'main.js';
    } else {
        res.writeHead(404);
        res.end('Page not found!');
        return;
    }

    // Read the file and serve it
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Server error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
