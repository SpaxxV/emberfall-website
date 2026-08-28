const otc = document.getElementById("otc");
const username = document.getElementById("username");
const password = document.getElementById("password");
const params = new URLSearchParams(window.location.search);
const code = params.get("otc");
if (code != undefined) {
    otc.value = code;
}

function cma() {
    document.getElementById("error").innerHTML = "";
    if (username.value.length < 3) {
        document.getElementById("error").innerHTML = "Please make your username atleast 3 characters.";
        return;
    }
    if (password.value.length < 8) {
        document.getElementById("error").innerHTML = "Please make your password atleast 8 characters.";
        return;
    }
    postRequest("modview/v2/loginscreate/", {
        otc: otc.value,
        username: username.value,
        password: password.value
    }, (res) => {
        if (res.success) {
            window.location.replace("https://www.emberfallevents.com/modview/login/");
        } else {
            document.getElementById("error").innerHTML = res.message;
        }
    });
}