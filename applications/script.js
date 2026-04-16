const bgLrg = document.getElementById("landingBgIMG");
bgLrg.src = "../images/bg_" + Math.floor(Math.random() * 3) + ".png";
bgLrg.onload = () => {bgLrg.hidden = false};

const navbar = document.getElementById("navbar");

function onScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle("scrolled", scrollY > 60);
}

window.addEventListener("scroll", onScroll, { passive: true });

const querystring = new URLSearchParams(window.location.search);
const code = querystring.get("code");

let userVerified = false;
let userData = {};

if (localStorage.getItem("userid")) {
    postRequest("oauth/uid/", {
        uid: localStorage.getItem("userid"),
    }, (res) => {
        if (res.success) {
            localStorage.setItem("userid", res.userid);
            userData = res.userdata;
            userVerified = true;
        }
    });
}

if (userVerified == false && code != undefined) {
    postRequest("oauth/code/", {
        code: code,
    }, (res) => {
        if (res.success) {
            localStorage.setItem("userid", res.userid);
            userData = res.userdata;
            userVerified = true;
        }
    });
}

if (userVerified) {
    console.log(userData);
    console.log(localStorage.getItem("userid"));
}