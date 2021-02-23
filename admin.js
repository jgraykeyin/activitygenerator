async function fetchJSONData() {
    
    // Fetch the JSON file and save it into localStorage
    let url="activities.json";
    let response = await fetch(url);
    let activities = await response.json();

    localStorage.setItem("activitiesJSON", JSON.stringify(activities));
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
        console.log(suffix);

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
    console.log(`Showing subs for ${act}`);
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
        html += `<li style='font-size:20px;padding:7px;list-style-type:none;text-decoration:underline' id='act-${activities[i]["activity"]}'>${activities[i]["activity"]}</li>`;
    }
    html += `</div><div id='content-pane2'><p>Logged in as <br />${email}</p><h3>Secondary Activities</h3>`;

    html += `</div>`;
    content_area.innerHTML = html;
}

window.addEventListener("load", main);