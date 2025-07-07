import Player from "../gameobjects/Player.js";
import Enemy from "../gameobjects/Enemy.js";
import Gun from "../gameobjects/Gun.js";
import AnimationManager from "../utils/AnimationManager.js";
import EnemySpawner from "../gameobjects/EnemySpawner.js";
import { GameOver } from "./GameOver.js";
import Bullet from "../gameobjects/Bullet.js";
import PlasmaGun from "../gameobjects/PlasmaGun.js";
import ExperienceBar from "../gameobjects/ExperienceBar.js";
import LevelUpGUI from "./LevelUp.js";

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
    this.worldWidth = 800;
    this.worldHeight = 800;

    // Recording scene start time
    this.sceneStartTime = this.time.now;

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
      this.worldWidth / 2,
      this.worldHeight / 2,
      this.selectedCharacter,
      100,
      3
    );

    // Initialize level system
    this.playerLevel = 1;
    this.currentExp = 0;
    this.expToNextLevel = 5; // Start with 5 enemies needed for level 2
    this.experienceBar = new ExperienceBar(this);

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
    this.gun.bulletDamage = 34; // Initialize bullet damage property

    // Creating map for scalability for future weapon upgrades
    this.gunUpgradeMap = new Map([[20, new PlasmaGun(this, "plasmabullet")]]);
    // Keys in map
    this.killCountKeys = this.gunUpgradeMap.keys();
    // Last key to signify no more upgrades
    this.lastKey = this.killCountKeys[this.killCountKeys.length - 1];

    this.killsNeededForUpgrade = this.killCountKeys.next().value;
    this.enemiesKilled = 0;

    this.giveStartingBuffs();

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

    this.enemySpawner = new EnemySpawner(this, this.enemies);

    // Enabling collision between enemies
    this.physics.add.collider(this.enemies, this.enemies);

    // Enabling collision between player and enemies
    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
      // Kill enemy when player collides with it
      enemy.die();
      player.playerHit(enemy.x, enemy.y);
    });

    // Create a group for player bullets
    this.playerBullets = this.physics.add.group({
      classType: Bullet || Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // Add collission between player bullets and enemies
    this.physics.add.overlap(
      this.playerBullets,
      this.enemies,
      (bullet, enemy) => {
        bullet.hitEnemy(enemy);
      }
    );

    // Create a group for enemy bullets
    this.enemyBullets = this.physics.add.group({
      classType: Bullet || Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // Add collision between enemy bullets and player
    this.physics.add.collider(
      this.enemyBullets,
      this.player,
      (player, bullet) => {
        player.playerHit(bullet.x, bullet.y);
        bullet.destroy();
      }
    );

    // const shootingEnemy = new ShootingEnemy(this, 200, 200, "ghost", 60, 150);
    // this.enemies.add(shootingEnemy)

    // Initializing animations
    AnimationManager.createAnimations(this);
  }

  onEnemyKilled() {
    this.enemiesKilled++;

    // Add experience
    this.currentExp++;
    this.experienceBar.drawBar(this.currentExp, this.expToNextLevel);

    // Check for level up
    if (this.currentExp >= this.expToNextLevel) {
      this.levelUp();
    }

    // Check if we should upgrade the gun
    // killsNeededForUpgrade being -1 signifies that no more upgrades are available
    if (
      this.killsNeededForUpgrade !== -1 &&
      this.enemiesKilled >= this.killsNeededForUpgrade
    ) {
      this.upgradeGun();
    }
  }

  levelUp() {
    // Increasing player level
    this.playerLevel++;
    // Resetting xp to 0
    this.currentExp = 0;

    // Increase experience requirement (exponential growth)
    this.expToNextLevel = Math.floor(5 * Math.pow(1.5, this.playerLevel - 1));

    // Update UI
    this.experienceBar.updateLevel(this.playerLevel);
    this.experienceBar.drawBar(this.currentExp, this.expToNextLevel);

    // Pausing this scene for level up
    this.scene.pause();
    // Launching level up scene
    this.scene.launch("LevelUp", {
      gameScene: this, // so LevelUpScene can access player, gun, etc.
    });
  }

  upgradeGun() {
    // Get gun from map given killsNeeded goal
    this.gun = this.gunUpgradeMap.get(this.killsNeededForUpgrade);

    // Signify that this is last upgrade if last key is reached
    if (this.killsNeededForUpgrade === this.lastKey) {
      this.killsNeededForUpgrade = -1;
    } else {
      // Update kills needed for upgrade to next gun in map
      this.killsNeededForUpgrade = this.killCountKeys.next().value;
    }

    // Show upgrade notification
    this.showUpgradeNotification();
  }

  showUpgradeNotification() {
    // Display upgrade notification in center of screen
    const upgradeText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        "GUN UPGRADED!",
        {
          fontFamily: "Pixelify Sans",
          fontSize: "64px",
          color: "#42daf5",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1000);

    // Fade out the notification after 3 seconds
    this.tweens.add({
      targets: upgradeText,
      alpha: 0,
      duration: 3000,
      ease: "Power2",
      onComplete: () => upgradeText.destroy(),
    });
  }

  giveStartingBuffs() {
    // Giving player starting buffs based on selected character
    switch (this.selectedCharacter) {
      case "circleplayer":
        this.player.health = 4;
        this.player.updateMaxHealth(4); // Circle player starts with 4 health
        break;
      case "triangleplayer":
        this.player.speed = Math.round(this.player.speed * 1.1); // Triangle player is faster
        this.player.baseSpeed = this.player.speed;
      case "squareplayer":
        this.gun.bulletScale += 0.15;
        break;
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

  endGame() {
    // Resetting cursor to default
    this.input.setDefaultCursor("default");

    // Darkening game scene
    const darkOverlay = this.add.graphics();
    darkOverlay.fillStyle(0x000000, 0.7); // 0.5 is 50% opacity
    darkOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
    darkOverlay.setDepth(9999); // Make sure it's above everything else
    darkOverlay.setScrollFactor(0); // So it stays fixed on the screen

    // Pausing game scene
    this.scene.pause();
    // Launching game over
    this.scene.launch("GameOver");
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

    this.enemySpawner.update(this.player.x, this.player.y); // Update enemy spawner
  }
}
