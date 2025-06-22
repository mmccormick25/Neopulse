export default class TextUtils {
  static combineTextAndSymbol(scene, x, y, scale, text, symbol) {
    const textSize = Math.round(scale * 36); // Adjust text size based on scale

    const label = scene.add
      .text(0, 0, text, {
        fontFamily: "Pixelify Sans",
        fontSize: `${textSize}px`,
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const symbolImage = scene.add
      .image(label.width / 2 + 16 * scale, 0, symbol)
      .setScale(scale);

    return scene.add.container(x, y, [label, symbolImage]);
  }
}
