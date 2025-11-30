import {register} from './chat-api';
import Walker from "./walker";

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return register(this, (message) => {
            // L'enregistrement est complétée (la requête)
        });
    }
})



/* 
Explanation : https://stackoverflow.com/questions/50311887/what-exactly-is-the-argument-in-requestanimationframe-callback
I used the requestanimationframe argument to track time since the page was opened, because my update function is time dependant for each tile movement
It ended up being a pain in the ass and way too complicated but I hope youll enjoy it
*/
function setupWalkerAndLoop() {
    // create the sprite for the walking character
    const walkerImg = document.getElementById("walker");
    const mapBg = document.getElementById("map-bg");
    if (!walkerImg || !mapBg) return;

    const walker = new Walker(walkerImg, mapBg);

    // initialize the last counted time based on the parameter time that requestAnimationFrame sends back
    let lastTime = null;

    // function with time parameter from requestAnimationFrame
    function loop(timeSinceLaunch) {
        // probably 0 or so
        if (lastTime === null) {
            lastTime = timeSinceLaunch;
        }
        // calcs the time since each frame passed, from waht I saw its like 0.016 
        const frameTime = (timeSinceLaunch - lastTime) / 1000; // ms → seconds
        lastTime = timeSinceLaunch;
        // update based on frametime passed
        walker.update(frameTime);
        // run it again
        requestAnimationFrame(loop);
    }
    // Loop it
    requestAnimationFrame(loop);
}

window.addEventListener("load", () => {
    //launch the loop at load time
    setupWalkerAndLoop();
});

// Music for fun
window.addEventListener("click", () => {
    const bgm = document.getElementById("bgm");
    if (bgm.paused) {
        bgm.volume = 0.3;  // Adjust volume as needed
        bgm.play();
    }
}, { once: true });