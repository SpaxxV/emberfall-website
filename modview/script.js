let access;
if (!localStorage.getItem("key")) {
    if (doRedirects) window.location.replace("https://www.emberfallevents.com/modview/login/");
} else {
    access = localStorage.getItem("key");
}