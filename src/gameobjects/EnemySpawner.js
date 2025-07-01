import Enemy from "../gameobjects/Enemy.js";

export default class EnemySpawner {
  constructor(scene, enemiesGroup) {
    this.scene = scene;
    this.enemiesGroup = enemiesGroup;

    this.nextSpawnTime = 2000;

    const defaultWaveLength = 10 * 1000; // 10 seconds

    this.spawnTables = [
      // Level 0
      {
        spawnList: [
          {
            EnemyClass: Enemy,
            weight: 100,
            id: "ghost",
            speed: 60,
            health: 100,
          },
        ],
        spawnDelay: 2 * 1000, // 2 seconds
        waveLength: defaultWaveLength, // 10 seconds
      },
      // Level 1
      {
        spawnList: [
          {
            EnemyClass: Enemy,
            weight: 50,
            id: "ghost",
            speed: 60,
            health: 100,
          },
          {
            EnemyClass: Enemy,
            weight: 50,
            id: "advancedghost",
            speed: 120,
            health: 100,
          },
        ],
        spawnDelay: 2000, // 2 seconds
        waveLength: defaultWaveLength, // 10 seconds
      },
      // Level 2
      {
        spawnList: [
          {
            EnemyClass: Enemy,
            weight: 100,
            id: "advancedghost",
            speed: 120,
            health: 100,
          },
        ],
        spawnDelay: 2000, // 2 seconds
        waveLength: defaultWaveLength, // 10 seconds
      },
      // Level 3
      {
        spawnList: [
          {
            EnemyClass: Enemy,
            weight: 44,
            id: "ghost",
            speed: 60,
            health: 100,
          },
          {
            EnemyClass: Enemy,
            weight: 66,
            id: "advancedghost",
            speed: 120,
            health: 100,
          },
        ],
        spawnDelay: 1500, // 1.5 seconds
        waveLength: defaultWaveLength, // 10 seconds
      },
      // Level 4
      {
        spawnList: [
          {
            EnemyClass: Enemy,
            weight: 100,
            id: "advancedghost",
            speed: 120,
            health: 100,
          },
        ],
        spawnDelay: 1000, // 1.5 seconds
        waveLength: defaultWaveLength, // 10 seconds
      },
    ];

    this.spawnLevel = 0; // Starting spawn level

    this.currentSpawnList = this.spawnTables[0].spawnList; // List of enemies to spawn
    this.currentSpawnDelay = this.spawnTables[0].spawnDelay; // Delay between spawns

    this.waveEndTime = this.scene.time.now + this.spawnTables[0].waveLength; // End time of the current wave
  }

  update(playerX, playerY) {
    // If it is time for the next wave, and if there is a next wave in the spawn table, move to next wave
    if (
      this.scene.time.now > this.waveEndTime &&
      this.spawnLevel < this.spawnTables.length - 1
    ) {
      // Move to the next spawn level
      this.spawnLevel++;
      this.currentSpawnList = this.spawnTables[this.spawnLevel].spawnList;
      this.currentSpawnDelay = this.spawnTables[this.spawnLevel].spawnDelay;
      this.waveEndTime =
        this.scene.time.now + this.spawnTables[this.spawnLevel].waveLength;

      console.log(`Spawn level increased to ${this.spawnLevel}`);
    }

    // Spawning enemy once every spawnDelay milliseconds
    if (this.scene.time.now < this.nextSpawnTime) return;
    this.nextSpawnTime = this.scene.time.now + this.currentSpawnDelay;

    // Getting random enemy from current spawn table
    const enemyEntry = this.getRandomEnemyFromTable(this.currentSpawnList);

    const { x, y } = this.getRandomSpawnPosition(playerX, playerY);

    this.spawnEnemy(x, y, enemyEntry.id, enemyEntry.speed, enemyEntry.health);
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

  getRandomSpawnPosition(playerX, playerY) {
    const randomAngle = Math.random() * Math.PI * 2; // Random angle in radians
    const enemyX = playerX + Math.cos(randomAngle) * 450; // Random X position around player
    const enemyY = playerY + Math.sin(randomAngle) * 450; // Random Y position around player
    return { x: enemyX, y: enemyY };
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
