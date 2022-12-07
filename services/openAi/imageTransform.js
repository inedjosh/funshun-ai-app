const ai = require("./../../index");
const fs = require("fs");

module.exports = async (image) => {
  console.log("working");

  try {
    const response = await ai.openai.createImageVariation(
      fs.createReadStream(image.path),
      1,
      "1024x1024"
    );
    console.log(response.data.data[0].url);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    } else {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
};
