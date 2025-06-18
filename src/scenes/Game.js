import Player from "../gameobjects/Player.js";
import Enemy from "../gameobjects/Enemy.js";
import Gun from "../gameobjects/Gun.js";
import AnimationManager from "../utils/AnimationManager.js";

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    // Store the selected character from CharacterSelect
    this.selectedCharacter = data.selectedCharacter || "squareplayer"; // Default to square player if not provided
  }

  create() {
    // Setting world dimensions
    const worldWidth = 800;
    const worldHeight = 800;

    // Setting black background
    this.cameras.main.setBackgroundColor("#000000");

    // Setting background to scrolling grid tile sprite
    this.background = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "grid")
      .setOrigin(0, 0)
      .setTileScale(10)
      .setScrollFactor(0);

    /*
    //////////////////
    // Player objects
    //////////////////
    */

    // Create player at the center of the world
    this.player = new Player(
      this,
      worldWidth / 2,
      worldHeight / 2,
      this.selectedCharacter,
      120,
      3
    );
    // Choosing cursor based on selected character
    this.chooseCursor(this.selectedCharacter);

    // Making camera follow player in world
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    // Arrow keys input
    this.cursors = this.input.keyboard.createCursorKeys();
    // WASD Input
    this.keys = this.input.keyboard.addKeys("W,A,S,D");
    // Pointer input
    this.pointer = this.input.activePointer;

    // Creating gun for player
    this.gun = new Gun(this, "defaultbullet");

    /*
    //////////////////
    // World objects
    //////////////////
    */

    // Creating enemy group
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    // Enabling collision between enemies
    this.physics.add.collider(this.enemies, this.enemies);

    // Enabling collision between player and enemies
    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {});

    this.physics.add.overlap(
      this.gun.bullets,
      this.enemies,
      (bullet, enemy) => {
        bullet.hitEnemy(enemy);
      }
    );

    // Initializing animations
    AnimationManager.createAnimations(this);

    // Example: spawn 5 enemies
    for (let i = 0; i < 5; i++) {
      this.spawnEnemy(100 + i * 100, 3);
    }
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

  spawnEnemy(x, y) {
    const enemy = this.enemies.get(x, y, "ghost");

    // If enemy was found or created, set its properties
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);

      // Setting enemy health and speed
      enemy.health = 3;
      enemy.speed = 80;
    }
  }

  update() {
    // Moving player in world
    this.player.movePlayer(this.cursors, this.keys);
    // Updating turret based on pointer position
    this.player.updateTurret(this.pointer, this.cameras.main);
    // Firing gun if left mouse button is pressed
    if (this.input.activePointer.isDown) {
      this.gun.fire(this.player.x, this.player.y, this.player.turretAngle);
    }

    // Update background position for parallax effect
    this.background.tilePositionX = this.player.x * 0.2;
    this.background.tilePositionY = this.player.y * 0.2;

    // Update enemies
    this.enemies.children.iterate((enemy) => {
      if (enemy.active) {
        enemy.updateEnemy(this.player.x, this.player.y);
      }
    });
  }
}
