// Le nom d'utilisateur du user actuelle
var USERNAME;

// array of balls to animate
var BALLS_ARRAY = [];

//array of players
var PLAYERS_ARRAY = [];

// TODO modifier l'affichage - variable selon nombre de joueur
// Un element dans laquelle on va afficher les points
var point1, point2, conversation, data, datasend, users;

var DOCUMENT_ID_CANVAS = "#myCanvas";
var DOCUMENT_ID_POINT_JOUEUR_1 = "point1";
var DOCUMENT_ID_POINT_JOUEUR_2 = "point2";
var DOCUMENT_ID_CONVERSATION = "conversation";
var DOCUMENT_ID_DATA = "data";
var DOCUMENT_ID_DATA_SEND = "datasend";
var DOCUMENT_ID_USERS = "users";

//Balls global variable
var BALL_PLAYER_COLOR = 'blue';
var BALL_PLAYER_WIDTH = 50;
var BALL_PLAYER_HEIGHT = 50;
var BALL_PLAYER_RADIUS = 3;
var BALL_PLAYER_SPEED = 10; //pixels
var BALL_MAX_NUMBER = 5;
var BALL_RADIUS = 30;

var CANVAS;
var CTX;
var CANVAS_WIDTH;
var CANVAS_HEIGHT;

//Players variable
var PLAYER_SCORE_LIMIT = 100; // Le nombre max de points atteignable

/** Le FRAMEWORK de notre jeu.
 * Il suffit d'appeler la méthode start pour lancer le jeu.
 *
 */
var GF = function(){
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

    // Time after which we add another ball to the canvas
    var elapseTimeToAddBall = 2000; // in milliseconds

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

    /** clears the canvas content
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
        var log = false;
        if(log)console.log("################### drawBalls() ################### ");
        if(log)console.log("drawBalls(): BALLS_ARRAY:");
        if(log)console.log(BALLS_ARRAY);
        for(var i = 0; i < BALLS_ARRAY.length; i++){
            var ball = BALLS_ARRAY[i];
            //TODO Supprimer prints
            if(log)console.log("drawBalls(): ball to draw at position " + i);
            if(log)console.log(ball);
            ball.draw(CTX);
        }
        if(log)console.log("###################################### ");
    }

    /** Write the number of fps into the right element in the html
     *
     * @param fps
     */
    function DocumentWriteFPS(fps) {
        fpsContainer.innerHTML = 'FPS: ' + fps;
    }

    var i = 0;
    /** The main function. This is at each frame.
     *
     * @param time time elapsed since start of the game
     */
    var mainLoop = function(time){
        // Calculate and write the number of fps the game is actually running at
        DocumentWriteFPS(measureFPS(time));

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        // DRAWING
        drawPlayersBall();
        console.log("MainLoop: i = " + i);
        i++;
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
        requestAnimationFrame(mainLoop);

        point1.innerHTML = findPlayerByName(USERNAME).score;
        // TODO Afficher dynamiquement le score des joueurs
        point2.innerHTML = "Not yet implemented";
    };

    /** Mise à jour de la position des joueurs
     *
     * @param delta le temps écoulé depuis la derniére frame
     */
    function updatePlayerPosition(delta) {
        var player1 = findPlayerByName(USERNAME).ball;

        var player1speedX = 0;
        var player1speedY = 0;
        var player1speed = player1.speed;

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

        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        player1.x += calcDistanceToMove(delta, player1speedX);
        player1.y += calcDistanceToMove(delta, player1speedY);

        testCollisionWithWalls(player1);
    }

    /** Mise à jour des balles
     * - déplacement + changement de direction au cas où ils rebondissent contre le mur
     * - suppresion si mangé + mise à jour du score des joueurs
     *
     * @param delta
     */
    function updateBalls(delta) {
        var log = true;
        if(log)console.log("################### updateBalls() ################### ");
        var ball;
        // for each ball in the array
        for(var i = BALLS_ARRAY.length - 1; i >= 0; --i) {
            if(log)console.log("updateBalls(): i = " + i);
            ball = BALLS_ARRAY[i];
            if(log)console.log("updateBalls(): ball:");
            if(log)console.log(ball);
            // 1) move the ball
            ball.move(delta);
            if(log)console.log("updateBalls(): moved");
            if(log)console.log("updateBalls(): ball:");
            if(log)console.log(ball);

            // 2) test if the ball collides with a wall
            testCollisionWithWalls(ball);
            if(log)console.log("updateBalls(): collision with wall");
            if(log)console.log("updateBalls(): ball:");
            if(log)console.log(ball);

            // Mise à jour du score des joueurs en cas de collisions
            for(var j = 0; j < PLAYERS_ARRAY.length; j++){
                var player = PLAYERS_ARRAY[j];
                if(log)console.log("updateBalls(): player i = " + i);
                if(log)console.log("updateBalls(): player:");
                if(log)console.log(player);

                // TODO modifier car la suppression se fait mal
                if(hasBallCollided(player.ball, ball)){
                    if(log)console.log("updateBalls(): collided with player, splicing...");
                    BALLS_ARRAY.splice(i, 1);
                    player.score++;
                    player.ball.radius += 0.5;
                }
            }
        }
        if(log)console.log("###################################### ");
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

        // Listener for send button
        datasend.addEventListener("click", function(evt) {
            sendMessage();
        });

        // detect if enter key pressed in the input field
        data.addEventListener("keypress", function(evt) {
            // if pressed ENTER, then send
            if(evt.keyCode == 13) {
                this.blur();
                sendMessage();
            }
        });
    }

    /** Get all graphical components
     */
    function getGraphicalComponents() {
        point1 = document.getElementById(DOCUMENT_ID_POINT_JOUEUR_1);
        point2 = document.getElementById(DOCUMENT_ID_POINT_JOUEUR_2);
        conversation = document.getElementById(DOCUMENT_ID_CONVERSATION);
        data = document.getElementById(DOCUMENT_ID_DATA);
        datasend = document.getElementById(DOCUMENT_ID_DATA_SEND);
        users = document.getElementById(DOCUMENT_ID_USERS);
    }

    /** Launch the application
     */
    var start = function(){
        getGraphicalComponents();

        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        // Canvas, context etc.
        CANVAS = document.querySelector(DOCUMENT_ID_CANVAS);

        // often useful
        CANVAS_WIDTH = CANVAS.width;
        CANVAS_HEIGHT = CANVAS.height;

        // important, we will draw with this object
        CTX = CANVAS.getContext('2d');
        // default police for text
        CTX.font="20px Arial";

        // Créer deux joueurs pour le moment
        // Créer les balles pour les joueurs
        createPlayer();

        initialiseListeners();

        // Créer une balle
        createBall();

        establishConnectionToServer();

        // start the animation
        requestAnimationFrame(mainLoop);
    };

    /** Our GameFramework returns a public API visible from outside its scope
     */
    return {
        start: start
    };
};
