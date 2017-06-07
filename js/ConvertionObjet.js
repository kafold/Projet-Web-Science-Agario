function makeObjectForBall(ball){
    return {
        x:ball.x,
        y:ball.y,
        angle:ball.angle,
        speed:ball.speed,
        radius:ball.radius,
        color:ball.color
    }
}

function extractClassFromObjectBall(ball) {
    return new Ball(ball.x, ball.y, ball.angle, ball.speed, ball.radius, ball.color);
}

function extractClassFromObjectPlayer(player){
    var ball = extractClassFromObjectBall(player.ball);
    var newplayer = new Player(player.name, ball);
    newplayer.score = player.score;
    return newplayer;
}

function makeObjectForPlayer(player){
    var ballObject = makeObjectForBall(player.ball);
    return {
        name: player.name,
        score: player.score,
        ball:ballObject
    }
}
