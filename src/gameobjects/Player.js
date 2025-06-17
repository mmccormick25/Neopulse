export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, speed) {
    super(scene, x, y, texture);

    scene.add.existing(this);

    this.setScale(0.75);
    this.speed = speed;

    this.turret = scene.add.sprite(x, y, "squareturret");
    this.turret.setOrigin(0.5);
    this.turret.setScale(0.66);
    this.turretAngle = 0;
  }

  getMovementDirection(cursors, keys) {
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

    return { dx, dy };
  }

  updateTurret(pointer) {
    const pointerX = pointer.x;
    const pointerY = pointer.y;

    // Setting turret angle
    this.turretAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointerX,
      pointerY
    );

    Phaser.Math.RotateAround(this.turret, this.x, this.y, this.turretAngle);

    this.turret.rotation = this.turretAngle + Math.PI / 2;
  }
}
