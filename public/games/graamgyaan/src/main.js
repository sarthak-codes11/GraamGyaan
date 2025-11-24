import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const baseConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#2d3436',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    min: { width: 360, height: 270 },
    max: { width: 1280, height: 960 }
  },
  input: { activePointers: 1 },
  render: { pixelArt: false, antialias: true },
  physics: {
    default: 'arcade',
    arcade: { debug: false, gravity: { y: 1000 } }
  },
  scene: [ Boot, Preloader, Game, GameOver ]
};

// Lazy initialize game on user gesture
window.startGame = () => {
  if (window.__gg_game) {
    // already started
    return window.__gg_game;
  }
  const game = new Phaser.Game(baseConfig);
  window.__gg_game = game;
  window.addEventListener('resize', () => game.scale.refresh());
  return game;
};
