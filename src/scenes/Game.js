import { Player } from "../gameobjects/Player.js";

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    // Store the selected character from CharacterSelect
    this.selectedCharacter = data.selectedCharacter || "squareplayer";
  }

  create() {
    const worldWidth = 800;
    const worldHeight = 800;

    this.background = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "grid")
      .setOrigin(0, 0)
      .setTileScale(2);

    // Create player at the center of the world
    this.player = new Player(
      this,
      worldWidth / 2,
      worldHeight / 2,
      "squareplayer",
      2
    );

    this.input.setDefaultCursor("url(assets/squarecursor.png) 14 14, pointer");

    // Arrow keys input
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD Input
    this.keys = this.input.keyboard.addKeys("W,A,S,D");

    // Pointer input
    this.pointer = this.input.activePointer;
  }

  update() {
    const { dx, dy } = this.player.getMovementDirection(
      this.cursors,
      this.keys
    );

    // Scroll background in opposite direction
    this.background.tilePositionX += dx * this.player.speed;
    this.background.tilePositionY += dy * this.player.speed;

    this.player.updateTurret(this.pointer);
  }
}
