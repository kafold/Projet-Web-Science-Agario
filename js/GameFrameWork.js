/**
 * Le FRAMEWORK de notre jeu. Il suffit d'appeler la méthode start pour lancer le jeu.
 *
 */
var GF = function(){
    // Vars relative to the canvas
    var canvas, ctx, w, h;

    //Un element dans laquelle on va afficher les points
    var point1;
    var point2;

    // vars for counting frames/s, used by the measureFPS function
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps;
    // for time based animation
    var delta, oldTime = 0;

    // I use this variable to know when a second has passed
    var seconds;

    // vars for handling inputs
    var inputStates = {};

    var GLOBAL_OBJECT = {};
    //Balls global variable
    var BALL_PLAYER_COLOR = 'blue';
    var BALL_PLAYER_WIDTH = 50;
    var BALL_PLAYER_HEIGHT = 50;
    var BALL_PLAYER_RADIUS = 3;
    var BALL_PLAYER_SPEED = 10; //pixels
    var BALL_MAX_NUMBER = 5;
    var BALL_RADIUS = 30;

    //Players variable
    var PLAYER_SCORE_LIMIT = 100; // Le nombre max de points atteignable

    // array of balls to animate
    var ballsArray = [];

    //array of players
    var playersArray = [];

    var measureFPS = function(newTime){

        // test for the very first invocation
        if(lastTime === undefined) {
            lastTime = newTime;
            return;
        }

        //calculate the difference between last & current frame
        var diffTime = newTime - lastTime;

        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }

        //and display it in an element we appended to the
        // document in the start() function
        fpsContainer.innerHTML = 'FPS: ' + fps;
        frameCount++;
    };

    // clears the canvas content
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }

    function timer(currentTime) {
        var delta = currentTime - oldTime;
        oldTime = currentTime;
        return delta;

    }

    /** Déssine les balles de tout les joueurs
     */
    function drawPlayersBall() {
        for(var player in playersArray){
            player.ball.draw(ctx);
        }
    }

    /** Déssine les balles des non-joueurs
     */
    function drawBalls() {
        for(var ball in ballsArray){
            ball.draw(ctx);
        }
    }

    var mainLoop = function(time){
        //main function, called each frame
        measureFPS(time);

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        // DRAWING
        drawPlayersBall();
        drawBalls();

        // UPDATING
        // Mise à jour des positions des joueurs
        updatePlayerPosition(delta);
        // update all the balls
        updateBalls(delta);

        //Add new balls if there are less than 5
        createBall(ballsArray);

        seconds = (seconds + 1) % 61;

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);

        // TODO modify this when we have network game
        point1.innerHTML = findPlayerByName("player1", GLOBAL_OBJECT).ball.score;
        point2.innerHTML = findPlayerByName("player2", GLOBAL_OBJECT).ball.score;
    };

    /** Mise à jour de la position des joueurs
     *
     * @param delta le temps écoulé depuis la derniére frame
     */
    function updatePlayerPosition(delta) {
        var player1 = findPlayerByName("player1", GLOBAL_OBJECT).ball;
        var player2 = findPlayerByName("player2", GLOBAL_OBJECT).ball;

        var player1speedX = 0;
        var player1speedY = 0;
        var player1speed = player1.speed;

        var player2speedX = 0;
        var player2speedY = 0;
        var player2speed = player2.speed;

        // check inputStates
        if (inputStates.left) {
            player1speedX = -player1speed;
        }
        if (inputStates.up) {
            player1speedY = -player1speed;
        }
        if (inputStates.right) {
            player1speedX = player1speed;
        }
        if (inputStates.down) {
            player1speedY = player1speed;
        }
        if (inputStates.space) {
        }
        if (inputStates.mousePos) {
        }
        if (inputStates.mousedown) {
            player1.speed = 500;
        } else {
            // mouse up
            player1.speed = 100;
        }

        // check inputStates
        if (inputStates.keyDownA) {
            player2speedX = -player2speed;
        }
        if (inputStates.keyDownZ) {
            player2speedY = -player2speed;
        }
        if (inputStates.keyDownE) {
            player2speedX = player2speed;
        }
        if (inputStates.keyDownS) {
            player2speedY = player2speed;
        }
        if (inputStates.mousedown) {
            player2.speed = 500;
        } else {
            // mouse up
            player2.speed = 100;
        }

        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        player1.x += calcDistanceToMove(delta, player1speedX);
        player1.y += calcDistanceToMove(delta, player1speedY);

        player2.x += calcDistanceToMove(delta, player2speedX);
        player2.y += calcDistanceToMove(delta, player2speedY);

        testCollisionWithWalls(player1, GLOBAL_OBJECT);
        testCollisionWithWalls(player2, GLOBAL_OBJECT);
    }

    /** Mise à jour des balles
     *
     * @param delta
     */
    function updateBalls(delta) {
        var ball;
        // for each ball in the array
        for(var i=ballsArray.length - 1; i >= 0; --i) {
            ball = ballsArray[i];

            // 1) move the ball
            ball.move(delta);

            // 2) test if the ball collides with a wall
            testCollisionWithWalls(ball, GLOBAL_OBJECT);

            // Mise à jour du score des joueurs en cas de collisions
            for(var player in playersArray){
                if(hasBallCollided(player.ball, ball)){
                    ballsArray.splice(i, 1);
                    player.score++;
                    player.ball.radius += 0.5;
                }
            }
        }
    }

    /** Retourne la position de la souris en x,y
     *
     * @param evt
     * @returns {{x: number, y: number}}
     */
    function getMousePos(evt) {
        // necessary to take into account CSS boudaries
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    /** Initialise les écouteurs de l'application
     */
    function initialiseListeners() {
        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', function(event){
            if (event.keyCode === 37) {
                inputStates.left = true;
            } else if (event.keyCode === 38) {
                inputStates.up = true;
            } else if (event.keyCode === 39) {
                inputStates.right = true;
            } else if (event.keyCode === 40) {
                inputStates.down = true;
            }  else if (event.keyCode === 32) {
                inputStates.space = true;
            }
            else if(event.keyCode == 18){
                inputStates.keyDownQ = true;
            }
            else if(event.keyCode == 65){
                inputStates.keyDownA = true;
            }
            else if(event.keyCode == 90){
                inputStates.keyDownZ = true;
            }
            else if(event.keyCode == 69){
                inputStates.keyDownE = true;
            }
            else if(event.keyCode == 83){
                inputStates.keyDownS = true;
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', function(event){
            if (event.keyCode === 37) {
                inputStates.left = false;
            } else if (event.keyCode === 38) {
                inputStates.up = false;
            } else if (event.keyCode === 39) {
                inputStates.right = false;
            } else if (event.keyCode === 40) {
                inputStates.down = false;
            } else if (event.keyCode === 32) {
                inputStates.space = false;
            }else if(event.keyCode == 18){
                inputStates.keyDownQ = false;
            }
            else if(event.keyCode == 65){
                inputStates.keyDownA = false;
            }
            else if(event.keyCode == 90){
                inputStates.keyDownZ = false;
            }
            else if(event.keyCode == 69){
                inputStates.keyDownE = false;
            }
            else if(event.keyCode == 83){
                inputStates.keyDownS = false;
            }
        }, false);

        // Mouse event listeners
        canvas.addEventListener('mousemove', function (evt) {
            inputStates.mousePos = getMousePos(evt);
        }, false);

        canvas.addEventListener('mousedown', function (evt) {
            inputStates.mousedown = true;
            inputStates.mouseButton = evt.button;
        }, false);

        canvas.addEventListener('mouseup', function (evt) {
            inputStates.mousedown = false;
        }, false);

    }

    /** Initialise une variable global qu'on passeras aux classes externe
     * afin de partager les informations nécessaire.
     *
     * Singleton
     *
     * @returns {{BALL_PLAYER_COLOR: string, BALL_PLAYER_WIDTH: number, BALL_PLAYER_HEIGHT: number, BALL_PLAYER_RADIUS: number, BALL_PLAYER_SPEED: number}}
     */
    function initialiseGlobalObject() {
        // Canvas, context etc.
        canvas = document.querySelector("#myCanvas");

        // often useful
        w = canvas.width;
        h = canvas.height;

        // important, we will draw with this object
        ctx = canvas.getContext('2d');
        // default police for text
        ctx.font="20px Arial";
        return {
            ctx: ctx,
            canvasWidth: w,
            canvasHeight: h,
            BALL_PLAYER_COLOR: BALL_PLAYER_COLOR,
            BALL_PLAYER_WIDTH: BALL_PLAYER_WIDTH,
            BALL_PLAYER_HEIGHT: BALL_PLAYER_HEIGHT,
            BALL_PLAYER_RADIUS: BALL_PLAYER_RADIUS,
            BALL_PLAYER_SPEED: BALL_PLAYER_SPEED,
            BALL_MAX_NUMBER:BALL_MAX_NUMBER,
            BALLS_ARRAY: ballsArray,
            PLAYERS_ARRAY:playersArray,
            PLAYERS_SCORE_LIMIT: PLAYER_SCORE_LIMIT,
            BALL_RADIUS:BALL_RADIUS
        }
    }

    var start = function(){
        point1 = document.getElementById("point1");
        point2 = document.getElementById("point2");
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        GLOBAL_OBJECT = initialiseGlobalObject();

        // Créer deux joueurs pour le moment
        // Créer les balles pour les joueurs
        createPlayer(2, GLOBAL_OBJECT);

        initialiseListeners();

        // Créer une balle
        createBall(ballsArray);

        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};
