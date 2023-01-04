const characters =
  "A65fjGFoJ648364deB56jfhf78bcfg9CDE1234FGswxyHIJKLVWXYZahijklmMNOtuvPQRSTUnopqrz0";

exports.generateString = () => {
  let result = "";

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * 20));
  }

  return result;
};
