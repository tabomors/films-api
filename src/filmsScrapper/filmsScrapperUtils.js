function smallImgToBigImg(smallImgUrl) {
  const versionPostfix = "_V1_";
  const [mainPart] = smallImgUrl.split(versionPostfix);
  return `${mainPart}${versionPostfix}.jpg`;
}

module.exports = {
  smallImgToBigImg
};