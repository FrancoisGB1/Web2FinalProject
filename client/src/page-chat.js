import {registerCallbacks, sendMessage, signout, chatMessageLoop} from './chat-api';
import Attack from "./Attack.js";

document.querySelector("#sign-out-btn").onclick = signout;

window.addEventListener("load", () => {

    const chatInput = document.querySelector("#chat-input");
    const chatForm  = document.querySelector("#chat-form");

    chatForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        if (chatInput.value.trim() == "") return;
        sendMessage({ which: 13 }, chatInput);
    });

    registerCallbacks(newMessage, memberListUpdate);
    chatMessageLoop();
});

const newMessage = (fromUser, message, isPrivate) => {
    const chatLog = document.querySelector("#chat-log");

    if (!chatLog) {
        console.log(fromUser, message, isPrivate);
        return;
    }

    let line = "";

    if (fromUser) {
        line += fromUser;
        if (isPrivate) {
            line += " (privé)";
        }
        line += " : ";
    }

    line += message;

    chatLog.value += line + "\n";

    chatLog.scrollTop = chatLog.scrollHeight;
    
    // Animation for shiny charmander
    if (message.trim().toLowerCase() == "shiny") {
        const playerPokemon = document.querySelector("#player-pokemon");
        if (playerPokemon) {
            playerPokemon.src = "img/battle/shinyCharmander.png";
            playerPokemon.style.bottom = "-8%";
            playerPokemon.style.width = "37%"
        }
    }

    if (message.trim().toLowerCase() == "more pp") {
        ppCountScratch = 35;
        ppCountEmber = 35;
        ppText.innerHTML = `${ppCountScratch}&nbsp;&nbsp;&nbsp;35`;

    }

};

// À chaque 2-3 secondes, cette fonction est appelée. Il faudra donc mettre à jour la liste des membres
// connectés dans votre interface.
const memberListUpdate = members => {
    console.log(members);
}


// MY CODE --------------------------------------------------------------------------------------------------------------------------------------------

const scratchSfx = new Audio("audio/Scratch.mp3");
const emberSfx   = new Audio("audio/Ember.mp3");
const ppText = document.getElementById("pp-text");
const typeText = document.getElementById("type-text");
let attackList = [];

let enemyMaxHP = 35;
let enemyHP = 35;
const ENEMY_BAR_MAX_WIDTH = 45.6; // css width = 45.6%
let ppCountScratch = 35;
let ppCountEmber = 35;

let enemyAlive = true;

console.log(enemyHP)
// Animations with sprite llist as param

// Scratch
function spawnScratchAttack() {
    if(ppCountScratch <= 0){
        console.log("No PP left!!!")
        return
    }

    typeText.innerHTML = `NORMAL`;    

    const frames = [
        "img/battle/scratch1.png",
        "img/battle/scratch2.png",
        "img/battle/scratch3.png",
        "img/battle/scratch4.png",
    ];

    const attack = new Attack(frames, {
        top: "37%",
        right: "20%",
        size: 220,
        ticksPerFrame: 15, // speed
    });
    
    scratchSfx.volume = 0.3; 
    scratchSfx.currentTime = 0; 
    scratchSfx.play();
    console.log(enemyHP);
    if (!attack.done) {
        attackList.push(attack);
        damageEnemy(10)
        updateEnemyHPMask()
        ppCountScratch--
        if(ppCountScratch >= 10){
            ppText.innerHTML = `${ppCountScratch}&nbsp;&nbsp;&nbsp;35`;
            ppText.style.left = "84.2%"
        }
        else{
            ppText.style.left = "86.5%"
            ppText.innerHTML = `${ppCountScratch}&nbsp;&nbsp;&nbsp;35`;
        }
    }
}


// Ember

function spawnEmberAttack() {
    if(ppCountEmber <= 0){
        console.log("No PP left!!!")
        return
    }
    typeText.innerHTML = `FEU`;    
    const frames = [
        "img/battle/ember1.png",
        "img/battle/ember2.png",
        "img/battle/ember3.png",
        "img/battle/ember4.png",
        "img/battle/ember5.png",
    ];

    const attack = new Attack(frames, {
        top: "37%",
        right: "20%",
        size: 220,
        ticksPerFrame: 20,
        
    });

    emberSfx.volume = 0.3; 
    emberSfx.currentTime = 0; 
    emberSfx.play();

    if (!attack.done) {
        attackList.push(attack);
        damageEnemy(15)
        updateEnemyHPMask()
        ppCountEmber--
        if(ppCountEmber >= 10){
            ppText.innerHTML = `${ppCountEmber}&nbsp;&nbsp;&nbsp;35`;
            ppText.style.left = "84.2%"
        }
        else{
            ppText.style.left = "86.5%"
            ppText.innerHTML = `${ppCountEmber}&nbsp;&nbsp;&nbsp;35`;
        }
    }
}

// Change the width of the HP mask and reduce HP

function damageEnemy(amount) {
    if (!enemyAlive) return; // cant damage if dead

    enemyHP = Math.max(0, enemyHP - amount);
    updateEnemyHPMask();

    if (enemyHP == 0) {
        enemyFaint();
    }
}


function updateEnemyHPMask() {
    const bar = document.getElementById("enemy-hp-bar-area");
    const hpPercent = enemyHP / enemyMaxHP;         // 1.0 = full, 0.7 = 70%
    const lostPercent = 1 - hpPercent;             // 0.3 = 30% damage
    const width = ENEMY_BAR_MAX_WIDTH * lostPercent;

    bar.style.width = width + "%";
}

// fade out the pidgey
function enemyFaint() {
    enemyAlive = false;
    console.log("Enemy Pidgey fainted!");

    const sprite = document.getElementById("enemy-pokemon");

    if (sprite) {
        sprite.style.transition = "opacity 0.5s ease-out";
        sprite.style.opacity = "0";
    }

    // spawn next
    setTimeout(() => {
        spawnNextEnemy();
    }, 1500);
}

// reset values and restore sprite
function spawnNextEnemy() {
    console.log("A new enemy appears!");

    enemyMaxHP = 35;
    enemyHP = 35;
    updateEnemyHPMask();
    enemyAlive = true;

    const sprite = document.getElementById("enemy-pokemon");
    if (sprite) {
        sprite.style.opacity = "1";
        sprite.src = "img/battle/pidgey.png";  
    }
}


// update attacks in list and splice when done

function battleTick() {
    // Update all active attacks
    for (let i = attackList.length - 1; i >= 0; i--) {
        const attack = attackList[i];
        attack.update();
        if (attack.done) {
            attackList.splice(i, 1);
        }
    }

    requestAnimationFrame(battleTick);
}



// button click events and launching animation frame loop

window.addEventListener("load", () => {

    // start the animation loop
    updateEnemyHPMask()
    battleTick();

    const scratchBtn = document.querySelector(".move-btn1");
    const emberBtn   = document.querySelector(".move-btn2");

    if (scratchBtn) {
        scratchBtn.addEventListener("click", () => {
            spawnScratchAttack();
        });
    }

    if (emberBtn) {
        emberBtn.addEventListener("click", () => {
            spawnEmberAttack();
        });
    }
    
});



// Audio for the music and pidgey cry 

const cryPidgey = new Audio("audio/pidgey.mp3");
cryPidgey.volume = 0.3;

// Music for fun
window.addEventListener("click", () => {
    const bgm = document.getElementById("bgm");
    if (bgm.paused) {
        bgm.volume = 0.10;  
        bgm.play();
    }
    // pidgey cry
    setTimeout(() => {
      cryPidgey.play();
    }, 3500);

}, { once: true });


