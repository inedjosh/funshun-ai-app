module.exports = (image) => {
  let data = [];
  image.map((img) => {
    const obj = {
      imageUrl: img.imageUrl,
      createdAt: img.createdAt,
    };
    data.push(obj);
  });

  return data;
};
