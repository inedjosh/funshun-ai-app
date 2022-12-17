const ai = require("./../../index");
const fs = require("fs");
const errorHandler = require("../../helpers/errorHandler");

module.exports = async () => {
  try {
    const response = await ai.openai.createImageVariation(
      fs.createReadStream("images/image.png"),
      1,
      "1024x1024"
    );
    console.log(response.data.data[0].url);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        const errMsg = "Cannot generate image at this time,try again latter";
        errorHandler(422, errMsg);
      }
      errorHandler(422, error.response.data.message);
    } else {
      errorHandler(422, error.message);
    }
  }
};
