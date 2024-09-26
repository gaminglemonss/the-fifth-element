/**
 _______ _          
|__   __| |         
   | |  | |__   ___ 
   | |  | '_ \ / _ \
   | |  | | | |  __/
   |_|  |_| |_|\___|
                     
 ______ _  __ _   _     
|  ____(_)/ _| | | |    
| |__  | | |_| |_| |__  
|  __| | |  _| __| '_ \ 
| |    | | | | |_| | | |
|_|    |_|_|  \__|_| |_|
 ______ _                           _   
|  ____| |                         | |  
| |__  | | ___ _ __ ___   ___ _ __ | |_ 
|  __| | |/ _ \ '_ ` _ \ / _ \ '_ \| __|
| |____| |  __/ | | | | |  __/ | | | |_ 
|______|_|\___|_| |_| |_|\___|_| |_|\__|

Lemon Games x Ace Rogers
@gaminglemonz @AmericanGuard                                
                           
Credit is given where credit is due

**/

// SETUP \\

// jshint ignore : start
// jshint esnext : true
size(600, 600, P2D);
smooth();
noStroke();

// Credit to Daniel @dkareh
(function(){return this;})().LoopProtector.prototype.leave = function(){};

// Credit to Vexcess (@VXS)
let PJSCodeInjector, Reflect = sq.constructor("return Reflect")();PJSCodeInjector.applyInstance = function (o) {return function () {return Reflect.construct(o, arguments);};};

// VARIABLES \\
let scene = 'load';

let curLoad = 0;
let level = 0;

let loading = true;

let blocks = [];
let enemies = [];
const levels = [
    {
        map: [
            "",
            "",
            "",
            "",
            "@    ggg",
            "ggggggggggggg",
            "ddddddddddddd",
            "ddddddddddddd",
        ],
        scene: "earth",
    },
    {},
    {},
];

let cam = {
    x: 0,
    y: 0,
    speed: 0.05,
};
let mouse = {};
let keys = {};

// USER EVENTS \\
function mouseReleased(){
    mouse[mouseButton] = true;
}
function keyPressed(){
    keys[keyCode] = keys[String(key).toLowerCase()] = true;
}
function keyReleased(){
    delete keys[keyCode];
    delete keys[String(key).toLowerCase()];
}

// COLLISIONS \\
function rectRect(a, b){
    return a.x > b.x - b.w && a.x < b.x + b.w &&
           a.y > b.y - b.h && a.y < b.y + b.h;
}

// LOADING AND IMAGES \\
/* Credit to ski @thelegendski for loading method */
let imgs = {
    earth_player: function(){
        background(0, 0, 0, 0);
        
        fill(20, 255, 47);
        rect(0, 0, 80, 80, 10);
        
        fill(0, 224, 19);
        rect(0, 0, 40, 80, 10);
        
        return get(0, 0, 80, 80);
    },
    water_player: function(){
        background(0, 0, 0, 0);
        
        fill(20, 188, 255);
        rect(0, 0, 80, 80, 10);
        
        fill(0, 146, 209);
        rect(0, 0, 40, 80, 10);
        
        return get(0, 0, 80, 80);
    },
    fire_player: function(){
        background(0, 0, 0, 0);
        
        fill(242, 149, 0);
        rect(0, 0, 80, 80, 10);
        
        fill(222, 111, 0);
        rect(0, 0, 40, 80, 10);
        
        return get(0, 0, 80, 80);
    },
    wind_player: function(){
        background(0, 0, 0, 0);
        
        fill(181, 181, 181);
        rect(0, 0, 80, 80, 10);
        
        fill(150, 150, 150);
        rect(0, 0, 40, 80, 10);
        
        return get(0, 0, 80, 80);
    },
    grass_block: function(){
        background(0, 0, 0, 0);
        
        fill(166, 122, 10);
        rect(0, 0, 80, 80);
        
        fill(135, 81, 0);
        rect(0, 0, 40, 80);
        
        pushStyle();
            stroke(23, 230, 0);
            strokeWeight(18);
            line(5, 6, 75, 6);
            
            strokeWeight(10);
            line(5, 6, 5, 25);
            line(27, 6, 27, 36);
            line(47, 6, 47, 22);
            line(68, 6, 68, 31);
        popStyle();
        
        return get(0, 0, 80, 80);
    },
    dirt_block: function(){
        background(0, 0, 0, 0);
        
        fill(166, 122, 10);
        rect(0, 0, 80, 80);
        
        fill(135, 81, 0);
        rect(0, 0, 40, 80);
        
        return get(0, 0, 80, 80);
    },
    concrete_block: function(){
        background(0, 0, 0, 0);
        
        for (let i = 0; i < 10; i ++){
            for (let j = 0; j < 10; j ++){
                fill(random(50, 150));
                rect(i * 8, j * 8, 8, 8);
            }
        }
        
        return get(0, 0, 80, 80);
    },
    eyes: function(){
        background(0, 0, 0, 0);
        
        fill(255);
        rect(20, 15, 13, 45, 10);
        rect(50, 15, 13, 45, 10);
        
        return get(0, 0, 80, 80);
    },
};


textAlign(3, 3);

function load(){
    background(0);
    
    let obj = Object.keys(imgs);
    let l = obj.length;
    
    
    imgs[obj[curLoad]] = imgs[obj[curLoad]]();
    
    curLoad ++;
    
    if (curLoad >= Object.keys(imgs).length){
        scene = 'game';
    }
    
    pushStyle();
        noFill();
        strokeWeight(10);
        strokeCap(SQUARE);
        stroke(255);
        arc(width / 2, height / 2, 300, 300, 0, curLoad * 100);
    popStyle();
    
    fill(255);
    textFont(createFont("sans-serif"), 49);
    textAlign(CENTER, CENTER);
    text("Loading...", width / 2, 100);
}

// BLOCKS \\
function Block(x, y, type){
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 80;
    this.type = type;
    
    this.display = function() {
        image(imgs[this.type+"_block"], this.x, this.y, 80, 80);
    };
}

// PLAYER \\
function Player(x, y){
    this.setX = x;
    this.setY = y;
    this.x = this.setX;
    this.y = this.setY;
    this.grav = 0.5,
    this.falling = false;
    this.w = 80;
    this.h = 80;
    this.v = {
        x: 0,
        y: 0,
    };
    this.draw = function(){
        image(imgs[this.type+"_player"], this.x, this.y, this.w, this.h);
        image(imgs.eyes, this.x, this.y);
    },
    this.move = function(){
        // X Movement
        if (keys.d || keys[RIGHT]){
            this.v.x = 5;
        } else if (keys.a || keys[LEFT]){ 
            this.v.x = -5;
        } else {
            this.v.x = 0;
        }
        
        this.x += this.v.x;
        this.collide(this.v.x, 0);
        
        // Y Movement
        if ((keys.w || keys[UP]) && !this.falling){
            this.v.y = -10;
            this.falling = true;
        }
        this.y += this.v.y;
        this.v.y += this.grav;
        this.collide(0, this.v.y);
    };
    this.collide = function(vx, vy){
        for (var i = 0; i < blocks.length; i ++){
            if (rectRect(this, blocks[i])){
                if (vx > 0){
                    this.v.x = 0;
                    this.x = blocks[i].x - this.w;
                }
                if (vx < 0){
                    this.v.x = 0;
                    this.x = blocks[i].x + blocks[i].w;
                }
                if (vy > 0){
                    this.v.y = 0;
                    this.y = blocks[i].y - this.h;
                    this.falling = false;
                }
                if (vy < 0){
                    this.v.y = 0;
                    this.y = blocks[i].y + blocks[i].h;
                }
            }
        }
    };
    this.run = function(){
        this.draw();
        this.move();
    };
}
let player = new Player(0, 0);

// LEVELS \\
function loadLevel(nxt){
    blocks = [];
    enemies = [];
    
    if (nxt){
        level ++;
    }
    
    for (let i = 0; i < levels[level].map.length; i ++){
        for (let j = 0; j < levels[level].map[i].length; j ++){
            let X = j * 80;
            let Y = i * 80;
            switch (levels[level].map[i][j]){
                case '@':
                    player.setX = X;
                    player.setY = Y;
                    player.x = X;
                    player.y = Y;
                    
                    player.type = levels[level].scene;
                break;
                case 'c':
                    blocks.push(new Block(X, Y, 'concrete'));
                break;
                case 'g':
                    blocks.push(new Block(X, Y, 'grass'));
                break;
                case 'd':
                    blocks.push(new Block(X, Y, 'dirt'));
                break;
                
            }
        }
    }
}
loadLevel(false);

// SCENES \\
function game(){
    background(255);
    translate(cam.x, cam.y);
    
    cam.x = constrain(cam.x, levels[level].map.length, 0);
    cam.x = lerp(cam.x, player.x + width/2, cam.speed);
    cam.y = lerp(cam.y, player.y - height/2, cam.speed);
    
    
    for (let b in blocks){
        blocks[b].display();
    }
    
    
    player.run();
}
draw = function() {
    this[scene]();
};

