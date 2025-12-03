import {signin} from './chat-api';
import Flame from "./flames.js";

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return signin(this);
    }
});

// Animation for the flames ----------------------------------------------------------------------------------------------------------------------

// list of frame paths for the flame
const flameFrames = [
    "img/intro/flame1.png",
    "img/intro/flame2.png",
    "img/intro/flame3.png",
    "img/intro/flame4.png",
    "img/intro/flame5.png",
    "img/intro/flame6.png",
    "img/intro/flame7.png",
    "img/intro/flame8.png"
];
// actual setup and start the loop after 4.5 sec
window.addEventListener("load", () => {
    const introTeal = document.getElementById("intro-teal"); //container for flames
    const spriteList = []; 
    let lastTime = 0;
    let spawnCooldown = 0;          
    const spawnInterval = 0.02;   

    // loop for pushing object and creating time counter
    function loop(time) {
        const frameTime = (time - lastTime) / 1000 || 0;
        lastTime = time;

        // spawn a new flame
        spawnCooldown += frameTime;
        if (spawnCooldown >= spawnInterval) {
            spawnCooldown -= spawnInterval;

            // choose random X
            const width = introTeal.offsetWidth;
            const randomX = Math.floor(Math.random() * (width - 120));

            spriteList.push(
                new Flame(randomX, flameFrames, {
                    container: introTeal,
                    speedY: -275, 
                    fadeSpeed: 0.5 //opacity fade
                })
            );
        }

        // update sprites 
        for (let sprite of spriteList) {
            sprite.update(frameTime);
        }

        // kill sprites
        for (let i = spriteList.length - 1; i >= 0; i--) {
            if (spriteList[i].done) {
                spriteList.splice(i, 1);
            }
        }
        requestAnimationFrame(loop);
    }
    // start after a delay (causes a weird burst because of the time variable but whatever idk how to fix it)
    setTimeout(() => {
        requestAnimationFrame(loop);
    }, 4500);
});

// All of the animation timesouts for the css stuff -----------------------------------------------------------------------------------------------

// Flash the screen, see css intro-flash
function flashScreen() {
    const flash = document.getElementById("intro-flash");
    if (!flash) return;
    flash.classList.add("active");
    setTimeout(() => flash.classList.remove("active"), 100);
}

// Big slide in function (just makes them show up thats all it does look at css otherwise)
function startIntro() {
    // all the dom stuff
    const charizard = document.getElementById("intro-charizard");
    const teal = document.getElementById("intro-teal");
    const barTop = document.getElementById("intro-bar-top");
    const barBottom = document.getElementById("intro-bar-bottom");
    const pressStart = document.getElementById("intro-press-start");
    const logoWrapper = document.getElementById("intro-logo-wrapper");
    const whitebar = document.getElementById("intro-whitebar");


    // ALL OF THIS IS IS THROUGH CSS SLIDEIN wITH TRANSFORM GO CHECK THE CSS IM JUST ADDING THE CSS CLASS HERE

    // make charizard appear
    if (charizard) {
        charizard.classList.add("show");
    }

    // flash, slide in the middle box
    setTimeout(() => {
        flashScreen();
        if (teal) teal.classList.add("slide-in");
    }, 1200);

    // flash, slide in top and bottom boxes
    setTimeout(() => {
        flashScreen();
        if (barTop) barTop.classList.add("slide-in");
        if (barBottom) barBottom.classList.add("slide-in");
        if (pressStart) pressStart.classList.add("slide-in");
    }, 2100);

    // flash, logo slide in and slide in white bar for shine
    setTimeout(() => {
        flashScreen();
        if (logoWrapper) logoWrapper.classList.add("show");
        if (whitebar) {
            whitebar.classList.remove("animate");
            void whitebar.offsetWidth; 
            whitebar.classList.add("animate");
        }
        const charizard = document.getElementById("intro-charizard");
        charizard.src = "img/intro/charizard.png"
    }, 3000);

}

// Running the slideins and click events ----------------------------------------------------------------------------------------------------

// music, then delay and start the slide ins from css
let introMusic = new Audio("audio/titlescreen.mp3");
introMusic.volume = 0.2;

function startIntroWithMusic() {
    introMusic.currentTime = 0;
    introMusic.play();
    setTimeout(() => {
        startIntro();  // <-- your Charizard + flashes sequence
    }, 1400);
}

// load
window.addEventListener("load", () => {
    
    let loginwrapper = document.getElementById("login-wrapper");

    // remove the start click after click or keying down because we dont want to spam the intro
    const startOnce = () => {
        document.removeEventListener("click", startOnce);
        document.removeEventListener("keydown", startOnce);
        // run the intro 
        startIntroWithMusic();
    };
    // run it, then remove
    document.addEventListener("click", startOnce);
    document.addEventListener("keydown", startOnce);

    // after 3 sec, clicking opens login
    setTimeout(() => {
        document.addEventListener("click",() =>{
            loginwrapper.style.zIndex = 6;
        });
    }, 2000);
});