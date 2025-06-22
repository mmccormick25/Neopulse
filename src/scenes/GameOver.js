export class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    // Game over text
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 32, "Game Over", {
        fontFamily: "Pixelify Sans",
        fontSize: "96px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Restart button
    const restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 32, "Start Over", {
        fontFamily: "Pixelify Sans",
        fontSize: "64px",
        color: "#00ff00",
      })
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerover", () => {
        restartButton.setStyle({ color: "#ff0000" });
      })
      .on("pointerout", () => {
        restartButton.setStyle({ color: "#00ff00" });
      })
      .on("pointerdown", () => {
        this.scene.start("TitleScreen");
      });
  }
}
