const bgLrg = document.getElementById("landingBgIMG");
setTimeout(() => {bgLrg.src = "../../images/bg_" + Math.floor(Math.random() * 3) + ".png";}, 50);
bgLrg.onload = () => {bgLrg.style.visibility = "visible"};

const navbar = document.getElementById("navbar");

function onScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle("scrolled", scrollY > 60);
}

window.addEventListener("scroll", onScroll, { passive: true });

let disableUnload = false;
window.addEventListener("beforeunload", (e) => {
    if (!disableUnload) {
        e.preventDefault();
        return "You may have unsaved changes, are you sure you want to leave the page?";
    }
});

const querystring = new URLSearchParams(window.location.search);
const eid = querystring.get("id");
if (eid == undefined) {
    disableUnload = true;
    window.location.replace("https://www.emberfallevents.com/applications/");
}

let userdata;
let eventdata;
let eventappdata;
let userappdata;

setTimeout(() => {
    postRequest("oauth/uid/", {
        uid: localStorage.getItem("userid"),
    }, (res) => {
        if (res.success) {
            userdata = res.userdata;

            postRequest("events/data/", {
                id : eid
            }, (res) => {
                if (res.success) {
                    eventdata = res.data;
                    const closed = eventdata.closetime < Date.now();
                    if (closed) {
                        disableUnload = true;
                        window.location.replace("https://www.emberfallevents.com/applications/");
                    }
                    document.getElementById("title").innerHTML = eventdata.name;
                    postRequest("events/appdata/", {
                        id : eid
                    }, (res) => {
                        if (res.success) {
                            eventappdata = res.data;
                            if (userdata.applications.event[eid]) {
                                postRequest("events/app/", {
                                    app: userdata.applications.event[eid]
                                }, (res) => {
                                    userappdata = res.data;
                                    setupPage();
                                    if (res.success) {
                                        loadUserData();
                                    }
                                    document.getElementById("questionContainer").style.visibility = "visible";
                                });
                            } else {
                                setupPage();
                                document.getElementById("questionContainer").style.visibility = "visible";
                            }
                        } else {
                            disableUnload = true;
                            window.location.replace("https://www.emberfallevents.com/applications/");
                        }
                    });
                } else {
                    disableUnload = true;
                    window.location.replace("https://www.emberfallevents.com/applications/");
                }
            });
        } else {
            disableUnload = true;
            window.location.replace("https://www.emberfallevents.com/applications/");
        }
    });
}, 100);

function loadUserData() {
    const ign = userappdata.ign;
    document.getElementById("ign").value = ign;
    for (let i = 0; i < eventappdata.length; i++) {
        const ans = userappdata.answers[i];
        document.getElementById("q" + i + "-content").value = ans;
    }
}

function setupPage() {
    console.log(eventappdata);
    for (let i = 0; i < eventappdata.length; i++) {
        const q = eventappdata[i];
        let str = 
        `<div class="apply-section">
            <h4 class="apply-title">` + q.title + `</h4>
            <p class="apply-desc">` + q.desc + `</p>`
        switch (q.type) {
            case "short":
                str +=
                `<input type="text" id="q` + i + `-content" class="input apply-short" placeholder="Short Answer..."></input>`;
                break;
            case "long":
                str +=
                `<textarea type="text" id="q` + i + `-content" class="input apply-long" placeholder="Long Answer..."></textarea>`;
                break;
            default:
                console.error("Unhandled question type! " + q.type);
                break;
        }
        document.getElementById("questionContainer").innerHTML += str + `</div>`;
    }
    document.getElementById("questionContainer").innerHTML += 
    `<div class="apply-section">
        <button class="btn-primary" onclick="submit();">Submit Application</button>
        <p class="apply-desc" style="color: var(--muted); font-size: 0.7rem; margin-top: 5px;">You are able to come back and edit your application after submitting it.</p>
    </div>`;
}

function submit() {
    const answers = [];
    for (let i = 0; i < eventappdata.length; i++) {
        answers[i] = document.getElementById("q" + i + "-content").value;
    }
    const ign = document.getElementById("ign").value;
    postRequest("events/submit/", {
        uid: localStorage.getItem("userid"),
        id: eid,
        answers: answers,
        ign: ign
    }, (res) => {
        if (res.success) {
            disableUnload = true;
            window.location.replace("https://www.emberfallevents.com/applications/");
        }
    });
}