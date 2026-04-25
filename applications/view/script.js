const querystring = new URLSearchParams(window.location.search);
const aid = querystring.get("id");
if (aid == undefined) {
    disableUnload = true;
    window.location.replace("https://www.emberfallevents.com/applications/");
}

let userdata;
let eventappdata;
let userappdata;
let key;
if (localStorage.getItem("key")) key = localStorage.getItem("key");

setTimeout(() => {
    postRequest("events/app/", {
        app: aid
    }, (res) => {
        userappdata = res.data;
        if (res.success) {
            if (res.success) {
                postRequest("events/appdata/", {
                    id : userappdata.event,
                    key : key
                }, (res) => {
                    if (res.success) {
                        eventappdata = res.data;
                        setupPage();
                        loadUserData();
                        document.getElementById("questionContainer").style.visibility = "visible";
                    } else {
                        window.location.replace("https://www.emberfallevents.com/applications/");
                    }
                });
            } else {
                window.location.replace("https://www.emberfallevents.com/applications/");
            }
        } else {
            window.location.replace("https://www.emberfallevents.com/applications/");
        }
    });
}, 100);

function loadUserData() {
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
            document.getElementById(qid).innerText = ans;
        }
    }
}

function setupPage() {
    console.log(eventappdata);
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
                `<div id="q` + i + `-content" class="input apply-short"></div>`;
                break;
            case "long":
                str +=
                `<div id="q` + i + `-content" class="input apply-long" style="min-height: 100px; height: auto;"></div>`;
                break;
            case "yesno":
                str +=
                    `<input type="radio" id="q` + i + `-content-yes" name="q` + i + `" class="radio-button" value="yes" disabled></input>
                    <label for="q` + i + `-content-yes" class="radio-label">Yes</label><br>
                    <input type="radio" id="q` + i + `-content-no" name="q` + i + `" class="radio-button" value="no" disabled></input>
                    <label for="q` + i + `-content-no" class="radio-label">No</label>`;
                break;
            case "multi":
                for (let n = 0; n < qdat.length; n++) {
                    str +=
                        `<input type="radio" id="q` + i + `-content-` + n + `" name="q` + i + `" class="radio-button" value="` + n + `" disabled></input>
                        <label for="q` + i + `-content-` + n + `" class="radio-label">` + qdat[n] + `</label>`;
                    if (n + 1 != qdat.length) str += `<br>`;
                }
                break;
            case "range":
                str +=
                `<div id="q` + i + `-content" class="input apply-range"></div>`;
                break;
            default:
                console.error("Unhandled question type! " + q.type);
                break;
        }
        document.getElementById("questionContainer").innerHTML += str + `</div>`;
    }
}