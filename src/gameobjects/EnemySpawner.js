import Enemy from "../gameobjects/Enemy.js";

export default class EnemySpawner {
  constructor(scene, enemiesGroup) {
    this.scene = scene;
    this.enemiesGroup = enemiesGroup;

    this.nextSpawnTime = 2000;
    this.spawnDelay = 1000;

    this.spawnTables = [
      // Level 0
      [
        { EnemyClass: Enemy, weight: 50, id: "ghost", speed: 60, health: 100 },
        {
          EnemyClass: Enemy,
          weight: 50,
          id: "advancedghost",
          speed: 120,
          health: 100,
        },
      ],
      // Level 1
      [
        { EnemyClass: Enemy, weight: 10, id: "ghost", speed: 60, health: 100 },
        {
          EnemyClass: Enemy,
          weight: 90,
          id: "advancedghost",
          speed: 60,
          health: 100,
        },
      ],
    ];

    this.currentTable = "easy"; // or set dynamically
  }

  getRandomEnemyFromTable(spawnTable) {
    // Getting total weight of all enemies in the spawn table
    const totalWeight = spawnTable.reduce(
      (sum, enemy) => sum + enemy.weight,
      0
    );

    // Getting random weight based on total weight
    let randomWeight = Math.random() * totalWeight;

    // For each enemy entry
    for (const enemyEntry of spawnTable) {
      // If random weight is less than the entry's weight, return this entry
      if (randomWeight < enemyEntry.weight) {
        return enemyEntry;
      }
      // Otherwise, subtract the entry's weight from the random weight
      randomWeight -= enemyEntry.weight;
    }

    // Fallback in case no enemy was selected
    return table[0];
  }

  getSpawnPosition(playerX, playerY) {
    const randomAngle = Math.random() * Math.PI * 2; // Random angle in radians
    console.log(`Random angle for enemy spawn: ${randomAngle}`);
    const enemyX = playerX + Math.cos(randomAngle) * 450; // Random X position around player
    const enemyY = playerY + Math.sin(randomAngle) * 450; // Random Y position around player
    console.log(`Enemy spawn position: (${enemyX}, ${enemyY})`);
    return { x: enemyX, y: enemyY };
  }

  update(playerX, playerY) {
    // Spawning enemy once every spawnDelay milliseconds
    if (this.scene.time.now < this.nextSpawnTime) return;
    this.nextSpawnTime = this.scene.time.now + this.spawnDelay;

    // Getting random enemy from current spawn table
    const enemyEntry = this.getRandomEnemyFromTable(this.spawnTables[0]);

    const { x, y } = this.getSpawnPosition(playerX, playerY);

    this.spawnEnemy(x, y, enemyEntry.id, enemyEntry.speed, enemyEntry.health);
  }

  spawnEnemy(x, y, id, speed, health) {
    const enemy = this.enemiesGroup.get(x, y, id, speed, health);

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
