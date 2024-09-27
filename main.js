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
let loadLevel;

let scene = 'load';

let curLoad = 0;
let level = 0;

let loading = true;
let dev = false;

let blocks = [];
let enemies = [];
const levels = [
    {
        map: [
            "                                  ",
            "                                  ",
            "                 _____    __________",
            "@               ______    __________",
            "_________   __________    __________",
            "_________   __________    __________",
            "_________   __________    __________",
            "_________   __________    __________",
            "_________   __________    __________",
            "____________________________________",
            "____________________________________",
            "____________________________________",
            "____________________________________",
        ],
        scene: "tutorial",
    },
    {
        map: [
            "                  ",
            "                  ",
            "                  ",
            "                  ",
            "@    ggg       ",
            "gggggdddggggg",
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
    tutorial_background: function(){
        background(0, 0);
        
        pushStyle();
            let xOff = 0;
            for (let i = 0; i < width; i ++){
                let yOff = 0;
                for (let j = 0; j < height; j ++){
                    const bright = map(noise(xOff, yOff), 0, 1, 150, 240);
                    stroke(bright);
                    strokeWeight(3);
                    point(i*2, j*2);
                    yOff += 0.01;
                }
                xOff += 0.01;
            }
        popStyle();
        
        return get(0, 0, 600, 600);
    },
    earth_background: function(){
        background(0, 0);
        
        background(0, 138, 18);
        
        return get(0, 0, 600, 600);
    },
    water_background: function(){},
    fire_background: function(){},
    wind_background: function(){},
    tutorial_player: function(){
        background(0, 0, 0, 0);
        
        fill(224, 224, 224);
        rect(0, 0, 80, 80, 10);
        
        fill(209, 209, 209);
        rect(0, 0, 40, 80, 10);
        
        return get(0, 0, 80, 80);
    },
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
    tile_block: function(){
        background(0, 0);
        
        for (let i = 0; i < 4; i++){
            var x = (i % 2) * 40;
            var y = Math.floor(i / 2) * 40;
            
            fill(250-i*8);
            rect(x, y, 40, 40);
        }
        
        return get(0, 0, 80, 80);
    },
    spike_up_block: function(){},
    spike_down_block: function(){},
    spike_right_block: function(){},
    spike_left_block: function(){},
    crop_dry_block: function(){},
    crop_mid_block: function(){},
    crop_healthy_block: function(){},
    brick_block: function(){},
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
const Block = (function(){
    function Block(x, y, type){
        this.x = x;
        this.y = y;
        this.w = 80;
        this.h = 80;
        this.type = type;
        
        this.display = function() {
            image(imgs[this.type+"_block"], this.x, this.y, 80, 80);
            if (levels[level].scene === 'earth'){
                fill(0, dist(this.x, this.y, player.x, player.y)-100);
                rect(this.x, this.y, this.w, this.h);
            }
        };
    }
    return Block;
})();

// PLAYER \\
const Player = (function(){
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
            
            this.x = constrain(this.x, 0, levels[level].map[0].length * 80);
            
            if (this.x >= levels[level].map[0].length*80){
                loadLevel(true);
            }
            
            this.x += this.v.x;
            this.collide(this.v.x, 0);
            
            // Y Movement
            if ((keys.w || keys[UP]) && !this.falling){
                this.v.y = -12;
                this.falling = true;
            }
            this.y += this.v.y;
            this.v.y += this.grav;
            this.collide(0, this.v.y);
            
            if (keys.r){
                this.x = this.setX;
                this.y = this.setY;
            }
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
    return Player;
})();
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
                case '_':
                    blocks.push(new Block(X, Y, 'tile'));
            }
        }
    }
}
loadLevel(false);

// SCENES \\
function game(){
    image(imgs[levels[level].scene+"_background"], 0, 0, width, height);
    translate(-cam.x, -cam.y);
    
    cam.x = constrain(cam.x, 15, levels[level].map[0].length*80 - width);
    cam.x = lerp(cam.x, player.x - width/2 + player.w/2, cam.speed);
    cam.y = lerp(cam.y, player.y - height/2 + player.h/2, cam.speed);
    
    
    for (let b in blocks){
        if (blocks[b].x > cam.x-width){
            blocks[b].display();
        }
    }
    
    player.run();
    
    resetMatrix();
    
    if (keys['=']){
        dev = !dev;
    }
    if (dev){
        stroke(0);
        strokeWeight(1);
        line(width/2, 0, width/2, height);
        
        line(0, height/2, width, height/2);
        
        fill(0);
        textSize(30);
        text("Cam: "+cam.x.toFixed(0)+","+cam.y.toFixed(0), 55, 10);
    }
}
draw = function() {
    this[scene]();
};

var canvas = window[['document']][['getElementById']]('output-canvas');
// canvas.focus();
