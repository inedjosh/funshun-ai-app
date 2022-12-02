const ai = require("./../../index");

module.exports = async (text) => {
  try {
    const response = await ai.openai.createImage({
      prompt: text,
      n: 1,
      size: "1024x1024",
    });
    console.log(response.data.data[0].url);

    return response.data.data[0].url;
  } catch (error) {
    throw new Error(error.message);
  }
};
