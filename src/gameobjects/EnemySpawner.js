export default class EnemySpawner {
  constructor(scene, enemiesGroup) {
    this.scene = scene;
    this.enemiesGroup = enemiesGroup;

    this.nextSpawnTime = 2000;
    this.spawnDelay = 1000;
  }

  update(playerX, playerY) {
    // Spawning enemy once every spawnDelay milliseconds
    if (this.scene.time.now < this.nextSpawnTime) return;
    this.nextSpawnTime = this.scene.time.now + this.spawnDelay;

    this.spawnEnemy(playerX + 400, playerY, "ghost", 100, 80);
  }

  spawnEnemy(x, y, id, health, speed) {
    const enemy = this.enemiesGroup.get(x, y, id);

    // If enemy was found or created, set its properties
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);

      // Setting enemy health and speed
      enemy.health = health;
      enemy.speed = speed;
    }
  }
}
