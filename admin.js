async function fetchJSONData() {
    
    // Fetch the JSON file and save it into localStorage
    let url="activities.json";
    let response = await fetch(url);
    let activities = await response.json();

    if (sessionStorage.getItem("activitiesJSON") === null && localStorage.getItem("activitiesJSON") === null) {
        localStorage.setItem("activitiesJSON", JSON.stringify(activities));
    } else if (sessionStorage.getItem("activitiesJSON") === null && localStorage.getItem("activitiesJSON") !== null) {
        console.log("Data already loaded");
    } else {
        act = sessionStorage.getItem("activitiesJSON");
        localStorage.setItem("activitiesJSON", act);
    }
}


function main() {

    fetchJSONData();

    // Setup a test account for logins
    localStorage.setItem("email","admin@testing.com");
    localStorage.setItem("password","12345");

    // Setup the Login button
    let login_btn = document.getElementById("login-button");
    login_btn.addEventListener("click", function() {
        console.log("Login button clicked");
        let email = document.getElementById("user-email").value;
        let password = document.getElementById("user-password").value;

        if (email === "" || password === "") {
            alert("Please fill in both fields and try again");
        } else {
            loginUser(email,password);
        }
    });

    // Setup a click event to catch the ID of a clicked activity
    document.addEventListener("click",function(e) { 
        link = e.target.id;
        prefix = link.substring(0, 4);
        suffix = link.substring(4);

        if (prefix === "act-") {
            showSubActivities(suffix);
        }
    }, false); 
}


function loginUser(email, password) {
    // Check to see the locally stored secutiry credentials
    const app_email = localStorage.getItem("email");
    const app_password = localStorage.getItem("password");

    if (app_email === email) {

        if (app_password === password) {
            console.log(`Logged in as ${email}`);
            showMainActivities(email);
        } else {
            alert("Incorrect password, please try again.");
            document.getElementById("user-password").value = "";
        }

    } else {
        alert("This email is not a valid user");
        document.getElementById("user-email").value = "";
        document.getElementById("user-password").value = "";
    }
}


function showSubActivities(act) {
    let id = parseInt(act);

    let actJSON = localStorage.getItem("activitiesJSON");
    let activities = JSON.parse(actJSON);
    let email = localStorage.getItem("loggedin_email");
    let content_area = document.getElementById("content-pane2");

    let html = `<p>Logged in as <br />${email}</p><h3>Secondary Activities</h3>`;
    html += `<p><input type='text' id='new-subaction'> <button type='button' class='admin-button' id='submit-subaction'>Add</button></p>`;

    html += "<ul>";
    // This for loop is going in reverse to show the newest entries first
    for (let i = activities[id]["actions"].length-1; i >= 0; --i) {
        html += `<li style='font-size:18px;padding:7px;list-style-type:none;text-decoration:none' id='sub-${i}'>${activities[id]["actions"][i]["action"]}</li>`;
    }
    html += "</ul>"

    content_area.innerHTML = html;

    // Setup listener for the new Add button we just created
    let add_button = document.getElementById("submit-subaction");
    add_button.addEventListener("click", function() {
        console.log("Clicked the new add button");

        new_action = document.getElementById("new-subaction").value;
        console.log(new_action);
        activities[act]["actions"].push({"action":new_action});
        localStorage.setItem("activitiesJSON", JSON.stringify(activities));
        sessionStorage.setItem("activitiesJSON", JSON.stringify(activities));

        showSubActivities(act);
    });
}


function showMainActivities(email) {
    
    localStorage.setItem("loggedin_email",email);
    localStorage.setItem("loggedin_status", true);

    let content_area = document.getElementById("login-area");

    content_area.style.backgroundColor = "#ffffff";
    content_area.style.display = "grid";
    content_area.style.gridTemplateColumns = "1fr 1fr";

    let html = `<div id='content-pane1'><p>Select a primary activity<br /> to see all sub-activities</p><h3>Primary Activities</h3>`;

    // Get the JSON data and display all the primary activities
    let actJSON = localStorage.getItem("activitiesJSON");
    let activities = JSON.parse(actJSON);

    html += `<ul>`;
    for (let i = 0; i < activities.length; ++i) {
        html += `<li style='font-size:20px;padding:7px;list-style-type:none;text-decoration:underline' id='act-${i}'>${activities[i]["activity"]}</li>`;
    }
    html += `</div><div id='content-pane2'><p>Logged in as <br />${email}</p><h3>Secondary Activities</h3>`;

    html += `</div>`;
    content_area.innerHTML = html;
}


window.addEventListener("load", main);