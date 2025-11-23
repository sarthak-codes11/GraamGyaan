/*
* Asset from: https://kenney.nl/assets/pixel-platformer
*
*/
import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';
import Food from '../gameObjects/Food.js';
import TrailPoint from '../gameObjects/TrailPoint.js';

export class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');
    }

    create ()
    {
        this.initVariables();
        this.initGameUi();
        // this.initAnimations();
        // this.initPlayer();
        this.initInput();
        this.initPhysics();
    }

    update ()
    {
        // if (!this.gameStarted) return;
        this.drawSlash();
        this.checkCollisions();
    }

    initVariables ()
    {
        this.score = 0;
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;
        this.trailPoints = [];
        this.trailCurve = new Phaser.Curves.Spline();
        this.trailGraphics = this.add.graphics().setDepth(100);
        this.trailLines = [];
        this.trailDuration = 0.1;
        this.trailThickness = 4;
        this.trailPointCount = 20;
        this.targetRadius = 100;
        this.targetCircle = new Phaser.Geom.Circle(this.centreX, 300, this.targetRadius);
    }

    initGameUi ()
    {
        // Create tutorial text
        this.tutorialText = this.add.text(this.centreX, this.centreY, 'Tap to start!', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);

        // Create score text
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        })
            .setDepth(100);

        // Create game over text
        this.gameOverText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100)
            .setVisible(false);
    }

    initAnimations ()
    {
        // this.anims.create({
        //     key: ANIMATION.explosion.key,
        //     frames: this.anims.generateFrameNumbers(ANIMATION.explosion.texture, ANIMATION.explosion.config),
        //     frameRate: ANIMATION.explosion.frameRate,
        //     repeat: ANIMATION.explosion.repeat
        // });
    }

    initPhysics ()
    {
        this.foodGroup = this.add.group();
        this.enemyBulletGroup = this.add.group();
        this.playerBulletGroup = this.add.group();

        // this.physics.add.overlap(this.player, this.enemyBulletGroup, this.hitPlayer, null, this);
        // this.physics.add.overlap(this.playerBulletGroup, this.enemyGroup, this.hitEnemy, null, this);
        // this.physics.add.overlap(this.player, this.enemyGroup, this.hitPlayer, null, this);
    }

    initPlayer ()
    {
        this.player = new Player(this, this.centreX, this.scale.height - 100, 8);
    }

    initInput ()
    {
        this.input.on('pointermove', (pointer) =>
        {
            // if (this.trailPoints.length > 4)
            // {
            //     const trailPoint = this.trailPoints[ this.trailPoints.length - 1 ];
            //     this.trailLines.push(new Phaser.Geom.Line(trailPoint.x, trailPoint.y, pointer.x, pointer.y));
            // }
            // create a new TrailPoint class and add it to the trailPoints array
            this.trailPoints.push(new TrailPoint(pointer.x, pointer.y, this.trailDuration * 60));
            this.trailCurve.addPoint(pointer.x, pointer.y);
        });

        // pointerdown once event
        this.input.once('pointerdown', () =>
        {
            if (!this.gameStarted)
            {
                this.startGame();
            }
        });

        // phaser time loop
        // this.time.addEvent({
        //     delay: 1000,
        //     callback: this.addFood,
        //     callbackScope: this,
        //     loop: true
        // });
    }

    drawSlash ()
    {
        this.trailGraphics.clear();
        // Iterate through the trailPoints array and draw a line between each point
        for (let i = 0; i < this.trailPoints.length; i++)
        {
            const trailPoint = this.trailPoints[ i ];
            trailPoint.updateTime(1);
            // If the time left for the trail point is less than 0, remove it
            if (trailPoint.getTimeLeft() < 0)
            {
                this.trailPoints.splice(i, 1);
                this.trailCurve.points.splice(i, 1);
                continue;
            }

            // If there is more than one point in the array
            if (i > 4)
            {
                // Draw a line between the current point and the previous point
                this.trailGraphics.lineStyle(this.trailThickness, 0xffffff, 1);
                this.trailCurve.draw(this.trailGraphics, 64);
            }
        }
    }

    checkCollisions ()
    {
        if (this.trailPoints.length < 4) return;

        const points = this.trailCurve.getDistancePoints(this.trailPointCount);
        // check between sprites and the curve
        this.foodGroup.getChildren().forEach((food) =>
        {
            food.checkCollision(points);
        });
    }

    startGame ()
    {
        this.gameStarted = true;
        this.tutorialText.setVisible(false);
        this.addFoodWave();
    }

    addFoodWave ()
    {
        const randomCount = Phaser.Math.Between(1, 5);
        const randomInterval = Phaser.Math.Between(100, 500);

        this.time.addEvent(
            {
                delay: randomInterval,
                callback: this.addFood,
                callbackScope: this,
                repeat: randomCount
            }
        );
    }

    addFood ()
    {
        this.foodGroup.add(new Food(this, this.targetCircle));
    }

    removeFood (food)
    {
        this.foodGroup.remove(food, true, true);

        if (this.foodGroup.getChildren().length === 0)
        {
            this.time.delayedCall(1000, () =>
            {
                this.addFoodWave();
            });
        }
    }

    addExplosion (x, y)
    {
        new Explosion(this, x, y);
    }

    sliceFruit ()
    {

    }

    updateScore (points)
    {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    GameOver ()
    {
        this.gameStarted = false;
        this.gameOverText.setVisible(true);
    }
}
