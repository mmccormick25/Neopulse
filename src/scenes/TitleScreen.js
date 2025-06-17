export class TitleScreen extends Phaser.Scene {
  constructor() {
    super("TitleScreen");
  }

  preload() {
    // Load character images or buttons if not already loaded
    this.load.image("squareplayer", "squareplayer.png");
    this.load.image("circleplayer", "circleplayer.png");
  }

  create() {
    //this.add
    // .text(400, 100, "Select Your Character", {
    //   fontFamily: "Jersey 10",
    //   fontSize: "32px",
    //   color: "#ffffff",
    // })
    // .setOrigin(0.5);

    this.cameras.main.setBackgroundColor("#000000");

    // Title image
    this.titleImg = this.add.image(this.scale.width / 2, 150, "title");
    // Sin wave vars
    this.baseScale = 1.0; // Base scale (normal size)
    this.pulseAmplitude = 0.04; // How much it scales up/down
    this.pulseSpeed = 0.0004; // How fast it pulses;
    this.pulseTimer = 0; // Time accumulator

    this.add.text(this.scale.width / 2, 300, "Select Your Character", {
      fontFamily: "Pixelify Sans",
      fontSize: "100px",
      color: "#ffffff",
    });

    // Square player option
    const squareBtn = this.add
      .image(300, 600, "squareplayer")
      .setInteractive()
      .setScale(2);

    // Circle player option
    const circleBtn = this.add
      .image(500, 600, "circleplayer")
      .setInteractive()
      .setScale(2);

    // Click handlers
    squareBtn.on("pointerdown", () => {
      this.scene.start("Game", { selectedCharacter: "squareplayer" });
    });

    circleBtn.on("pointerdown", () => {
      this.scene.start("Game", { selectedCharacter: "circleplayer" });
    });
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
}
