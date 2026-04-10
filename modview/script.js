const params = new URLSearchParams();
params.append("r", "modview/");

if (!localStorage.getItem("key")) {
    window.location.replace("https://www.emberfallevents.com/modview/login/?" + params.toString());
} else {
    postRequest("modview/keystatus/", {
        key: localStorage.getItem("key"),
    }, (res) => {
        if (!res.success) {
            // window.location.replace("https://www.emberfallevents.com/modview/login/?" + params.toString());
        } else {
            downloadModviewJS();
        }
    });
}

function downloadModviewJS() {
    internalGetRequest("restricted/scripts/modview.html", {
        apikey: localStorage.getItem("key")
    }, (res) => {
        document.getElementById("bodyElem").innerHTML = res;

        internalGetRequest("restricted/scripts/modview.js?t=" + Date.now(), {
            apikey: localStorage.getItem("key")
        }, (res) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.textContent = res;

            document.head.appendChild(script);
        });
    });
}