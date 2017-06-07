
//Balls global variable
var BALL_PLAYER_COLOR = 'blue';
var BALL_PLAYER_WIDTH = 50;
var BALL_PLAYER_HEIGHT = 50;
var BALL_PLAYER_RADIUS = 3;
var BALL_PLAYER_SPEED = 10; //pixels
var BALL_MAX_NUMBER = 5;
var BALL_RADIUS = 30;

var MOUSE_DOWN_SPEED = 500;
var MOUSE_UP_SPEED = 100;

// array of balls to animate
var BALLS_ARRAY = [];

//array of players
var PLAYERS_ARRAY = [];

var player1, player2;

//Players variable
var PLAYER_SCORE_LIMIT = 100; // Le nombre max de points atteignable

// Vars relative to the CANVAS
var CANVAS, CTX, CANVAS_WIDTH, CANVAS_HEIGHT;

/** Le FRAMEWORK de notre jeu.
 * Il suffit d'appeler la méthode start pour lancer le jeu.
 *
 */
var GF = function(){
    // TODO modifier l'affichage - variable selon nombre de joueur
    // Un element dans laquelle on va afficher les points
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
    var oldSeconds = 0;

    // vars for handling inputs
    var inputStates = {};

    // Time after which we add another ball to the CANVAS
    var elapseTimeToAddBall = 2000; // in milliseconds

    var array_temp = [];

    var DOCUMENT_ID_CANVAS = "#myCanvas";
    var DOCUMENT_ID_POINT_JOUEUR_1 = "point1";
    var DOCUMENT_ID_POINT_JOUEUR_2 = "point2";

    //------------------------------------------- FUNCTIONS ------------------------------------------------------------

    /** Calcul le nombre de fps qu'on a pu faire dans la seconde jusqu'à maintenant.
     *
     * @param newTime noveau temps de mesure
     */
    var measureFPS = function(newTime){
        // test for the very first invocation
        if(lastTime === undefined) {
            lastTime = newTime;
            return;
        }

        //calculate the difference between last & current frame
        var diffTime = newTime - lastTime;

        // Si on a dépassé la seconde
        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }

        frameCount++;
        return fps;
    };

    /** clears the CANVAS content
     */
    function clearCanvas() {
        CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /** Calculate difference in time since last frame
     *
     * @param currentTime
     * @returns {number}
     */
    function timer(currentTime) {
        var delta = currentTime - oldTime;
        oldTime = currentTime;
        return delta;
    }

    /** Déssine les balles de tout les joueurs
     */
    function drawPlayersBall() {
        for(var i = 0; i < PLAYERS_ARRAY.length; i++){
            var player = PLAYERS_ARRAY[i];
            player.ball.draw(CTX);
        }
    }

    /** Déssine les balles des non-joueurs
     */
    function drawBalls() {
        for(var i = 0; i < BALLS_ARRAY.length; i++){
            var ball = BALLS_ARRAY[i];
            ball.draw(CTX);
        }
    }

    /** Write the number of fps into the right element in the html
     *
     * @param fps
     */
    function DocumentWriteFPS(fps) {
        fpsContainer.innerHTML = 'FPS: ' + fps;
    }

    /** The main function. This is at each frame.
     *
     * @param time time elapsed since start of the game
     */
    var mainLoop = function(time){
        // Calculate and write the number of fps the game is actually running at
        DocumentWriteFPS(measureFPS(time));

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the CANVAS
        clearCanvas();

        // DRAWING
        drawPlayersBall();
        drawBalls();

        // UPDATING
        // Mise à jour des positions des joueurs
        updatePlayerPosition(delta);
        // update all the balls
        updateBalls(delta);

        if((time/elapseTimeToAddBall) - oldSeconds >= 1){
            //Add new balls
            //Only every second
            createBall();
        }
        oldSeconds = Math.floor(time/elapseTimeToAddBall);

        // call the animation loop every 1/60th of second
        if(maxScore() < PLAYER_SCORE_LIMIT) {
            requestAnimationFrame(mainLoop);
        }

        // TODO modify this when we have network game
        point1.innerHTML = player1.score;
        point2.innerHTML = player2.score;
    };

    /** Mise à jour de la position des joueurs
     *
     * @param delta le temps écoulé depuis la derniére frame
     */
    function updatePlayerPosition(delta) {
        var player1Ball = player1.ball;
        var player2Ball = player2.ball;

        var player1BallspeedX = 0;
        var player1BallspeedY = 0;
        var player1Ballspeed = player1.ball.speed;

        var player2BallspeedX = 0;
        var player2BallspeedY = 0;
        var player2Ballspeed = player2.ball.speed;

        // check inputStates
        if (inputStates.left) {
            player1BallspeedX = -player1Ballspeed;
        }
        if (inputStates.up) {
            player1BallspeedY = -player1Ballspeed;
        }
        if (inputStates.right) {
            player1BallspeedX = player1Ballspeed;
        }
        if (inputStates.down) {
            player1BallspeedY = player1Ballspeed;
        }
        if (inputStates.space) {
        }
        if (inputStates.mousePos) {
        }
        if (inputStates.mousedown) {
            player1Ball.speed = MOUSE_DOWN_SPEED;
        } else {
            // mouse up
            player1Ball.speed = MOUSE_UP_SPEED;
        }

        // check inputStates
        if (inputStates.keyDownA) {
            player2BallspeedX = -player2Ballspeed;
        }
        if (inputStates.keyDownZ) {
            player2BallspeedY = -player2Ballspeed;
        }
        if (inputStates.keyDownE) {
            player2BallspeedX = player2Ballspeed;
        }
        if (inputStates.keyDownS) {
            player2BallspeedY = player2Ballspeed;
        }
        if (inputStates.mousedown) {
            player2Ball.speed = MOUSE_DOWN_SPEED;
        } else {
            // mouse up
            player2Ball.speed = MOUSE_UP_SPEED;
        }

        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        player1.ball.x += calcDistanceToMove(delta, player1BallspeedX);
        player1.ball.y += calcDistanceToMove(delta, player1BallspeedY);

        player2.ball.x += calcDistanceToMove(delta, player2BallspeedX);
        player2.ball.y += calcDistanceToMove(delta, player2BallspeedY);

        testCollisionWithWalls(player1.ball);
        testCollisionWithWalls(player2.ball);
    }

    /** Mise à jour des balles
     * - déplacement + changement de direction au cas où ils rebondissent contre le mur
     * - suppresion si mangé + mise à jour du score des joueurs
     *
     * @param delta
     */
    function updateBalls(delta) {
        var ball;
        // for each ball in the array
        array_temp = [];
        for(var i = 0; i < BALLS_ARRAY.length ; i++) {
            ball = BALLS_ARRAY[i];

            // 1) deplacer the ball
            ball.deplacer(delta);

            // 2) test if the ball collides with a wall
            testCollisionWithWalls(ball);

            // Mise à jour du score des joueurs en cas de collisions
            if(hasBallCollided(player1.ball, ball)){
                console.log("Collision player = " + player1.name);
                player1.score++;
                player1.ball.radius += 0.5;
            }else{
                if(hasBallCollided(player2.ball, ball)){
                    console.log("Collision player = " + player2.name);
                    player2.score++;
                    player2.ball.radius += 0.5;
                }else{
                    array_temp.push(ball);
                }
            }

        }
        BALLS_ARRAY = array_temp;
    }

    /** Retourne un objet représentant la position de la souris en (x,y)
     *
     * @param evt
     * @returns {{x: number, y: number}}
     */
    function getMousePos(evt) {
        // necessary to take into account CSS boudaries
        var rect = CANVAS.getBoundingClientRect();
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
        CANVAS.addEventListener('mousemove', function (evt) {
            inputStates.mousePos = getMousePos(evt);
        }, false);

        CANVAS.addEventListener('mousedown', function (evt) {
            inputStates.mousedown = true;
            inputStates.mouseButton = evt.button;
        }, false);

        CANVAS.addEventListener('mouseup', function (evt) {
            inputStates.mousedown = false;
        }, false);
    }

    /** Launch the application
     */
    var start = function(){
        point1 = document.getElementById(DOCUMENT_ID_POINT_JOUEUR_1);
        point2 = document.getElementById(DOCUMENT_ID_POINT_JOUEUR_2);
        // Canvas, context etc.
        CANVAS = document.querySelector(DOCUMENT_ID_CANVAS);

        // often useful
        CANVAS_WIDTH = CANVAS.width;
        CANVAS_HEIGHT = CANVAS.height;

        // important, we will draw with this object
        CTX = CANVAS.getContext('2d');
        // default police for text
        CTX.font="20px Arial";

        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        // Créer deux joueurs pour le moment
        // Créer les balles pour les joueurs
        createPlayer(2);
        player1 = findPlayerByName("player1");
        console.log(player1);
        player2 = findPlayerByName("player2");
        console.log(player2);

        initialiseListeners();

        // Créer une balle
        createBall();

        // start the animation
        requestAnimationFrame(mainLoop);
    };

    /** Our GameFramework returns a public API visible from outside its scope
     */
    return {
        start: start
    };
};
