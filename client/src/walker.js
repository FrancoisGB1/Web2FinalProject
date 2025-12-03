
// Sprites 

const SPRITES = {
    up: {
        stand: "img/walking/standingUp.png",
        walk: [
            "img/walking/walk2Up.png",
            "img/walking/walk1Up.png"
        ]
    },
    down: {
        stand: "img/walking/standingDown.png",
        walk: [
            "img/walking/walk1Down.png",
            "img/walking/walk2Down.png"
        ]
    },
    left: {
        stand: "img/walking/standingLeft.png",
        walk: [
            "img/walking/walk1Left.png",
            "img/walking/walk2Left.png"
        ]
    },
    right: {
        stand: "img/walking/standingRight.png",
        walk: [
            "img/walking/walk1Right.png",
            "img/walking/walk2Right.png"
        ]
    }
};


// Collision section 

// 0 = walkable, 1 = blocked
const collision_map = [
    [1, 0, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1],
];

const MAP_ROWS = collision_map.length;        // 13
const MAP_COLS = collision_map[0].length;     // 8 idk why I did 8 I just removed bounds outside the array anyways, uselessm shoudlve been 7

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Class

export default class Walker {

    constructor(imgNode, mapNode) {
        this.img = imgNode;
        this.map = mapNode;

        // Starting positions (weird because we're using an image on a 1920x1080)
        this.x = 0.7342;
        this.y = 0.4;
        // grid position for collision
        this.gridX = 4;  // column x
        this.gridY = 3;  // row  y

        // how much distance per step
        this.stepSize = 0.038;   

        
        this.moveSpeed = 0.12;   // how fast she slides between tiles
        this.stepDuration = this.stepSize / this.moveSpeed; // seconds to finish one step

        // Movement state
        this.direction = "down"; // see the dictionnary    
        this.moving = false;
        this.moveProgress = 0;      // 0→1 during a step
        this.startX = this.x;
        this.startY = this.y;
        this.targetX = this.x;
        this.targetY = this.y;

        // animation state
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.15;

        
        // keys
        this.keys = { up: false, down: false, left: false, right: false };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        this.applyPosition(this.x, this.y);
        this.setSprite();
    }



    // Get input

    handleKeyDown(evt) {


        // weird values because of custom movement per pixel 1920x1080
        // so we need different values for left right and up down
        let dir = null;
        switch (evt.code) {
            case "KeyW":
            case "ArrowUp":
                dir = "up";
                this.stepSize = 0.024;
                this.moveSpeed = 0.08;  
                break;
            case "KeyS":
            case "ArrowDown":
                dir = "down";
                this.stepSize = 0.024;
                this.moveSpeed = 0.08; 
                break;
            case "KeyA":
            case "ArrowLeft":
                dir = "left";
                this.stepSize = 0.0394;
                this.moveSpeed = 0.12; 
                break;
            case "KeyD":
            case "ArrowRight":
                dir = "right";
                this.stepSize = 0.0394;
                this.moveSpeed = 0.12; 
                break;
            default:
                return;
        }
 

        // key state
        this.keys[dir] = true;

        // try starting a new step in that direction
        this.tryStartMove(dir);
    }

    // Key state reset when we release key
    handleKeyUp(evt) {
        switch (evt.code) {
            case "KeyW":
            case "ArrowUp":
                this.keys.up = false;
                break;
            case "KeyS":
            case "ArrowDown":
                this.keys.down = false;
                break;
            case "KeyA":
            case "ArrowLeft":
                this.keys.left = false;
                break;
            case "KeyD":
            case "ArrowRight":
                this.keys.right = false;
                break;
            default:
                return;
        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------

    // Tile logic

    tryStartMove(dir) {
        if (this.moving) return; // finish step first

        // determine distance on x or y
        let dx = 0, dy = 0;
        if (dir == "up") dy = -1;
        else if (dir == "down") dy = 1;
        else if (dir == "left") dx = -1;
        else if (dir == "right") dx = 1;

        // Grid section
        // new grid index
        const newGridX = this.gridX + dx;
        const newGridY = this.gridY + dy;

        // Checl bounds
        if (
            newGridX < 0 || newGridX >= MAP_COLS ||
            newGridY < 0 || newGridY >= MAP_ROWS
        ) {
            return;
        }

        // collision check (1 = blocked)
        if (collision_map[newGridY][newGridX] == 1) {
            return;
        }

        // update grid index with new pos
        this.gridX = newGridX;
        this.gridY = newGridY;

        // Movement section
        // destination calc : position + (direction * stepsize)
        let tx = this.x + dx * this.stepSize;
        let ty = this.y + dy * this.stepSize;

        // update constructor values
        this.direction = dir;
        this.moving = true;
        this.moveProgress = 0;

        this.startX = this.x;
        this.startY = this.y;
        this.targetX = tx;
        this.targetY = ty;

    }


    // Movement logic ---------------------------------------------------------------------------------------------------
    
    // Update position with animation for sprites walking 

    update(frameTime) {  // frametime is 

        // if moving
        if (this.moving) {
            // progress ever frame
            this.moveProgress += frameTime / this.stepDuration;
            // if finished
            if (this.moveProgress >= 1) {
                this.moveProgress = 1;
                this.moving = false;
                this.x = this.targetX;
                this.y = this.targetY;
            }

            // get current pixel position 
            const curX = this.startX + (this.targetX - this.startX) * this.moveProgress;
            const curY = this.startY + (this.targetY - this.startY) * this.moveProgress;
            this.applyPosition(curX, curY);

            // walking animation
            this.frameTimer += frameTime;
            if (this.frameTimer >= this.frameDuration) {
                this.frameTimer = 0;
                const set = SPRITES[this.direction];
                this.frameIndex = (this.frameIndex + 1) % set.walk.length;
            }

        // If youre standing
        } else {
            // standing exactly on a tile position
            this.applyPosition(this.x, this.y);
            this.frameIndex = 0;
            this.frameTimer = 0;

            // auto-repeat: if key still held, start another step
            if (this.keys[this.direction]) {
                this.tryStartMove(this.direction);
            } else if (this.keys.up) {
                this.tryStartMove("up");
            } else if (this.keys.down) {
                this.tryStartMove("down");
            } else if (this.keys.left) {
                this.tryStartMove("left");
            } else if (this.keys.right) {
                this.tryStartMove("right");
            }
        }

        this.setSprite();
    }

    // Set the correct sprite for walking vs standing

    setSprite() {
        const set = SPRITES[this.direction];

        if (this.moving) {
            this.img.src = set.walk[this.frameIndex];
        } else {
            this.img.src = set.stand;
        }
    }

    // Apply the current position properly to the sprite

    applyPosition(x, y) {
        if (!this.map) return;

        const rect = this.map.getBoundingClientRect();
        const screenX = rect.left + x * rect.width;
        const screenY = rect.top + y * rect.height;

        this.img.style.left = screenX + "px";
        this.img.style.top = screenY + "px";
    }



    // destroy listeners if needed in future ? **

    destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }
}
