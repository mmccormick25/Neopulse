export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // Load from images directory
    this.load.setPath("assets/images");

    // Title screen assets
    this.load.image("title", "title.png");

    // Loading background
    this.load.image("background", "assets/background.png");

    // Grid background
    this.load.image("grid", "grid.png");

    // Square player assets
    this.load.image("squareplayer", "squareplayer.png");
    this.load.image("squareturret", "squareturret.png");
    this.load.image("squarecursor", "squarecursor.png");

    // Circle player assets
    this.load.image("circleplayer", "circleplayer.png");
    this.load.image("circleturret", "circleturret.png");
    this.load.image("circlecursor", "circlecursor.png");

    // Triangle player assets
    this.load.image("triangleplayer", "triangleplayer.png");
    this.load.image("triangleturret", "triangleturret.png");
    this.load.image("trianglecursor", "trianglecursor.png");

    // Enemy assets
    this.load.image("errorsprite", "errorsprite.png");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    this.scene.start("TitleScreen"); // or MainMenu, etc.
  }
}
