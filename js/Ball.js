/** constructor function for balls
 *
 * @param x
 * @param y
 * @param angle
 * @param speed velocity
 * @param diameter
 * @constructor
 */
function Ball(name, x, y, angle, speed, diameter, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.radius = diameter/2;
    this.color = color;

    this.draw = function(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.restore();
    };

    this.move = function(delta) {
        // add horizontal increment to the x pos
        // add vertical increment to the y pos

        var incX = this.speed * Math.cos(this.angle);
        var incY = this.speed * Math.sin(this.angle);

        this.x += calcDistanceToMove(delta, incX);
        this.y += calcDistanceToMove(delta , incY);
    };
}

/**
 *
 * @param ballArray
 * @param canvasWidth
 * @param canvasHeight
 * @param maxScore
 * @param limit
 */
function createBalls(ballArray, canvasWidth, canvasHeight, maxScore, limit) {
    if(ballArray.length < 5 && maxScore < limit){
        var radius = 30;
        var ball =  new Ball(radius + Math.random() * (canvasWidth - radius * 2),
            radius + Math.random() * (canvasHeight - radius * 2),
            (2 * Math.PI) * Math.random(),
            (80*Math.random()),
            radius);
        // On la rajoute au tableau
        ballArray.push(ball);
    }
}

