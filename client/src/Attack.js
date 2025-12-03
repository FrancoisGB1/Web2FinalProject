
export class Attack {

    constructor(frames, settings = {}) {
        this.frames = frames;
        this.frameIndex = 0;
        this.ticks = 0;
        this.ticksPerFrame = settings.ticksPerFrame ?? 5; // how many updates between frames, kind of using a tertiary operator here
        this.done = false;

        const top = settings.top ?? "22%";
        const right = settings.right ?? "18%";
        const size = settings.size ?? 140;

        // Create the div to show the animation
        this.node = document.createElement("div");
        Object.assign(this.node.style, {
            position: "absolute",
            width: size + "px",
            height: size + "px",
            top,
            right,
            backgroundImage: `url(${this.frames[0]})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            pointerEvents: "none",
            zIndex: "50",
        });

        // Append it
        const container = document.getElementById("battle-container");
        container.appendChild(this.node);
    }

    update() {
        if (this.done) return;

        this.ticks++;

        // Change frame every X ticks
        if (this.ticks % this.ticksPerFrame == 0) {
            this.frameIndex++;

            // remove after we're done
            if (this.frameIndex >= this.frames.length) {
                this.node.remove();
                this.done = true;
                return;
            }

            this.node.style.backgroundImage = `url(${this.frames[this.frameIndex]})`;
        }
    }
}

export default Attack;
