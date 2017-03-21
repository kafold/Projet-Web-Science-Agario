var GF = function(){
    // vars for counting frames/s, used by the measureFPS function
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var randomNumberContainer;
    var fps; 
    
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
    
    var mainLoop = function(time){
	//Here goes the main Actions
	randomNumberContainer.innerHTML = Math.random();

	// compute FPS, called each frame, uses the high resolution
	// time parameter given by the browser that implements the
	// requestAnimationFrame API
	// main function, called each frame
        measureFPS(time);
        
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    var start = function(){
        fpsContainer = document.getElementById('framePerSeconds');
	randomNumberContainer = document.getElementById('randomNumber');
	console.log("fpsContainer = " + fpsContainer);
	console.log("randomNumberContainer = " + randomNumberContainer);

	requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};

var game = new GF();
game.start();








