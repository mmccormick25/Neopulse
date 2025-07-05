export class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    // Store score of game in this.gameScore
    this.gameScore = data.score || 0; // Default to 0 if not provided
  }

  create() {
    const screenHeight = this.scale.height;
    const screenWidth = this.scale.width;

    // Game over text
    this.add
      .text(
        screenWidth / 2,
        screenHeight / 2 - screenHeight / 20,
        `Score: ${this.gameScore}`,
        {
          fontFamily: "Pixelify Sans",
          fontSize: "96px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // Restart button
    const restartButton = this.add
      .text(
        screenWidth / 2,
        screenHeight / 2 + screenHeight / 20,
        "Start Over",
        {
          fontFamily: "Pixelify Sans",
          fontSize: "64px",
          color: "#ff0000",
        }
      )
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerover", () => {
        restartButton.setStyle({ color: "#00ff00" });
      })
      .on("pointerout", () => {
        restartButton.setStyle({ color: "#ff0000" });
      })
      .on("pointerdown", () => {
        this.scene.stop("Game");
        this.scene.start("TitleScreen");
      });
  }
}
