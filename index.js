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

let monsterNumber = 2;
let MFNumber = 1;

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



// Star image
var starReady = false;
var starImage = new Image();
starImage.onload = function () {
    starReady = true;
};
starImage.src = "images/star.png";



// Define the Monster class
class Monster {
    constructor(x, y, speed) {
      this.x = x;
      this.y = y;
      this.Speed = speed;
      this.Ready = false;
      this.Image = new Image();
      this.Image.onload = () => {
        this.Ready = true;
      };
      this.Image.src = "images/monster.png";
    }
}

let monster = [];

for (let numbers = 0; numbers < monsterNumber; numbers++)
{
    let one_monster = new Monster(0,0,200);
    monster.push(one_monster);
}

// Define the MF (Piranha plant) class
class PiranhaPlant {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.Ready = false;
      this.Image = new Image();
      this.Image.onload = () => {
        this.Ready = true;
      };
      this.Image.src = "images/MF.png";
    }
}

let MF = [];

for (let numbers = 0; numbers < MFNumber; numbers++)
{
    let one_MF = new PiranhaPlant(0,0);
    MF.push(one_MF);
}



// done with laod images =================================

// load sound objects =================================

var soundGameStart = "sounds/game-opener.wav"; // game start
var soundGameOver = "sounds/player-losing-or-failing.wav"; // game over 
var soundHitMF = "sounds/blood-pop-slide.wav"; // hit floweer objects 
var soundHitMonster = "sounds/punch.wav"; // hit monster objects 
var soundGetStar = "sounds/GetStar.wav"; // game clear
var soundStar = "sounds/star.wav"; // game clear
 

// complete sound 

// =============================================



// Game objects
var hero = {
    speed: 100, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};

var star = {
    speed: 30,
    x: 0,
    y: 0
};
var heroLife = 3;
var Stars = 0;

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

// Moving items =============================================

    // Move the monster
    for(let i = 0; monster.length > i; i++)
    {
        
        if(i % 2 === 0)
        {
            monster[i].x += monster[i].Speed * modifier;
            if (monster[i].x < 50 || monster[i].x > canvas.width - 100 || monster[i].y < 50 || monster[i].y > canvas.height - 150) 
            {
                monster[i].Speed *= -1; 
            }
        }
        else if(i === 3 || i === 4)
        {
            monster[i].x += monster[i].Speed * modifier;
            monster[i].y += monster[i].Speed * modifier;
            if (monster[i].x < 50 || monster[i].x > canvas.width  || monster[i].y < 50 || monster[i].y > canvas.height - 150) 
            {
                monster[i].Speed *= -1; 
            }
        } 
        else
        {
            monster[i].y += monster[i].Speed * modifier;
            if (monster[i].x < 50 || monster[i].x > canvas.width || monster[i].y < 50 || monster[i].y > canvas.height - 180) 
            {
                monster[i].Speed *= -1; 
            }
        }
    }

    // move star
    star.x += star.speed * modifier;
    star.y += star.speed * modifier;
    if (star.x < 50 || star.x > canvas.width -50 || star.y < 50 || star.y > canvas.height - 180) 
    {
        star.speed *= -1; 
    }
// ==========================================================================================



    // Are they touching Goobas?
    for(let i = 0; monster.length > i; i++)
    {
        if (
            hero.x <= (monster[i].x + 40)
            && monster[i].x <= (hero.x + 40)
            && hero.y <= (monster[i].y + 40)
            && monster[i].y <= (hero.y +40)) 
            {     
                soundEfx.src = soundHitMonster;
                soundEfx.play();   
                heroLife--;  // keep track of Mario's life
                if (heroLife == 0)
                {
                    soundEfx.src = soundGameOver;
                    soundEfx.play(); 
                    gameover = true;
                    soundEfx.addEventListener("ended", function() {	        
                        window.location.href = "htmls/lose.html";
                    });
                }
            reset_MF();
            }
    }

    // Are they touching MF?
    for(let i = 0; MF.length > i; i++)
    {
        if (
            hero.x <= (MF[i].x + 50)
            && MF[i].x <= (hero.x + 50)
            && hero.y <= (MF[i].y + 50)
            && MF[i].y <= (hero.y + 50)) 
            {
                soundEfx.src = soundHitMF;
                soundEfx.play();
                gameover = true;
                soundEfx.addEventListener("ended", function() {	        
                    window.location.href = "htmls/MFgameover.html";
                });
            }
        }

    // Are they touching star?    
    if (
        hero.x <= (star.x + 40)
        && star.x <= (hero.x + 40)
        && hero.y <= (star.y + 40)
        && star.y <= (hero.y + 40)) 
        {
            soundEfx.src = soundStar;
            soundEfx.play();   
            Stars++;  // keep track of stars
            if (Stars == 3)
                {
                    soundEfx.src = soundGetStar;
                    soundEfx.play();
                    gameover = true;
                    soundEfx.addEventListener("ended", function() {
                        window.location.href = "/htmls/win.html";
                    });
                }
            reset_star(); // Goomba will added
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

    // if (MFReady) {
    //     ctx.drawImage(MFImage, MF.x, MF.y);
    // }

    if (starReady) {
        ctx.drawImage(starImage, star.x, star.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillStyle = "red";
    ctx.fillText("Life: " + heroLife, 60,70);

    ctx.fillStyle = "yellow";
    ctx.fillText("Star: " + Stars, 60,100);
    
    for(let i = 0; monster.length > i; i++)
    {
        if (monster[i].Ready) 
        {
            ctx.drawImage(monster[i].Image, monster[i].x, monster[i].y);
        }
    }

    for(let i = 0; MF.length > i; i++)
    {
        if (MF[i].Ready) 
        {
            ctx.drawImage(MF[i].Image, MF[i].x, MF[i].y);
        }
    }

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


}


// Reset the game when the player catches a monster
var reset_MF = function () {

    let one_MF = new PiranhaPlant(0,0);
    MF.push(one_MF);
    placeItem(hero);
    placeItem(star);
    for(let i = 0; monster.length > i; i++)
    { 
        placeItem(monster[i]);
    }
    for(let i = 0; MF.length > i; i++)
    { 
        placeItem(MF[i]);
    }
    
};

// Reset the game when the player catches a monster
var reset_star = function () {

    let one_monster = new Monster(0,0,200);
    monster.push(one_monster);
    placeItem(hero);
    // placeItem(MF);
    placeItem(star);
    for(let i = 0; monster.length > i; i++)
    { 
        placeItem(monster[i]);
    }
    for(let i = 0; MF.length > i; i++)
    { 
        placeItem(MF[i]);
    }
    
};


// The main game loop
var main = function () {
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
    else if(gameover == true)
    {
        star.speed = 0;
        for (let i = 0; monster.length > i; i++) {
            monster[i].Speed =0;
        }
    }
};



//=========================
// loop at end after all is defined
// executing code
// Let's play this game!
var then = Date.now();
reset_star();
main();  // call the main game loop.