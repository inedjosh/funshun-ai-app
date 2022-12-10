const ai = require("./../../index");
const errorHandler = require("../../helpers/errorHandler");

module.exports = async (text, renders) => {
  try {
    const response = await ai.openai.createImage({
      prompt: text,
      n: 1,
      size: "1024x1024",
    });
    console.log(response.data.data[0].url);

    return response.data.data[0].url;
  } catch (error) {
    errorHandler(422, error.message);
  }
};
