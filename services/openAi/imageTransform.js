const ai = require("./../../index");
const fs = require("fs");
const errorHandler = require("../../helpers/errorHandler");

module.exports = async (image) => {
  try {
    const response = await ai.openai.createImageVariation(
      fs.createReadStream("images/image.png"),
      1,
      "1024x1024"
    );
    return response.data.data[0].url;
  } catch (error) {
    errorHandler(422, error.message);
  }
};
