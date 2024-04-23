// DOM
const ground = document.getElementById("ground");
const doodler = document.createElement("div"); 


// Global
let screenSize = { w: 380, h: 600};
let doodlerSize = { w: 40, h: 60};
let platformSize = { w: 70, h: 12.5 };
let posDoodler = { x: 140, y: 400 };

let platforms = [];
let rangePlatform = 9;

let isDoodlerJump = false;

let score = 0;
let isGameOver = false;
let gameOverTimer;



// Game Over
const gameOver = () => {
    // clear Interval
    clearInterval(gameOverTimer);

    // Removing Platforms
    platforms.forEach(i => i.platform.remove());
    platforms = [];
    // Remove Doodler
    doodler.remove();
    // Remove KeyUp Listener
    document.removeEventListener("keyup", contorler);

    // Add Style to ground
    ground.style.display = 'flex';
    ground.style.justifyContent = 'center';
    // Create h1
    h1 = document.createElement('h1');
    h1.innerText = score;
    h1.style.fontSize = '3rem';
    // show It
    ground.appendChild(h1);
};


// Move Left
const moveLeft = () => {
    // increase X
    posDoodler.x -= 30;
    // passed left ? than Move Right
    (posDoodler.x < 0) && (posDoodler.x += 90);
    // adding position
    doodler.style.left = posDoodler.x +'px';
};


// Move Right
const moveRight = () => {
    // increase X
    posDoodler.x += 30;
    // passed right ? than Move Left
    (posDoodler.x > (screenSize.w -doodlerSize.w)) && (posDoodler.x -= 90);
    // adding position
    doodler.style.left = posDoodler.x +'px';
};


// Jump
const jump = () => {
    // increase Y
    posDoodler.y += 200;
    // passed top ? than Fall
    (posDoodler.y > (screenSize.h - doodlerSize.h /2)) && (posDoodler.y -= 200);
    // adding position
    doodler.style.bottom = posDoodler.y +'px';
};


// Fall
const fall = () => {
    // increase Y
    posDoodler.y -= 20;
    // adding position
    doodler.style.bottom = posDoodler.y +'px';
    // passed bottom ? than Game OVER
    (posDoodler.y < 0) && (isGameOver=true);
};


// Contorler
const contorler = (event) => {
    // Move Left
    if (event.key==="ArrowLeft") { moveLeft() }
    else if (event.key==="ArrowRight") { moveRight() }
    else if (event.key==="ArrowUp") { jump() };
};


// Move Platform
const movePlatforms = () => {
    !isGameOver && platforms.forEach((i, j) => {
        i.posY -= 4;
        i.platform.style.bottom = i.posY+'px';

        // platform passed bottom ? than remove it
        if (i.posY < -platformSize.h) {
            // remove from DOM, platforms
            i.platform.remove();
            platforms.splice(j, 1);

            // adding new Platform
            const newPlat = new newPlatform(screenSize.h);
            // push to platforms
            platforms.push(newPlat);
        };
        // Collide --> I'm Also Confuced about what happend here... So harder to understand
        if (
            (posDoodler.y > (i.posY -platformSize.h)) &&
            (posDoodler.y < (i.posY + platformSize.h)) &&
            (posDoodler.x > (i.posX -(doodlerSize.w /2))) &&
            (posDoodler.x < (i.posX +(platformSize.w /3) *2))
        ) { 
            // make jump
            jump();
            // score up
            score += 1;
        };
    });
};


// New Platform
class newPlatform {
    constructor(posY) {
        // postions
        this.posX = Math.random() *(screenSize.w -platformSize.w);
        this.posY = posY;
        this.platform = document.createElement("div");
        // Adding class, position
        const element = this.platform;
        element.className = "platform";
        element.style.bottom = this.posY +'px';
        element.style.left = this.posX +'px';
        // Add
        ground.appendChild(element);
    };
};


// Create Platforms
const createPlatforms = () => {
    let posY;
    // Loop Trow
    for (let i=0; i<rangePlatform; i++) {
        // postion y
        posY = screenSize.h /rangePlatform *i +50;
        // getting Platform
        const newPlat = new newPlatform(posY);
        // push to platforms
        platforms.push(newPlat);
    };    
};


// Create Doodler
const createDoodler = () => {
    // Doodler has been created. now we are adding class, position, append
    doodler.className = "doodler";
    doodler.style.bottom = posDoodler.y +'px';
    doodler.style.left = posDoodler.x +'px';
    ground.appendChild(doodler);
};


// Start Game
const startGame = () => {
    if (!isGameOver) {
        // create Doodler
        createDoodler();
        // create Platforms
        createPlatforms();
        // move Platforms
        setInterval(movePlatforms, 30);
        // Auto Fall down
        setInterval(fall, 60);
        // Key Up Event
        document.addEventListener("keyup", contorler);
        // is Game Over
        gameOverTimer = setInterval(() => isGameOver && gameOver(), 1000)
    };
};


// Run
startGame();