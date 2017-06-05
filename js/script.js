// Inits
window.onload = function init() {
    var game = new GF();
    game.start();
};


/*
 * Le FRAMEWORK de notre jeu. Il suffit d'appeler la méthode start pour lancer le jeu.
 *
 */
var GF = function(){
    // Vars relative to the canvas
    var canvas, ctx, w, h;

    //Le nombre de balle mangé
    var numberOfBalls1 = 0;
    var numberOfBalls2 = 0;
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

    // TODO Erase
    // The monster !
    //var monster = {};
    //var monster2 = {};

    //Balls global variable
    var BALL_PLAYER_COLOR = 'blue';
    var BALL_PLAYER_WIDTH = 50;
    var BALL_PLAYER_HEIGHT = 50;
    var BALL_PLAYER_RADIUS = 3;
    var BALL_PLAYER_SPEED = 10; //pixels

    // array of balls to animate
    var ballArray = [];



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

    // Functions for drawing the monster and maybe other objects
    function drawMyMonster(x, y, color, rayon) {
        // save the context
        ctx.save();

        // translate the coordinate system, draw relative to it
        ctx.translate(x, y);

        ctx.fillStyle = color;
        // (0, 0) is the top left corner of the monster.
        ctx.beginPath();
        ctx.arc(rayon,rayon , rayon, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // restore the context
        ctx.restore();
    }

    function timer(currentTime) {
        var delta = currentTime - oldTime;
        oldTime = currentTime;
        return delta;

    }

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        // TODO Remplacer par drawAllBalls
        // draw the monster
        drawMyMonster(monster.x, monster.y, monster.color, monster.r);
        drawMyMonster(monster2.x, monster2.y, monster.color, monster2.r);

        // Check inputs and move the monster
        updateMonsterPosition(delta);

        // update and draw balls
        updateBalls(delta);

        //Add new balls if there are less than 5
        createBalls(ballArray);

        seconds = (seconds + 1) % 61;

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);

        point1.innerHTML = numberOfBalls1;
        point2.innerHTML = numberOfBalls2;
    };

    function circleCollide(x1, y1, r1, x2, y2, r2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
    }

    // Collisions between rectangle and circle
    function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
        var testX=cx;
        var testY=cy;
        if (testX < x0) testX=x0;
        if (testX > (x0+w0)) testX=(x0+w0);
        if (testY < y0) testY=y0;
        if (testY > (y0+h0)) testY=(y0+h0);
        return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
    }

    function updateMonsterPosition(delta) {
        monster.speedX = monster.speedY = 0;
        // check inputStates
        if (inputStates.left) {
            monster.speedX = -monster.speed;
        }
        if (inputStates.up) {
            monster.speedY = -monster.speed;
        }
        if (inputStates.right) {
            monster.speedX = monster.speed;
        }
        if (inputStates.down) {
            monster.speedY = monster.speed;
        }
        if (inputStates.space) {
        }
        if (inputStates.mousePos) {
        }
        if (inputStates.mousedown) {
            monster.speed = 500;
        } else {
            // mouse up
            monster.speed = 100;
        }
        monster2.speedX = monster2.speedY = 0;
        // check inputStates
        if (inputStates.keyDownA) {
            monster2.speedX = -monster2.speed;
        }
        if (inputStates.keyDownZ) {
            monster2.speedY = -monster2.speed;
        }
        if (inputStates.keyDownE) {
            monster2.speedX = monster2.speed;
        }
        if (inputStates.keyDownS) {
            monster2.speedY = monster2.speed;
        }
        if (inputStates.mousedown) {
            monster2.speed = 500;
        } else {
            // mouse up
            monster2.speed = 100;
        }

        // COmpute the incX and inY in pixels depending
        // on the time elasped since last redraw
        monster.x += calcDistanceToMove(delta, monster.speedX);
        monster.y += calcDistanceToMove(delta, monster.speedY);

        monster2.x += calcDistanceToMove(delta, monster2.speedX);
        monster2.y += calcDistanceToMove(delta, monster2.speedY);

        calcOutOfBoundCircle(monster);
        calcOutOfBoundCircle(monster2);

    }

    function calcOutOfBoundCircle(monster) {
        // left
        if (monster.x < monster.r) {
            monster.x = monster.r;
            monster.angle = -monster.angle + Math.PI;
        }
        // right
        if (monster.x > w - (monster.r)) {
            monster.x = w - (monster.r);
            monster.angle = -monster.angle + Math.PI;
        }
        // up
        if (monster.y < monster.r) {
            monster.y = monster.r;
            monster.angle = -monster.angle;
        }
        // down
        if (monster.y > h - (monster.r)) {
            monster.y = h - (monster.r);
            monster.angle =-monster.angle;
        }
    }

    function updateBalls(delta) {
        // for each ball in the array
        for(var i=ballArray.length - 1; i >= 0; --i) {
            var ball = ballArray[i];

            // 1) move the ball
            ball.move(delta);

            // 2) test if the ball collides with a wall
            testCollisionWithWalls(ball);

            //TODO remove draw here as it is drawn in main loop with all other balls
            // 3) draw the ball
            ball.draw(ctx);

            // Test if the monster collides
            if(circleCollide(monster.x + monster.r, monster.y + monster.r, monster.r,
                    ball.x, ball.y, ball.radius)) {
                ballArray.splice(i, 1);
                numberOfBalls1++;
                monster.r += 0.5;
            }
            else if(circleCollide(monster2.x + monster2.r, monster2.y + monster2.r, monster2.r,
                    ball.x, ball.y, ball.radius)) {
                ballArray.splice(i, 1);
                numberOfBalls2++;
                monster2.r += 0.5;
            }
        }
    }

    function testCollisionWithWalls(ball) {
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

    function getMousePos(evt) {
        // necessary to take into account CSS boudaries
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }


    /** Créer un nombre de joueur(number) et les places dans la liste (ballArray)
     *
     * @param number
     * @param ballArray
     */
    function createPlayer(number, ballArray) {
        var player;
        var width;
        var height;
        var x;
        var y;
        var angle;
        var diameter;
        var speed;
        var color;
        for(var i = 1; i <= number; i++){
            width = BALL_PLAYER_WIDTH;
            height = BALL_PLAYER_HEIGHT;
            x = getRandomArbitrary(width,w - width);
            y = getRandomArbitrary(height,h - height);
            angle = (2 * Math.PI) * Math.random();
            diameter = BALL_PLAYER_RADIUS;
            speed = BALL_PLAYER_SPEED;
            color = BALL_PLAYER_SPEED;
            player = new Ball("player" + i,x,y,angle,speed,diameter,color);
            ballArray.push(player);
        }
    }

    var start = function(){
        point1 = document.getElementById("point1");
        point2 = document.getElementById("point2");
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        // Canvas, context etc.
        canvas = document.querySelector("#myCanvas");

        // often useful
        w = canvas.width;
        h = canvas.height;

        // important, we will draw with this object
        ctx = canvas.getContext('2d');
        // default police for text
        ctx.font="20px Arial";

        // TODO Remplacer monster par Balls - Joueur
        ballArray = createPlayer(2, ballArray);

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

        // We create tge balls: try to change the parameter
        createBalls(ballArray);

        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};

