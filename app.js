async function fetchJSONData() {
    
    let url="things_todo.json";
    let response = await fetch(url);
    let things = await response.json();

    console.log(things);

    // Create random number to select an item from the JSON data
    let num = Math.floor(Math.random() * things.length);
    console.log(things[num]["action"]);

    document.getElementById("output-text").innerHTML = `<p>${things[num]['action']}</p>`;
}

function main() {

    console.log("Hey!");

    // Setup sound effect files
    let snd_spin = new sound("audio/spin1.m4a");
    let snd_done = new sound("audio/done1.m4a");

    refresh_btn = document.getElementById("activity-button");
    refresh_btn.addEventListener("click", function() {
        
        snd_spin.play();
        let timerId = setInterval(() => {
            fetchJSONData();
        }, 57);

        setTimeout(() => { clearInterval(timerId); snd_done.play(); }, 2000);
        
    });
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
