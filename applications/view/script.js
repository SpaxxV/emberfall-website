const querystring = new URLSearchParams(window.location.search);
const aid = querystring.get("id");
if (aid == undefined) {
    disableUnload = true;
    window.location.replace("https://www.emberfallevents.com/applications/");
}

let userdata;
let eventappdata;
let userappdata;

setTimeout(() => {
    postRequest("events/app/", {
        app: aid
    }, (res) => {
        userappdata = res.data;
        if (res.success) {
            if (res.success) {
                postRequest("events/appdata/", {
                    id : userappdata.event
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
        document.getElementById(qid).innerText = ans;
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
                `<div type="text" id="q` + i + `-content" class="input apply-short"></div>`;
                break;
            case "long":
                str +=
                `<div type="text" id="q` + i + `-content" class="input apply-long" style="min-height: 100px; height: auto;"></div>`;
                break;
            default:
                console.error("Unhandled question type! " + q.type);
                break;
        }
        document.getElementById("questionContainer").innerHTML += str + `</div>`;
    }
}