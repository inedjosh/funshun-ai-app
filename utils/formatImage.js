const jimp = require("jimp");
const errorHandler = require("../helpers/errorHandler");

// open a file called "lenna.png"
module.exports = (image) => {
  jimp.read(image, (err, img) => {
    if (err) {
      errorHandler(422, err);
      return false;
    }
    img
      .resize(1024, 1024) // resize
      // .quality(100) // set PNG quality
      .write("images/image.png"); // save
  });
  return true;
};
