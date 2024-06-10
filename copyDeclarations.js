const fs = require('fs');
const path = require('path');

fs.mkdirSync(path.resolve(__dirname, 'build'), { recursive: true });
fs.copyFile(path.resolve(__dirname, 'src/types.ts'), path.resolve(__dirname, 'build/types.d.ts'), (err) => {
    if (err) {
        console.error('Error, during copying the declarations file');
    }
});