async function fetchJSONData() {
    
    // Fetch the JSON file and save it into localStorage
    let url="activities.json";
    let response = await fetch(url);
    let activities = await response.json();

    if (sessionStorage.getItem("activitiesJSON") === null) {
        localStorage.setItem("activitiesJSON", JSON.stringify(activities));
    } else {
        act = sessionStorage.getItem("activitiesJSON");
        localStorage.setItem("activitiesJSON", act);
        console.log(act);
    }
}


async function fetchActivity() {

    // Access the JSON data saved in localStorage
    let actJSON = localStorage.getItem("activitiesJSON");
    let activities = JSON.parse(actJSON);

    // Generate a random number for the main activity
    let main_len = activities.length;
    let main_num = Math.floor(Math.random() * main_len);

    // Generate a random number for the sub activity
    let sub_len = activities[main_num]["actions"].length;
    let sub_num = Math.floor(Math.random() * sub_len);

    // Combine the main & sub activities 
    let act1 = activities[main_num]["activity"];
    let act2 = activities[main_num]["actions"][sub_num]["action"];
    let activity = act1 + act2
    
    document.getElementById("output-text").innerHTML = `<p>${activity}</p>`;
}


function main() {

    console.log("Hey!");

    // Testing Speech synth 
    if ('speechSynthesis' in window) {
        console.log("Speech synth supported")
    } else {
        console.log("Speech synth not supported")
    }

    // Grab the activities from the JSON File
    fetchJSONData();

    // Initialize the star counter
    initStarCounter();

    // Initialize our buttons
    buttonListeners();
}


// This function will make sure all the stars are loaded from localStorage when the page loads up
function initStarCounter() {
    let star_count = parseInt(localStorage.getItem("star_count"));
    console.log("Init stars: " + star_count);
    
    if (star_count === null || isNaN(star_count)) {
        init_count = 0;
        localStorage.setItem("star_count", init_count);
    } else {
        let x=0;
        while (x < star_count) {
            addStarImage();
            x+=1;
        }
    }
}


function removeStarImage() {
    let display = document.getElementById("star-area");
    display.innerHTML = "";
    initStarCounter();
}


function removeStarCount() {
    let star_count = parseInt(localStorage.getItem("star_count"));
    let new_count = star_count - 1;
    
    localStorage.setItem("star_count", new_count);
    console.log(`New star count: ${new_count}`);
    removeStarImage();
}


function addStarCount() {
    let star_count = parseInt(localStorage.getItem("star_count"));
    let new_count = star_count + 1;
    
    localStorage.setItem("star_count", new_count);
    console.log(`New star count: ${new_count}`);
}


function addStarImage() {
    let image = "<img src='images/teal_star.png'>";
    let display = document.getElementById("star-area");
    display.innerHTML = display.innerHTML + image;
}


function rejectActivity(reject, refresh, accept) {
    // Reset the board so the spin button is the only one visible
    reject.setAttribute("type","hidden");
    refresh.setAttribute("type","image");
    accept.setAttribute("type","hidden");

    removeStarCount();
}


function acceptActivity(reject, accept) {
    let current_activity = document.getElementById("output-text");

    reject.setAttribute("type","hidden");
    accept.setAttribute("type","hidden");

    current_activity.innerHTML = "<p>It's time to " + current_activity.innerText + "!<br />Press the button when you're done the activity.</p>";

    // Swap grid positions for the output and button areas
    let button_area = document.getElementById("button-area");
    let output_area = document.getElementById("output-area");
    let main_area = document.getElementById("main-container");
    let star_area = document.getElementById("star-area");

    // Swap positions of the button & output areas so the focus will go to the output text
    main_area.style.gridTemplateRows = "1fr 3fr 0.2fr 1fr 1fr";
    button_area.style.gridRow = "4 / 5";
    star_area.style.gridRow = "3 / 4"
    output_area.style.gridRow = "2 / 3";


    // Show the parent code inputbox & submit button
    // let parent_code = document.getElementById("parent-code");
    let parent_submit = document.getElementById("parent-submit");

    // parent_code.setAttribute("type","password");
    parent_submit.setAttribute("type","image");
    speakText();
}


function activityComplete(refresh) {

    let output_text = document.getElementById("output-text");
    let output_area = document.getElementById("output-area");
    let button_area = document.getElementById("button-area");
    let main_area = document.getElementById("main-container");
    let star_area = document.getElementById("star-area");

    output_text.innerHTML = "Congratulations! <br />You've earned a star!";
    addStarCount();
    addStarImage();

    // Switch the grid back. Maybe I should find a better way to do this?
    main_area.style.gridTemplateRows = "1fr 1fr 0.4fr 2fr 1fr";
    button_area.style.gridRow = "2 / 3";
    star_area.style.gridRow = "3 / 4";
    output_area.style.gridRow = "4 / 5";

    // Hide the Okay button
    let submitbtn = document.getElementById("parent-submit");
    submitbtn.setAttribute("type","hidden");

    // Show the Spin button again
    refresh.setAttribute("type","image");

    // Read the congrats message
    speakText();
}


// Keeping all our button listeners inside this function
function buttonListeners() {

    let reject_btn = document.getElementById("reject-button");
    let refresh_btn = document.getElementById("activity-button");
    let accept_btn = document.getElementById("accept-button");
    let codesubmit_btn = document.getElementById("parent-submit");
    let output_display = document.getElementById("output-area");

    output_display.addEventListener("click", function() {
        speakText();
    });

    reject_btn.addEventListener("click", function() {
        console.log("Clicking reject");
        rejectActivity(reject_btn, refresh_btn, accept_btn);
    });

    accept_btn.addEventListener("click", function() {
        console.log("Clicking accept");
        acceptActivity(reject_btn, accept_btn);
    });

    codesubmit_btn.addEventListener("click", function() {
        console.log("Clicking code submit");
        // let code = document.getElementById("parent-code").value;
        activityComplete(refresh_btn);
    });


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
            fetchActivity();
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
    
    // This will try to select the female UK voice.
    const voiceIndex = 0;
    const voiceURI = "Google UK English Female";

    const speak = async text => {
        if (!speechSynthesis) {
          return;
        }
        const message = new SpeechSynthesisUtterance(text);
        message.voice = await chooseVoice();
        speechSynthesis.speak(message);
    }

    const getVoices = () => {
        return new Promise(resolve => {
          let voices = speechSynthesis.getVoices();
          if (voices.length) {
            resolve(voices);
            return;
          }
          speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            resolve(voices);
          }
        });
      }

      const chooseVoice = async () => {
        const voices = (await getVoices()).filter(voice => voice.voiceURI == voiceURI);
      
        return new Promise(resolve => {
          resolve(voices[voiceIndex]);
        });
    }

    // This will stop the voice from repeating a million times if somebody mashes the button
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        speak(output);
    } else {
        speak(output);
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
