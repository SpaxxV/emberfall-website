const bgLrg = document.getElementById("landingBgIMG");
setTimeout(() => {bgLrg.src = "../images/bg_" + Math.floor(Math.random() * 3) + ".png";}, 50);
bgLrg.onload = () => {bgLrg.style.visibility = "visible"};

const navbar = document.getElementById("navbar");

function onScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle("scrolled", scrollY > 60);
}

window.addEventListener("scroll", onScroll, { passive: true });

const querystring = new URLSearchParams(window.location.search);
const code = querystring.get("code");
const state = querystring.get("state");

let userVerified = false;
let userData = {};

function applyForEvent(eid) {
    if (userVerified) {
        window.location.replace("https://www.emberfallevents.com/applications/apply/?id=" + eid);
    } else {
        window.location.replace("https://discord.com/oauth2/authorize?client_id=1493641488431710238&response_type=code&redirect_uri=https%3A%2F%2Femberfallevents.com%2Fapplications%2F&scope=identify+guilds.members.read&state=" + eid);
    }
}

function updatePageLogin() {
    if (userVerified) {
        document.getElementById("login").innerHTML = "Apply for an event!";
        document.getElementById("login").href = "#events";
        document.getElementById("login").target = "";
        if (state != undefined) {
            applyForEvent(state);
        }
    }
    setTimeout(() => {
        loadEvents();
    }, 100);
}

function oauthdo() {
    if (code != undefined) {
        postRequest("oauth/code/", {
            code: code,
        }, (res) => {
            if (res.success) {
                localStorage.setItem("userid", res.userid);
                userData = res.userdata;
                userVerified = true;
            }
            updatePageLogin();
        });
    } else {
        updatePageLogin();
    }
}

if (localStorage.getItem("userid")) {
    postRequest("oauth/uid/", {
        uid: localStorage.getItem("userid"),
    }, (res) => {
        if (res.success) {
            localStorage.setItem("userid", res.userid);
            userData = res.userdata;
            userVerified = true;
            updatePageLogin();
        } else {
            oauthdo();
        }
    });
} else {
    oauthdo();
}

const eloaddata = [];
function showEvent(id) {
    eloaddata[id]++;
    if (eloaddata[id] == 2) {
        document.getElementById("loade" + id).style.display = "none";
        document.getElementById("contente" + id).style.display = "block";
    }
}

function viewEvent(id) {
    window.location.replace("https://www.emberfallevents.com/applications/view/?id=" + userData.applications.event[id]);
}

async function loadEvents() {
    postRequest("events/list/", {}, async (res) => {
        if (res.success) {
            const events = res.data;
            let str = ``;
            for (let i = 0; i < events.length; i++) {
                let eid = events[i];
                await postRequest("events/data/", {
                    id : eid
                }, (res) => {
                    if (res.success) {
                        const closed = res.data.closetime < Date.now();
                        const applied = userData.applications != undefined && userData.applications.event[eid] != undefined;
                        if (!res.data.total) res.data.total = 0;
                        eloaddata[i] = 0;
                        document.getElementById("eventlist").innerHTML  += `<div class="listinga">
                            <img src="../images/loading.gif" style="position: relative; width: 300px; height: 400px; top: -50px; left: 50px;" id="loade` + i + `">
                            <div style="position: absolute; display: none;" id="contente` + i + `">
                                <div class="listing-bg"> 
                                    <img src="` + res.data.background43 + `" style="width: 100%; height: 100%; visibility: ` + ((res.data.background43 == "") ? "hidden" : "visible") + `;" onload="showEvent(` + i + `);" onerror="showEvent(` + i + `);"/>
                                </div>
                                <div class="listing-overlay"></div>
                                <div class="listing-icon">
                                    <img src="` + res.data.logo + `" alt="" style="width: 40px; height: 32px; margin-top: 5px; visibility: ` + ((res.data.background43 == "") ? "hidden" : "visible") + `;" onload="showEvent(` + i + `);" onerror="showEvent(` + i + `);"/>
                                </div>
                                <h4 class="listing-title">` + res.data.name + `</h4>
                                <p class="listing-stats">` + new Date(res.data.closetime).toLocaleString() + ` | ` + res.data.total + ` Application` + ((res.data.total != 1) ? "s" : "") + `</p>
                                <p class="listing-description">` + res.data.description + `</p>
                                <button class="`+ ((closed) ? "btn-ghost" : "btn-primary") + ` listing-button" ` + ((closed) ? ((applied) ? "onclick=\"viewEvent('" + eid + "')\"" : "disabled") : "onclick=\"applyForEvent('" + eid + "')\"") + `>
                                    ` + ((applied) ? ((closed) ? "View Application" : "Edit Application") : ((closed) ? "Applications Closed" : "Apply Now!")) + `
                                </button>
                            </div>
                        </div>`;
                    }
                });
                document.getElementById("eventlist").style.visibility = "visible";
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    });
}