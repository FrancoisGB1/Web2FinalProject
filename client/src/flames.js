// Flames.js

export class Flame {

    constructor(x, frames, settings = {}) {
        this.frames = frames;
        this.frameIndex = 0;
        this.ticks = 0;
        this.ticksPerFrame = settings.ticksPerFrame ?? 5;
        this.done = false;

        // where we put the flame
        this.container = settings.container ?? document.querySelector(".intro-teal");
        // movement
        this.speedY = settings.speedY ?? -80;  // px/s (negative = go up)
        this.y = settings.startTop ?? this.container.offsetHeight; // just under the bottom
        this.x = x;

        // fade-out when on the last sprite
        this.opacity = 1;
        this.fadeSpeed = settings.fadeSpeed ?? 0.5; // opacity per second

        // Create the DOM node
        this.node = document.createElement("div");
        this.node.className = "flame-sprite";
        this.node.style.position = "absolute";
        this.node.style.width = "120px";    // adjust if needed
        this.node.style.height = "120px";   // adjust if needed
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.backgroundRepeat = "no-repeat";
        this.node.style.backgroundSize = "contain";
        this.node.style.pointerEvents = "none";
        this.node.style.backgroundImage = `url(${this.frames[this.frameIndex]})`;
        this.container.appendChild(this.node);
    }

    destroy() {
        if (this.done) return;
        this.done = true;
        if (this.node && this.node.parentNode) {
            this.node.parentNode.removeChild(this.node);
        }
    }

    /**
     * Call this from your main AnimationFrame loop.
     * @param {number} frameTime - time since last frame in seconds
     */
    update(frameTime) {
        if (this.done) return;
        // --- MOVE UP ---
        this.y += this.speedY * frameTime;
        this.node.style.top = `${this.y}px`;

        // --- ANIMATE SPRITE ---
        this.ticks++;

        // change frame every ticksPerFrame "updates"
        if (this.ticks >= this.ticksPerFrame) {
            this.ticks = 0;

            // if not on last frame yet, advance
            if (this.frameIndex < this.frames.length - 1) {
                this.frameIndex++;
                this.node.style.backgroundImage =
                    `url(${this.frames[this.frameIndex]})`;
            } else {
                // LAST SPRITE: ease out (fade) then delete
                if(this.frameIndex == 7){
                    this.opacity -= this.fadeSpeed;
                }
                if (this.opacity <= 0) {
                    this.destroy();
                    return;
                }
                this.node.style.opacity = this.opacity;
            }
        }
    }
}

export default Flame;
