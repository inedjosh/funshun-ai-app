const ai = require("./../../index");
const fs = require("fs");

module.exports = async (image, text) => {
  try {
    console.log(part);
    const response = await ai.openai.createImageEdit(
      fs.createReadStream(image.path),
      fs.createReadStream(image.path),
      text,
      1,
      "1024x1024"
    );
    console.log(response.data.data[0].url);

    return response.data.data[0].url;
  } catch (error) {
    throw new Error(error.message);
  }
};
