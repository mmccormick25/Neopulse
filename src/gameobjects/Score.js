export default class Score {
  constructor(scene) {
    this.scene = scene;
    this.lastSecondTime = this.scene.time.now;
    this.gameScore = 0;
  }

  updateScore() {
    if (this.scene.time.now - this.lastSecondTime > 1000) {
      this.gameScore++;
      this.lastSecondTime = this.scene.time.now;
      this.drawScore();
    }
  }

  drawScore() {
    // Remove old score
    this.scoreLabel?.destroy();

    // Draw new score
    this.scoreLabel = this.scene.add
      .text(600, 128, `Score: ${this.gameScore}`, {
        fontFamily: "Pixelify Sans",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setScrollFactor(0);
  }
}
