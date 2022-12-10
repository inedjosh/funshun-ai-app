module.exports = () => {
  const characters =
    "A65fjGFoJ648364deB56jfhf78bcfg9CDE1234FGswxyHIJKLVWXYZahijklmMNOtuvPQRSTUnopqrz0";

  let ref = "";

  for (let i = 0; i < 20; i++) {
    ref += `${characters.charAt(Math.floor(Math.random() * 40))}`;
  }

  return `FUNSHUN-AI_${ref}`;
};
