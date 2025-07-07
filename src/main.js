import { Boot } from "./scenes/Boot.js";
import { Game } from "./scenes/Game.js";
import { GameOver } from "./scenes/GameOver.js";
import LevelUp from "./scenes/LevelUp.js";
import { Preloader } from "./scenes/Preloader.js";
import { TitleScreen } from "./scenes/TitleScreen.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  parent: "game-container",
  backgroundColor: "#028af8",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, TitleScreen, Game, LevelUp, GameOver],
  pixelArt: true,
  render: { antialias: false },
};

new Phaser.Game(config);
