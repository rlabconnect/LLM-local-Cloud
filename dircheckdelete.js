const fs = require('fs');

let listdir = ['./uploads', './output-images', './grayscale_img', './recognized_txt'];

function makedir(num) {
    listdir.forEach((n) => {
        const dirPath = `${n}${num}`;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });
}

function removedir(num) {
    listdir.forEach((n) => {
        const dirPath = `${n}${num}`;
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    });
}

module.exports = { makedir, removedir };
// removedir(1);
