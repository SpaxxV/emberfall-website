const username = document.getElementById("username");
const password = document.getElementById("password");
const params = new URLSearchParams(window.location.search);
let redirect = params.get("r");
if (redirect == undefined) {
    redirect = "modview/"
}

function login() {
    document.getElementById("error").innerHTML = "";
    postRequest("modview/login/", {
        username: username.value,
        password: password.value
    }, (res) => {
        if (res.success) {
            localStorage.setItem("key", res.key);
            window.location.replace("https://www.emberfallevents.com/" + redirect);
        } else {
            document.getElementById("error").innerHTML = res.message;
        }
    });
}

if (localStorage.getItem("key")) {
    postRequest("modview/keystatus/", {
        key: localStorage.getItem("key"),
    }, (res) => {
        if (res.success) {
            window.location.replace("https://www.emberfallevents.com/" + redirect);
        }
    });
}