// client/src/walker.js

const SPRITES = {
    up: {
        stand: "img/walking/standingUp.png",
        walk: [
            "img/walking/walk2Up.png",
            "img/walking/standingUp.png"
        ]
    },
    down: {
        stand: "img/walking/standingDown.png",
        walk: [
            "img/walking/walk1Down.png",
            "img/walking/standingDown.png"
        ]
    },
    left: {
        stand: "img/walking/standingLeft.png",
        walk: [
            "img/walking/walk1Left.png",
            "img/walking/standingLeft.png"
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

export default class Walker {
    /**
     * imgNode: <img id="walker">
     * mapNode: <img id="map-bg">
     * x,y are in [0,1] relative to map size
     */
    constructor(imgNode, mapNode) {
        this.img = imgNode;
        this.map = mapNode;

        // ---- NORMALIZED POSITION (keep your values) ----
        this.x = 0.7385;
        this.y = 0.4;

        // ---- TILE-LIKE STEP SYSTEM ----
        // Distance of one "tile" in normalized units (0..1).
        // Change this to match how big your tiles feel.
        this.stepSize = 0.038;   // try 0.02–0.03, tweak as you like


        this.moveSpeed = 0.12;   // how fast she slides between tiles
        this.stepDuration = this.stepSize / this.moveSpeed; // seconds to finish one step

        // Movement state
        this.direction = "down";    // "up" | "down" | "left" | "right"
        this.moving = false;
        this.moveProgress = 0;      // 0→1 during a step
        this.startX = this.x;
        this.startY = this.y;
        this.targetX = this.x;
        this.targetY = this.y;

        // Animation state
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.15;

        // Keys
        this.keys = { up: false, down: false, left: false, right: false };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        this.applyPosition(this.x, this.y);
        this.setSprite();
    }

    // ---------- INPUT ----------

    handleKeyDown(e) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;

        // weird values because of custom movement per pixel 1920x1080
        let dir = null;
        switch (e.code) {
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
        e.preventDefault();

        // register key state (used for auto-repeat)
        this.keys[dir] = true;

        // try starting a new step in that direction
        this.tryStartMove(dir);
    }

    handleKeyUp(e) {
        switch (e.code) {
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

    // ---------- TILE-STEP LOGIC ----------

    /**
     * Start a new step of exactly `stepSize` in the given direction,
     * only if we are not already moving.
     * No diagonals because we only move in 1 dir at a time.
     */
    tryStartMove(dir) {
        if (this.moving) return; // must finish current step first

        let dx = 0, dy = 0;
        if (dir === "up") dy = -1;
        else if (dir === "down") dy = 1;
        else if (dir === "left") dx = -1;
        else if (dir === "right") dx = 1;

        let tx = this.x + dx * this.stepSize;
        let ty = this.y + dy * this.stepSize;

        if (tx === this.x && ty === this.y) {
            return; // no movement possible (at edge)
        }

        this.direction = dir;
        this.moving = true;
        this.moveProgress = 0;
        this.stepDuration = this.stepSize / this.moveSpeed;

        this.startX = this.x;
        this.startY = this.y;
        this.targetX = tx;
        this.targetY = ty;
    }

    /**
     * Called each frame by page-register.js
     * dt = seconds since last frame.
     */
    update(seconds) {
        if (this.moving) {
            // progress from 0→1 over stepDuration seconds
            this.moveProgress += seconds / this.stepDuration;

            if (this.moveProgress >= 1) {
                this.moveProgress = 1;
                this.moving = false;
                this.x = this.targetX;
                this.y = this.targetY;
            }

            // interpolate between start and target
            const curX = this.startX + (this.targetX - this.startX) * this.moveProgress;
            const curY = this.startY + (this.targetY - this.startY) * this.moveProgress;
            this.applyPosition(curX, curY);

            // walking animation
            this.frameTimer += seconds;
            if (this.frameTimer >= this.frameDuration) {
                this.frameTimer = 0;
                const set = SPRITES[this.direction];
                this.frameIndex = (this.frameIndex + 1) % set.walk.length;
            }
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

    // ---------- SPRITES & POSITION ----------

    setSprite() {
        const set = SPRITES[this.direction];
        if (!set) return;

        if (this.moving) {
            this.img.src = set.walk[this.frameIndex];
        } else {
            this.img.src = set.stand;
        }
    }

    applyPosition(x, y) {
        if (!this.map) return;

        const rect = this.map.getBoundingClientRect();
        const screenX = rect.left + x * rect.width;
        const screenY = rect.top + y * rect.height;

        this.img.style.left = screenX + "px";
        this.img.style.top = screenY + "px";
    }

    destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }
}
