import Player from "../gameobjects/Player.js";
import Enemy from "../gameobjects/Enemy.js";

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
      .setTileScale(4);

    this.background.setScrollFactor(0);

    // Create player at the center of the world
    this.player = new Player(
      this,
      worldWidth / 2,
      worldHeight / 2,
      this.selectedCharacter,
      2
    );

    this.cameras.main.startFollow(this.player);

    this.chooseCursor(this.selectedCharacter);

    // Arrow keys input
    this.cursors = this.input.keyboard.createCursorKeys();
    // WASD Input
    this.keys = this.input.keyboard.addKeys("W,A,S,D");
    // Pointer input
    this.pointer = this.input.activePointer;

    // Creating enemy group
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    // Example: spawn 5 enemies
    for (let i = 0; i < 5; i++) {
      this.spawnEnemy(100 + i * 100, 100);
    }
  }

  spawnEnemy(x, y) {
    const enemy = this.enemies.get(x, y, "errorsprite");

    // If enemy was found or creeated, set its properties
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);

      // Setting enemy health and speed
      enemy.health = 3;
      enemy.speed = 80;
    }
  }

  update() {
    const { dx, dy } = this.player.getMovementDirection(
      this.cursors,
      this.keys
    );

    // // Scroll background in opposite direction
    this.background.tilePositionX = this.player.x * 0.5;
    this.background.tilePositionY = this.player.y * 0.5;

    // Update enemies
    this.enemies.children.iterate((enemy) => {
      if (enemy.active) {
        enemy.updateEnemy(dx * this.player.speed, dy * this.player.speed);
      }
    });

    this.player.updateTurret(this.pointer, this.cameras.main);
  }

  chooseCursor(selectedCharacter) {
    switch (selectedCharacter) {
      case "squareplayer":
        this.input.setDefaultCursor(
          "url(assets/images/squarecursor.png) 14 14, pointer"
        );
        break;
      case "circleplayer":
        this.input.setDefaultCursor(
          "url(assets/images/circlecursor.png) 14 14, pointer"
        );
        break;
      case "triangleplayer":
        this.input.setDefaultCursor(
          "url(assets/images/trianglecursor.png) 14 14, pointer"
        );
        break;
      default:
        console.error("Unknown character type:", selectedCharacter);
        this.input.setDefaultCursor(
          "url(assets/images/squarecursor.png) 14 14, pointer"
        );
    }
  }
}
