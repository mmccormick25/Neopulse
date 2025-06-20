export default class TextUtils {
  static combineTextAndSymbol(scene, x, y, text, symbol) {
    const label = scene.add
      .text(x, y, text, {
        fontFamily: "Pixelify Sans",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const symbolImage = scene.add.image(x + label.width / 2 + 10, y, symbol);
  }
}
