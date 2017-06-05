function Player(name, ball) {
    this.name = name;
    this.ball = ball;
    this.score = 0;
}

/** Créer un nombre de joueur(number) et les places dans la liste (playersArray)
 *
 * @param number
 * @param playersArray
 */
function createPlayer(number, globalObject) {
    var player;
    var width;
    var height;
    var x;
    var y;
    var angle;
    var diameter;
    var speed;
    var color;
    var ball;
    for(var i = 1; i <= number; i++){
        width = globalObject.BALL_PLAYER_WIDTH;
        height = globalObject.BALL_PLAYER_HEIGHT;
        x = getRandomArbitrary(width,w - width);
        y = getRandomArbitrary(height,h - height);
        angle = (2 * Math.PI) * Math.random();
        diameter = globalObject.BALL_PLAYER_RADIUS;
        speed = globalObject.BALL_PLAYER_SPEED;
        color = globalObject.BALL_PLAYER_SPEED;
        ball = new Ball(x,y,angle,speed,diameter,color);
        player = new Player("player" + i, ball);
        globalObject.PLAYERS_ARRAY.push(player);
    }
}