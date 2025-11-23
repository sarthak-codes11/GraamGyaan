import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import localforage from 'localforage';

// Initialize localForage
localforage.config({
  name: 'GraamGyaan',
  storeName: 'edu_game_saves'
});

// Game scene
class GameScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private player!: Phaser.Physics.Arcade.Sprite;
  private stars!: Phaser.Physics.Arcade.Group;
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  async preload() {
    // Load assets
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('star', 'https://labs.phaser.io/assets/particles/blue.png');
    this.load.image('bomb', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
    
    // Try to load saved score
    const savedScore = await localforage.getItem<number>('gameScore');
    if (savedScore) {
      this.score = savedScore;
    }
  }

  create() {
    // Add background
    this.add.image(400, 300, 'sky');

    // Create player
    this.player = this.physics.add.sprite(100, 450, 'bomb');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Create stars
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate((child) => {
      (child as Phaser.Physics.Arcade.Sprite).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return null;
    });

    // Score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' });
    this.scoreText.setText(`Score: ${this.score}`);

    // Physics
    this.physics.add.collider(this.player, this.stars, (obj1, obj2) => {
      this.collectStar(obj1, obj2);
    }, undefined, this);
    this.physics.add.collider(this.stars, this.stars);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    // Add null check for keyboard input
    if (!this.input.keyboard) {
      return;
    }

    const cursors = this.input.keyboard.createCursorKeys();
    
    // Add null check for player body
    if (!this.player.body) {
      return;
    }

    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (cursors.up.isDown && this.player.body.touching?.down) {
      this.player.setVelocityY(-330);
    }
  }

  private collectStar(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ) {
    // Get the star sprite, handling both GameObjectWithBody and Body types
    const star = (object2 instanceof Phaser.Physics.Arcade.Body || 
                 object2 instanceof Phaser.Physics.Arcade.StaticBody) 
                 ? object2.gameObject 
                 : object2;
    
    const starSprite = star as Phaser.Physics.Arcade.Sprite;
    starSprite.disableBody(true, true);
    
    // Add score
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Save score
    localforage.setItem('gameScore', this.score);

    // Check if all stars are collected
    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        const star = child as Phaser.Physics.Arcade.Sprite;
        star.enableBody(true, star.x, 0, true, true);
        return null;
      });
    }
  }
}

// Game component
const EduGame: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Initialize game when component mounts
    if (gameContainer.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 300 },
            debug: false
          }
        },
        scene: [GameScene],
        parent: gameContainer.current
      };

      gameRef.current = new Phaser.Game(config);
    }

    // Cleanup game when component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Educational Game</h2>
      <p>Use arrow keys to move. Collect stars to score points!</p>
      <div ref={gameContainer} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default EduGame;
