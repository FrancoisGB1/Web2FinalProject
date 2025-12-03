export class Flame {

    constructor(x, frames, settings = {}) {
        this.frames = frames;
        this.frameIndex = 0;
        this.ticks = 0;
        this.ticksPerFrame = settings.ticksPerFrame ?? 17;
        this.done = false;

        // container
        this.container = settings.container ?? document.querySelector(".intro-teal");

        // movement
        this.speedY = settings.speedY ?? -80;  
        this.y = settings.startTop ?? this.container.offsetHeight; 
        this.x = x;

        // fade-outon the last sprite
        this.opacity = 1;
        this.fadeSpeed = settings.fadeSpeed ?? 0.5; // opacity per second

        // Create the DOM node
        this.node = document.createElement("div");
        this.node.className = "flame-sprite";
        this.node.style.position = "absolute";
        this.node.style.width = "120px";    
        this.node.style.height = "120px";  
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.backgroundRepeat = "no-repeat";
        this.node.style.backgroundSize = "contain";
        this.node.style.pointerEvents = "none";
        this.node.style.backgroundImage = `url(${this.frames[this.frameIndex]})`;
        this.container.appendChild(this.node);
    }

    // kill them
    destroy() {
        if (this.done) return;
        this.done = true;
        if (this.node && this.node.parentNode) {
            this.node.parentNode.removeChild(this.node);
        }
    }

    // update
    update(frameTime) {
        if (this.done) return;
        // stop updating when done
        this.y += this.speedY * frameTime;
        this.node.style.top = `${this.y}px`;

        // counter for sprites change
        this.ticks++;

        // change sprite every ticksPerFrame
        if (this.ticks >= this.ticksPerFrame) {
            this.ticks = 0;

            // if not on last sprite keep going
            if (this.frameIndex < this.frames.length - 1) {
                this.frameIndex++;
                this.node.style.backgroundImage = `url(${this.frames[this.frameIndex]})`;
            } else {
                // last sprite ease out
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
