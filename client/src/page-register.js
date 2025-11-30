import {register} from './chat-api';
import Walker from "./walker";

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return register(this, (message) => {
            // L'enregistrement est complétée (la requête)
        });
    }
})

function setupWalkerAndLoop() {
    const walkerImg = document.getElementById("walker");
    const mapBg = document.getElementById("map-bg");
    if (!walkerImg || !mapBg) return;

    const walker = new Walker(walkerImg, mapBg);

    let lastTime = null;

    function loop(timestamp) {
        if (lastTime === null) {
            lastTime = timestamp;
        }
        const dt = (timestamp - lastTime) / 1000; // ms → seconds
        lastTime = timestamp;

        walker.update(dt);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

window.addEventListener("load", () => {
    setupWalkerAndLoop();
});