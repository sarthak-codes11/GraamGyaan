// An extended Vector2 class that stores the position and the time of a trail point.
//
// The time is used to calculate the alpha value of the point.
// The alpha value is used to fade out the point over time.
export default class TrailPoint extends Phaser.Math.Vector2
{
    time;
    
    constructor(x, y, time)
    {
        super(x, y);
        this.time = time;
    }

    // Reduce this.time by the given value.
    updateTime (value)
    {
        this.time -= value;
    }

    // Get time left function
    getTimeLeft ()
    {
        return this.time;
    }
}