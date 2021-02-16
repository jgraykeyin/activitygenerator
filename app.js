async function fetchJSONData() {
    
    let url="things_todo.json";
    let response = await fetch(url);
    let things = await response.json();

    console.log(things);

    // Create random number to select an item from the JSON data
    let num = Math.floor(Math.random() * things.length);
    console.log(things[num]["action"]);

    document.getElementById("text-area").innerHTML = `<p>${things[num]['action']}</p>`;


}


function main() {

    console.log("Hey!");

    refresh_btn = document.getElementById("refresh-btn");
    refresh_btn.addEventListener("click", function() {
        let timerId = setInterval(() => {
            fetchJSONData();
        }, 50);

        setTimeout(() => { clearInterval(timerId); console.log('stop'); }, 2000);
    });
}


window.addEventListener("load", main);
