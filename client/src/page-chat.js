import {registerCallbacks, sendMessage, signout, chatMessageLoop} from './chat-api';

window.addEventListener("load", () => {
    document.querySelector("textarea").onkeyup = function (evt) {
        sendMessage(evt, this)
    };
    document.querySelector("#sign-out-btn").onclick = signout;
    registerCallbacks(newMessage, memberListUpdate);
    chatMessageLoop();
})

// Lorsqu'un nouveau message doit être affiché à l'écran, cette fonction est appelée
const newMessage = (fromUser, message, isPrivate) => {
    console.log(fromUser, message, isPrivate);
}

// À chaque 2-3 secondes, cette fonction est appelée. Il faudra donc mettre à jour la liste des membres
// connectés dans votre interface.
const memberListUpdate = members => {
    console.log(members);
}


// MY CODE --------------------------------------------------------------------------------------------------------------------------------------------

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
