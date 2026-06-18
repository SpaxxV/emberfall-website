const bgLrg = document.getElementById("landingBgIMG");
setTimeout(() => {bgLrg.src = "../../images/bg_" + Math.floor(Math.random() * 5) + ".png";}, 50);
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

let canCache = false;

const querystring = new URLSearchParams(window.location.search);
const eid = querystring.get("id");
if (eid == undefined) {
    disableUnload = true;
    window.location.replace("https://www.emberfallevents.com/applications/");
}

const localuserappdata = localStorage.getItem("app" + eid);
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
                                    if (res.success || localuserappdata) {
                                        loadUserData();
                                    }
                                    document.getElementById("questionContainer").style.visibility = "visible";
                                    canCache = true;
                                });
                            } else {
                                setupPage();
                                
                                if (localuserappdata) {
                                    loadUserData();
                                }
                                document.getElementById("questionContainer").style.visibility = "visible";
                                canCache = true;
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
    if (localuserappdata) {
        let luad = JSON.parse(localuserappdata);
        if (userappdata) {
            if (luad.lastEdited > userappdata.lastEdited) userappdata = luad;
        } else {
            userappdata = luad;
        }
    }
    const ign = userappdata.ign;
    document.getElementById("ign").value = ign;
    for (let i = 0; i < eventappdata.length; i++) {
        const ans = userappdata.answers[i];
        const q = eventappdata[i];
        const qid = "q" + i + "-content";
        if (q.type == "yesno" || q.type == "multi") {
            const elem = document.getElementById(qid + "-" + ans);
            if (elem != undefined) document.getElementById(qid + "-" + ans).checked = true;
        } else {
            document.getElementById(qid).value = ans;
        }
    }
}

function validateRange(id, min, max) {
    if (document.getElementById(id).value == "") return;
    let value = parseInt(document.getElementById(id).value);
    if (value == NaN) {
        value = min;
    }
    value = Math.max(min, Math.min(max, value));
    document.getElementById(id).value = value;
}

function setupPage() {
    for (let i = 0; i < eventappdata.length; i++) {
        const q = eventappdata[i];
        let qdat = [];
        if (q.data) qdat = q.data.split("\n");
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
            case "yesno":
                str +=
                    `<input type="radio" id="q` + i + `-content-yes" name="q` + i + `" class="radio-button" value="yes"></input>
                    <label for="q` + i + `-content-yes" class="radio-label">Yes</label><br>
                    <input type="radio" id="q` + i + `-content-no" name="q` + i + `" class="radio-button" value="no"></input>
                    <label for="q` + i + `-content-no" class="radio-label">No</label>`;
                break;
            case "multi":
                for (let n = 0; n < qdat.length; n++) {
                    str +=
                        `<input type="radio" id="q` + i + `-content-` + n + `" name="q` + i + `" class="radio-button" value="` + n + `"></input>
                        <label for="q` + i + `-content-` + n + `" class="radio-label">` + qdat[n] + `</label>`;
                    if (n + 1 != qdat.length) str += `<br>`;
                }
                break;
            case "range":
                if (qdat.length < 2) break;
                    str +=
                    `<input type="number" id="q` + i + `-content" class="input apply-range" min="` + qdat[0] + `" max="` + qdat[1] + `" placeholder="Number ` + qdat[0] + `-` + qdat[1] + `" onchange="validateRange('q` + i + `-content', ` + qdat[0] + `, ` + qdat[1] + `);"></input>`;
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
        <button class="btn-ghost" onclick="savedraft();">Save Draft</button>
        <p class="apply-desc" style="color: var(--muted); font-size: 0.7rem; margin-top: 5px;">You are able to come back and edit your application after submitting it.</p>
        <p class="apply-desc" style="color: red; font-size: 0.7rem; position: relative; top: -10px;" id="applyError"></p>
    </div>`;
}

function submit() {
    const answers = [];
    for (let i = 0; i < eventappdata.length; i++) {
        const q = eventappdata[i];
        if (q.type == "yesno" || q.type == "multi") {
            const rad = document.querySelector("input[name=q" + i + "]:checked");
            answers[i] = ((rad == undefined) ? "" : rad.value);
        } else {
            answers[i] = document.getElementById("q" + i + "-content").value;
        }
    }
    const ign = document.getElementById("ign").value;
    const unanswered = [];
    if (ign == "") {
        unanswered.push("ign");
    }
    for (let i = 0; i < answers.length; i++) {
        if (answers[i] == "") {
            unanswered.push(i);
        }
    }
    if (unanswered.length == 0) {
        postRequest("events/submit/", {
            uid: localStorage.getItem("userid"),
            id: eid,
            answers: answers,
            ign: ign
        }, (res) => {
            if (res.success) {
                disableUnload = true;
                window.location.assign("https://www.emberfallevents.com/applications/");
            }
        });
    } else {
        for (let i = 0; i < unanswered.length; i++) {
            if (unanswered[i] == "ign") {
                unanswered[i] = "What is your Minecraft username?";
            } else {
                unanswered[i] = eventappdata[unanswered[i]].title;
            }
        }
        document.getElementById("applyError").innerHTML = "Please answer the following unanswered questions:<br>" + unanswered.join("<br>");
    }
}

function autosave() {
    const answers = [];
    for (let i = 0; i < eventappdata.length; i++) {
        const q = eventappdata[i];
        if (q.type == "yesno" || q.type == "multi") {
            const rad = document.querySelector("input[name=q" + i + "]:checked");
            answers[i] = ((rad == undefined) ? "" : rad.value);
        } else {
            answers[i] = document.getElementById("q" + i + "-content").value;
        }
    }
    const ign = document.getElementById("ign").value;
    const time = Date.now();
    localStorage.setItem("app" + eid, JSON.stringify({
        ign: ign,
        answers: answers,
        lastEdited: time
    }))
}

function savedraft() {
    autosave();
    disableUnload = true;
    window.location.assign("https://www.emberfallevents.com/applications/");
}

setInterval(() => {
    if (canCache) {
        autosave();
    }
}, 5000);