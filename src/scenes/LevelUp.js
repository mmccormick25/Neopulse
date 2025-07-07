export default class LevelUp extends Phaser.Scene {
  constructor() {
    // Setting scene key
    super("LevelUp");

    // Available upgrades
    this.upgrades = [
      // Upgrade to increase fire rate of player's gun by a set percentage
      {
        name: "Faster Fire Rate",
        description: "Increase fire rate by 15%",
        apply: (player, gun) => {
          gun.fireRateUpgrade += 0.15;
          gun.fireRate = gun.baseFireRate / (1 + gun.fireRateUpgrade);
        },
      },
      // Upgrade to increase player's speed by a set percentage
      {
        name: "Speed Boost",
        description: "Increase movement speed by 10%",
        apply: (player, gun) => {
          player.speedUpgrade += 0.1;
          player.speed = Math.round(
            player.baseSpeed * (1 + player.speedUpgrade)
          );
        },
      },
      // Upgrade to increase bullet size by a set percentage
      {
        name: "Larger Bullets",
        description: "Increase bullet size by 20%",
        apply: (player, gun) => {
          gun.bulletScale += 0.2;
        },
      },
      // Upgrade to increase player's health by one
      {
        name: "Extra Health",
        description: "Gain +1 max health",
        apply: (player, gun) => {
          player.maxHealth += 1;
          // Player will heal 1 heart on upgrade
          player.health += 1;
          player.updateMaxHealth(player.maxHealth);
        },
      },
      // Upgrade to increase bullet damage by a set percentage
      {
        name: "Bullet Damage",
        description: "Increase bullet damage by 15%",
        apply: (player, gun) => {
          gun.bulletDamageUpgrade += 0.15;
          gun.bulletDamage = Math.round(
            gun.baseBulletDamage * (1 + gun.bulletDamageUpgrade)
          );
        },
      },
      // Upgrade to increase bullet speed by a set percentage
      {
        name: "Faster Bullets",
        description: "Increase bullet speed by 20%",
        apply: (player, gun) => {
          gun.bulletSpeedUpgrade += 0.2;
          gun.bulletSpeed = Math.round(
            gun.baseBulletSpeed * (1 + gun.bulletSpeedUpgrade)
          );
        },
      },
      // Upgrade to increase player invincibility time after being hit
      {
        name: "Invincibility Duration",
        description: "Longer invincibility after being hit",
        apply: (player, gun) => {
          player.invincibilityDuration =
            (player.invincibilityDuration || 1000) + 300;
        },
      },
    ];
  }

  // Pull data from game scene the is modified by upgrades
  init(data) {
    this.gameScene = data.gameScene;
    this.player = this.gameScene.player;
    this.gun = this.gameScene.gun;
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.isLeveling = true;

    // Darkening game scene for upgrade menu
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x000000, 0.8);
    this.overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(999);

    // Create menu title
    this.title = this.add.text(centerX, centerY - 150, "LEVEL UP!", {
      fontFamily: "Pixelify Sans",
      fontSize: "56px",
      color: "#42daf5",
    });
    this.title.setOrigin(0.5);
    this.title.setScrollFactor(0);
    this.title.setDepth(1001);

    // Create upgrade options
    this.upgradeButtons = [];
    const selectedUpgrades = this.getRandomUpgrades(3);

    for (let i = 0; i < selectedUpgrades.length; i++) {
      const upgrade = selectedUpgrades[i];
      const buttonY = centerY - 50 + i * 80;

      // Create button background
      const button = this.add.graphics();
      button.fillStyle(0x333333);
      button.fillRect(centerX - 200, buttonY - 25, 400, 50);
      button.lineStyle(2, 0x42daf5);
      button.strokeRect(centerX - 200, buttonY - 25, 400, 50);
      button.setScrollFactor(0);
      button.setDepth(1000);
      button.setInteractive(
        new Phaser.Geom.Rectangle(centerX - 200, buttonY - 25, 400, 50),
        Phaser.Geom.Rectangle.Contains
      );

      // Create button text
      const buttonText = this.add.text(centerX, buttonY - 10, upgrade.name, {
        fontFamily: "Pixelify Sans",
        fontSize: "24px",
        color: "#ffffff",
      });
      buttonText.setOrigin(0.5);
      buttonText.setScrollFactor(0);
      buttonText.setDepth(1001);

      // Create description text
      const descText = this.add.text(
        centerX,
        buttonY + 10,
        upgrade.description,
        {
          fontFamily: "Pixelify Sans",
          fontSize: "20px",
          color: "#cccccc",
        }
      );
      descText.setOrigin(0.5);
      descText.setScrollFactor(0);
      descText.setDepth(1001);

      // Add hover effects
      button.on("pointerover", () => {
        button.clear();
        button.fillStyle(0x444444);
        button.fillRect(centerX - 200, buttonY - 25, 400, 50);
        button.lineStyle(2, 0x42daf5);
        button.strokeRect(centerX - 200, buttonY - 25, 400, 50);
      });

      button.on("pointerout", () => {
        button.clear();
        button.fillStyle(0x333333);
        button.fillRect(centerX - 200, buttonY - 25, 400, 50);
        button.lineStyle(2, 0x42daf5);
        button.strokeRect(centerX - 200, buttonY - 25, 400, 50);
      });

      // Run select upgrade from selected textbox
      button.on("pointerdown", () => {
        this.selectUpgrade(upgrade);
      });

      this.upgradeButtons.push({ button, buttonText, descText });
    }
  }

  // Get a random number of upgrades from upgrade list
  getRandomUpgrades(count) {
    const shuffled = [...this.upgrades].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Apply upgrade and resume game
  selectUpgrade(upgrade) {
    // Apply the upgrade
    upgrade.apply(this.player, this.gun);

    // Stop level up scene
    this.scene.stop();

    // Resume the game
    this.scene.resume("Game");
  }
}
