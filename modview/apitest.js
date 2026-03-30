async function submitRequest() {
    const url = document.getElementById("url").value;
    document.getElementById("resultCode").innerHTML = "";
    document.getElementById("resultData").innerHTML = "";
    try {
        const response = await fetch(url, {
            method : "POST",
            body : document.getElementById("body").value,
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(response);
        document.getElementById("resultCode").innerHTML = response.status + " " + response.statusText + " " + response.ok;
        const json = await response.text();
        document.getElementById("resultData").innerHTML = "Recieved: " + json;
    } catch (error) {
        document.getElementById("resultData").innerHTML = "Error: " + error;
    }
}