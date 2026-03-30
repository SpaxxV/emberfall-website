const doRedirects = true;
const serverAddress = "https://api.emberfallevents.com/";
const loadLocalStorageFromURL = false;
async function externalGetRequest(url, callback) {
    const response = await fetch(url, {
        method : "GET"
    });
    callback(await response.text());
}
async function postRequest(endpoint, body, callback) {
    const response = await fetch(serverAddress + endpoint, {
        method : "POST",
        body : body,
        headers: {
            "Content-Type": "application/json",
        }
    });
    callback(await response.text());
}