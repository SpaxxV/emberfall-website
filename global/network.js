const serverAddress = "https://api.emberfallevents.com/";
async function externalGetRequest(url, callback) {
    const response = await fetch(url, {
        method : "GET"
    });
    callback(JSON.parse(await response.text()));
}
async function postRequest(endpoint, body, callback) {
    const response = await fetch(serverAddress + endpoint, {
        method : "POST",
        body : JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    });
    callback(JSON.parse(await response.text()));
}
async function internalGetRequest(endpoint, headers, callback) {
    const response = await fetch(serverAddress + endpoint, {
        method : "GET",
        headers: headers
    });
    callback(await response.text());
}