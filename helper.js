
var soundEfx = document.getElementById("soundEfx");

// load sound objects =================================

var soundGameStart = "/sounds/game-opener.wav"; // game start


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("playButton").addEventListener("click", function(){
        soundEfx.src = soundGameStart;
        soundEfx.play();  
        soundEfx.addEventListener("ended", function() {
            window.location.href = "/index.html";
        })
    });

    let text = "Welcome to the game! Let your hero, Mario, catch the stars!! But please avoid the dangerous Goombas. The stars will be moving around the screen, and you need to let Hero mario to catch Star correctly.  Watch out! There are also Piranha Plant scattered throughout the game. It is extremely deadly, and if you accidentally touch them, you will lose the game immediately. Avoid them at all costs! To control your character, use the arrow keys on your keyboard. Remember, your main goal is to catch 3 Stars while avoiding the Goombas and the pinania flowers. Stay focused, be quick, and aim to get stars! Good luck!";
    let index = 0;
    let interval = 90;

    function showText() {
        let textElement = document.getElementById("text");
        if (index >= text.length) {
            return;
        }
        
        textElement.textContent += text.charAt(index);
        index++;
        setTimeout(showText, interval);
    }

    window.onload = function() {
        showText();
    };
});
