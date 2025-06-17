export class TitleScreen extends Phaser.Scene {
  constructor() {
    super("TitleScreen");
  }

  preload() {
    // Load character images or buttons if not already loaded
    this.load.image("squareplayer", "squareplayer.png");
    this.load.image("circleplayer", "circleplayer.png");
  }

  async create() {
    this.cameras.main.setBackgroundColor("#000000");

    // Title image
    this.titleImg = this.add.image(this.scale.width / 2, 150, "title");
    // Sin wave vars
    this.baseScale = 1.0; // Base scale (normal size)
    this.pulseAmplitude = 0.04; // How much it scales up/down
    this.pulseSpeed = 0.0004; // How fast it pulses;
    this.pulseTimer = 0; // Time accumulator

    // Wait for the font to load before adding text
    await document.fonts.load('100px "Pixelify Sans"');

    this.add
      .text(this.scale.width / 2, 300, "Pick starting form", {
        fontFamily: "Pixelify Sans",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // // Square player option
    // const squareBtn = this.add
    //   .image(300, 600, "squareplayer")
    //   .setInteractive()
    //   .setScale(2);

    // // Circle player option
    // const circleBtn = this.add
    //   .image(500, 600, "circleplayer")
    //   .setInteractive()
    //   .setScale(2);

    // // Click handlers
    // squareBtn.on("pointerdown", () => {
    //   this.scene.start("Game", { selectedCharacter: "squareplayer" });
    // });

    // circleBtn.on("pointerdown", () => {
    //   this.scene.start("Game", { selectedCharacter: "circleplayer" });
    // });
    this.createFormButton(this, 150, 500, "circleplayer");

    this.createFormButton(this, 400, 500, "triangleplayer");

    this.createFormButton(this, 650, 500, "squareplayer");
  }

  update(time, delta) {
    this.pulseTimer += delta;

    // Calculate new scale using sine wave
    const titleScale =
      this.baseScale +
      this.pulseAmplitude *
        Math.sin(this.pulseTimer * this.pulseSpeed * 2 * Math.PI);

    this.titleImg.setScale(titleScale);
  }

  createFormButton(scene, x, y, character) {
    const circleGraphic = scene.add.graphics();
    circleGraphic.lineStyle(4, 0xffffff); // 4px white border
    circleGraphic.strokeCircle(0, 0, 96);
    //onst bgCircle = scene.add.circle(0, 0, 96, 0x333333);

    const shapeImage = scene.add.image(0, 0, character).setScale(1.5);

    const buttonContainer = scene.add
      .container(x, y, [circleGraphic, shapeImage])
      .setSize(192, 192)
      .setInteractive()
      .on("pointerdown", () => {
        scene.scene.start("Game", { selectedCharacter: character });
      });

    buttonContainer.setSize(192, 192);
    buttonContainer
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        scene.tweens.add({
          targets: buttonContainer,
          scale: 1.1,
          duration: 150,
          ease: "Power2",
        });
      })
      .on("pointerout", () => {
        scene.tweens.add({
          targets: buttonContainer,
          scale: 1,
          duration: 150,
          ease: "Power2",
        });
      });
  }
}
