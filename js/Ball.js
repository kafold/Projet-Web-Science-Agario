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

    /**
     *
     * @param ctx
     * @param x for translation
     * @param y for translation
     */
    this.draw = function(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
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
    var max = maxScore(globalObject.PLAYERS_ARRAY);
    var ballsArray = globalObject.BALLS_ARRAY;
    if(ballsArray.length < globalObject.BALL_MAX_NUMBER && max < globalObject.PLAYERS_SCORE_LIMIT){
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


/** Test si la balle(ball) a touché un coté du canvas
 * Change l'angle de la balle si c'est le cas
 *
 * @param ball
 * @param globalObject
 */
function testCollisionWithWalls(ball, globalObject) {
    w = globalObject.canvasWidth;
    h = globalObject.canvasHeight;
    // left
    if (ball.x < ball.radius) {
        ball.x = ball.radius;
        ball.angle = -ball.angle + Math.PI;
    }
    // right
    if (ball.x > w - (ball.radius)) {
        ball.x = w - (ball.radius);
        ball.angle = -ball.angle + Math.PI;
    }
    // up
    if (ball.y < ball.radius) {
        ball.y = ball.radius;
        ball.angle = -ball.angle;
    }
    // down
    if (ball.y > h - (ball.radius)) {
        ball.y = h - (ball.radius);
        ball.angle =-ball.angle;
    }
}

/** Calcul s'il y a eu collision entre deux balles.
 *
 * @returns {boolean}
 * @param ball1
 * @param ball2
 */
function hasBallCollided(ball1, ball2) {
    var x1,y1,r1,x2,y2,r2;
    x1 = ball1.x;
    y1 = ball1.y;
    r1 = ball1.radius;
    x2 = ball2.x;
    y2 = ball2.y;
    r2 = ball2.radius;
    var dx = x1 - x2;
    var dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
}
