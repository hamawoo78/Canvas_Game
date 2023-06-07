// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000; 
canvas.height = 900;
document.body.appendChild(canvas);

let gameover = false;
let win = false;
var soundEfx = document.getElementById("soundEfx");
let counter = 0;

let chessBoard = [
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
];


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";


// top image
var topReady = false;
var topImage = new Image();
topImage.onload = function () {
    topReady = true;
};
topImage.src = "images/top.jpg";

// side image
var sideReady = false;
var sideImage = new Image();
sideImage.onload = function () {
    sideReady = true;
};
sideImage.src = "images/side.jpg";


// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/mario.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";


// MonsterFlower image
var MFReady = false;
var MFImage = new Image();
MFImage.onload = function () {
    MFReady = true;
};
MFImage.src = "images/MF.png";

// done with laod images =================================

// load sound objects =================================

var soundGameStart = "sounds/game-opener.wav"; // game start
var soundGameOver = "sounds/player-losing-or-failing.wav"; // game over 
var soundHitMF = "sounds/blood-pop-slide.wav"; // hit floweer objects 
var soundHitMonster = "sounds/punch.wav"; // hit monster objects 
// complete sound 

// =============================================



// Game objects
var hero = {
    speed: 100, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var monster = {
// for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};

var MF = {
    // for this version, the monster does not move, so just and x and y
        x: 0,
        y: 0
};
var monstersCaught = 0;

// animation
var rows = 7;
var cols = 3;

//second row for the right movement (counting the index from 0)
var trackRight = 2;
//third row for the left movement (counting the index from 0)
var trackLeft = 5;
var trackUp = 0; 
var trackDown = 0;// not using up and down in this version, see next version

var spriteSheetWidth = 350; // also spriteWidth/cols;
var spriteSheetHeight = 644; // also spriteHeight/rows;
var width = spriteSheetWidth / cols;
var height = spriteSheetHeight / rows;

var curXFrame = 0; // start on left side
var frameCount = 3; // 3 frames per row

//x and y coordinates of the overall sprite image to get the single frame we want
var srcX = 0; // our image has no borders or other stuff
var srcY = 0;

//Assuming that at start the character will move right side
var left = false;
var right = false;
var up = false;
var down = false;
// ======================


// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    //console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    ///console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

// end of ketboad control






// ==========================================================

// functions go here

// Update game objects
let update = function (modifier) {

    left = false;
    right = false;
    up = false;
    down = false;

    // move if key down but not if about to move into bushes 
    if (38 in keysDown && hero.y > 40) { //  holding up key 52
        hero.y -= hero.speed * modifier;
        up = true;
    }
    if (40 in keysDown && hero.y < canvas.height - (100 + 60)) { //  holding down key 835
        hero.y += hero.speed * modifier;
        down = true;    
    }
    if (37 in keysDown && hero.x > (32)) { // holding left key 57
        hero.x -= hero.speed * modifier;
        left = true;
    }
    if (39 in keysDown && hero.x < canvas.width - (100 + 50)) { // holding right keyb 885
        hero.x += hero.speed * modifier;
        right = true;
    }
    


    // Are they touching Goobas?
    if (
        hero.x <= (monster.x + 50)
        && monster.x <= (hero.x + 50)
        && hero.y <= (monster.y + 50)
        && monster.y <= (hero.y +50)) 
        {     
            // console.log("hero x:" + hero.x + "hero y:" + hero.y + "monster y:" + monster.x + "monster y:" + monster.y)       
            soundEfx.src = soundHitMonster;
            soundEfx.play();   
            ++monstersCaught;  // keep track of our “score”
            if (monstersCaught == 3)
            {
                gameover = true;
                win = true;
                soundEfx.src = soundHitMonster;
                soundEfx.play(); 
            }
            reset();       // start a new cycle
        }

    // Are they touching MF?
    if (
        hero.x <= (MF.x + 50)
        && MF.x <= (hero.x + 50)
        && hero.y <= (MF.y + 50)
        && MF.y <= (hero.y + 50)) 
        {
            
            soundEfx.src = soundHitMF;
            soundEfx.play();
            gameover = true;	        
            // alert("Game over");
            reset();       // start a new cycle
        }

    curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
    // it will count 0,1,2,0,1,2,0, etc
    
    srcX = curXFrame * width; //Calculating the x coordinate for spritesheet
    //if left is true, pick Y dim of the correct 
    if (left == false && right == false && up == false && down == false) 
    {
        srcX = 1 * width;
        srcY = 0 * height;
    }
    if (left) 
    {
        //calculate srcY
        srcY = trackLeft * height;
    }
    //if the right is true, pick Y dim of the correct row
    if (right) 
    {
        //calculating y coordinate for spritesheet
        srcY = trackRight * height;
    }
    if (up || down)  
    {
        //calculating y coordinate for spritesheet
        srcY = trackUp * height;
    }
    if (left == true && up == true) 
    {
        srcY = 4 * height;
    }
    if (right == true && up == true) 
    {
        srcY = 1 * height;
    }
    if (left == true && down == true) 
    {
        srcY = 6 * height;
    }
    if (right == true && down == true) 
    {
        srcY = 3 * height;
    }

};




// Draw everything in the main render function
let render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (topReady) {
        ctx.drawImage(topImage, 0, -20);
        ctx.drawImage(topImage, 0, 800);
    }
    if (sideReady) {
        ctx.drawImage(sideImage, -20, 0);
        ctx.drawImage(sideImage, 930, 0);
    }    

    if (heroReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
        ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    if (MFReady) {
        ctx.drawImage(MFImage, MF.x, MF.y);
    }
        // Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Goblins caught: " + monstersCaught, 0, 0);
};

let placeItem = function(charactor){
    let X = 5;
    let Y = 6;
    let success = false;
    while(!success)
    {
        X = Math.floor(Math.random() * 7); // return 0 thru 8
        Y = Math.floor(Math.random() * 7); // return 0 thru 8

        if(chessBoard[X][Y] === 'x')
        {
            success = true;
        }
    }
    chessBoard[X][Y] = 'O';
    charactor.x = (X*100) +50;
    charactor.y = (Y*100) +60;
    // charactor.x = 800;
    // charactor.y = 700;

}


// Reset the game when the player catches a monster
var reset = function () {
    placeItem(hero);
    placeItem(monster);
    placeItem(MF);
    // if(died == ture)
    // {
    //     soundEfx.src = soundGameOver;
    //     soundEfx.play();
    // }
    // else
    // {
    //     placeItem(hero);
    //     placeItem(monster);
    //     placeItem(MF);
    // }
};




// The main game loop
var main = function () {

    // soundEfx.src = soundGameStart;
    // soundEfx.play();

    if(gameover == false)
    {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        //  Request to do this again ASAP
        requestAnimationFrame(main);
    }
    else
    {
        if(win == true)
        {
            alert("You win!")
        }

    }

};



//=========================
// loop at end after all is defined
// executing code
// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.