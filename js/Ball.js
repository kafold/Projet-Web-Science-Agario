/** constructor function for balls
 *
 * @param x
 * @param y
 * @param angle
 * @param speed velocity
 * @param diameter
 * @constructor
 */
function Ball(x, y, angle, speed, diameter, color) {
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

/** Créer une balle
 *
 * @param ballArray
 * @param canvasWidth
 * @param canvasHeight
 * @param maxScore
 * @param limit
 */
function createBall(globalObject) {
    var maxScore = maxScore(globalObject.PLAYERS_ARRAY);
    var ballsArray = globalObject.BALLS_ARRAY;
    if(ballsArray.length < globalObject.BALL_MAX_NUMBER && maxScore < globalObject.PLAYERS_SCORE_LIMIT){
        var radius = globalObject.BALL_RADIUS;
        var ball =  new Ball(radius + Math.random() * (globalObject.canvasWidth - radius * 2),
            radius + Math.random() * (globalObject.canvasHeight - radius * 2),
            (2 * Math.PI) * Math.random(),
            (80*Math.random()),
            radius);
        // On la rajoute au tableau
        ballsArray.push(ball);
    }
}

/** Calcule le score maximum entre les joueurs
 *
 * @param playersArray
 * @returns {number} le score max
 */
function maxScore(playersArray){
    if(!playersArray) return 0;
    var max = 0;
    for (var player in playersArray){
        max = player.score > max? player.score: max;
    }
    return max;
}