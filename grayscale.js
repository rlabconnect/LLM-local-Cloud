const path = require("path");
const fs = require("fs");
const sharp = require('sharp');

function grayscale(num){
  const dirname = path.join(__dirname, `output-images${num}`);
    fs.readdir(dirname, (err, files) => {
        if (err) {
          console.log("Some error occured");
          return;
        }
        files.forEach((file,index) => {
          sharp(path.join(dirname,file))
          .greyscale() // Convert to grayscale
          .toFile(`./grayscale_img${num}/output-image${index}.png`, (err, info) => {
              if (err) {
                  console.error(err);
              }
          });
      
        });
      });
}
module.exports = grayscale;

