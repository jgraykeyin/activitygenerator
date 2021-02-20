async function fetchJSONData() {
    
    let url="things_todo.json";
    let response = await fetch(url);
    let things = await response.json();

    // console.log(things);

    // Create random number to select an item from the JSON data
    let num = Math.floor(Math.random() * things.length);
    // console.log(things[num]["action"]);

    document.getElementById("output-text").innerHTML = `<p>${things[num]['action']}</p>`;
}


function main() {

    console.log("Hey!");

    // Testing Speech synth 
    if ('speechSynthesis' in window) {
        console.log("Speech synth supported")
    } else {
        console.log("Speech synth not supported")
    }

    // Initialize our buttons
    buttonListeners();
}


function rejectActivity(reject, refresh, accept) {
    // Reset the board so the spin button is the only one visible
    reject.setAttribute("type","hidden");
    refresh.setAttribute("type","image");
    accept.setAttribute("type","hidden");
}


function acceptActivity(reject, accept) {
    let current_activity = document.getElementById("output-text");

    reject.setAttribute("type","hidden");
    accept.setAttribute("type","hidden");

    current_activity.innerHTML = "It's time to " + current_activity.innerText + "!<br /><span style='font-size:26px;'>Please enter your parent code when the activity is done.</span>";

    // Swap grid positions for the output and button areas
    let button_area = document.getElementById("button-area");
    let output_area = document.getElementById("output-area");
    let main_area = document.getElementById("main-container");

    // Swap positions of the button & output areas so the focus will go to the output text
    main_area.style.gridTemplateRows = "1fr 3fr 1fr 1fr";
    button_area.style.gridRow = "3 / 4";
    output_area.style.gridRow = "2 / 3";

    console.log("Ok speak now...");
    speakText();

}


// Keeping all our button listeners inside this function
function buttonListeners() {

    let reject_btn = document.getElementById("reject-button");
    let refresh_btn = document.getElementById("activity-button");
    let accept_btn = document.getElementById("accept-button");

    reject_btn.addEventListener("click", function() {
        console.log("Clicking reject");
        rejectActivity(reject_btn, refresh_btn, accept_btn);
    });

    accept_btn.addEventListener("click", function() {
        console.log("Clicking accept");
        acceptActivity(reject_btn, accept_btn);
    });

    // Setup the sound button
    let sound_btn = document.getElementById("sound-button");
    sound_btn.addEventListener("click", speakText);

    // Setup sound effect files
    let snd_spin = new sound("audio/spin1.m4a");
    let snd_done = new sound("audio/done1.m4a");

    // Spin the main activity randomizer
    refresh_btn.addEventListener("click", function() {
        
        snd_spin.play();

        // Hiding the main spin button
        refresh_btn.setAttribute("type","hidden");
        
        // Setup a repeating timer to make the text quickly change in the output window
        let timerId = setInterval(() => {
            fetchJSONData();
        }, 50);

        // Stop the timer and play the success sound
        setTimeout(() => { 
            clearInterval(timerId); 
            snd_done.play();
            reject_btn.setAttribute("type","image");
            accept_btn.setAttribute("type","image");
        }, 2000);

        // This needs to be fixed, probably using promises. 
        // But right now, it'll trigger the speech just after the main spin is done.
        setTimeout(() => {
            speakText();
        }, 2200);
    });
}


// Speech Synth for reading the output
function speakText() {

    // Now we'll get the text that's been chosen and get our speech synth to read it out
    let output = document.getElementById("output-text").innerText;
    let synth = window.speechSynthesis;
    let text = new SpeechSynthesisUtterance(output);
    
    // This will stop the voice from repeating a million times if somebody mashes the button
    if (synth.speaking) {
        synth.cancel();
        synth.speak(text);
    } else {
        synth.speak(text);
    }
}


// Object to create a new audio element for sound effects to play
class sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }

    pause() {
        this.sound.pause();
    }
}


window.addEventListener("load", main);
