function Player(name, ball) {
    this.name = name;
    this.ball = ball;
    this.score = 0;
}

/** Créer un nombre de joueur(number) et les places dans la liste (PLAYERS_ARRAY)
 */
function createPlayer() {
    var player;
    var x = getRandomArbitrary(BALL_PLAYER_WIDTH,CANVAS_WIDTH - BALL_PLAYER_WIDTH);
    var y = getRandomArbitrary(BALL_PLAYER_HEIGHT,CANVAS_HEIGHT - BALL_PLAYER_HEIGHT);
    var angle = (2 * Math.PI) * Math.random();
    var ball = new Ball(x,y,angle,BALL_PLAYER_SPEED,BALL_PLAYER_RADIUS,BALL_PLAYER_COLOR);
    USERNAME = prompt("What's your name?");
    player = new Player(USERNAME, ball);
    PLAYERS_ARRAY.push(player);
}

/** Recherche le joueur ayant comme nom(name)
 * @returns {*}
 */
function findPlayerByName(name) {
    for(var i = 0; i < PLAYERS_ARRAY.length; i++){
        var player = PLAYERS_ARRAY[i];
        if(name === player.name){
            return player;
        }
    }
    return null;
}