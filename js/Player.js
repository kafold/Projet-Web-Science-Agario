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
    var w = globalObject.canvasWidth;
    var h = globalObject.canvasHeight;
    for(var i = 1; i <= number; i++){
        width = globalObject.BALL_PLAYER_WIDTH;
        height = globalObject.BALL_PLAYER_HEIGHT;
        x = getRandomArbitrary(width,w - width);
        y = getRandomArbitrary(height,h - height);
        angle = (2 * Math.PI) * Math.random();
        diameter = globalObject.BALL_PLAYER_RADIUS;
        speed = globalObject.BALL_PLAYER_SPEED;
        color = globalObject.BALL_PLAYER_COLOR;
        ball = new Ball(x,y,angle,speed,diameter,color);
        player = new Player("player" + i, ball);
        globalObject.PLAYERS_ARRAY.push(player);
    }
}

/** Recherche le joueur ayant comme nom(name)
 *
 * @param name
 * @param globalObject
 * @returns {*}
 */
function findPlayerByName(name, globalObject) {
    for(var i = 0; i < globalObject.PLAYERS_ARRAY.length; i++){
        var player = globalObject.PLAYERS_ARRAY[i];
        if(name === player.name){
            return player;
        }
    }
    return null;
}