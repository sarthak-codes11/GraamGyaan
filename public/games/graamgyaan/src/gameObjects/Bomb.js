import ASSETS from '../assets.js';

export default class Bomb extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, ASSETS.spritesheet.tiles.key, 105);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.mapOffset = scene.getMapOffset();
        this.setPosition(this.mapOffset.x + (x * this.mapOffset.tileSize), this.mapOffset.y + (y * this.mapOffset.tileSize));
        this.setDepth(90);
        this.scene = scene;
    }

    collect ()
    {
        this.scene.destroyEnemies();
        this.scene.removeItem(this);
    }
}