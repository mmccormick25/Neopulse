export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, character, speed, health) {
    super(scene, x, y, character);

    // Initialize the player sprite
    scene.add.existing(this);
    // Initialize physics for players
    scene.physics.add.existing(this);

    this.setScale(0.75);
    this.speed = speed;
    this.health = health;

    // Choosing turret based on character type
    switch (character) {
      case "squareplayer":
        this.turret = scene.add.sprite(x, y, "squareturret");
        break;
      case "circleplayer":
        this.turret = scene.add.sprite(x, y, "circleturret");
        break;
      case "triangleplayer":
        this.turret = scene.add.sprite(x, y, "triangleturret");
        break;
      default:
        console.error("Unknown character type:", character);
        this.turret = scene.add.sprite(x, y, "squareturret");
        break;
    }

    this.setDepth(10);

    this.turret.setScale(0.75);
    this.turret.setDepth(10); // Ensure turret is above enemies
    this.turretAngle = 0;
  }

  movePlayer(cursors, keys) {
    let dx = 0;
    let dy = 0;

    // Check left: arrow left or A
    if (cursors.left.isDown || keys.A.isDown) dx = -1;
    // Check right: arrow right or D
    else if (cursors.right.isDown || keys.D.isDown) dx = 1;

    // Check up: arrow up or W
    if (cursors.up.isDown || keys.W.isDown) dy = -1;
    // Check down: arrow down or S
    else if (cursors.down.isDown || keys.S.isDown) dy = 1;

    this.body.setVelocity(dx * this.speed, dy * this.speed);
  }

  updateTurret(pointer, camera) {
    // Locking turret position to player
    this.turret.x = this.x;
    this.turret.y = this.y;

    const pointerX = pointer.x;
    const pointerY = pointer.y;

    // Convert pointer position to world coordinates
    const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);

    // Setting turret angle
    this.turretAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      worldPoint.x,
      worldPoint.y
    );

    this.turret.rotation = this.turretAngle + Math.PI / 2;
  }
}
