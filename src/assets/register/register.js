function convertToTitleCase(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}

function sendRegisterRequest(){

    const formData = new FormData(document.getElementById('login-form'));
    

    // console.log(formData.getAll('type[]'));
    let email = formData.get('email');
    let password = formData.get('password');
    let fname = convertToTitleCase(formData.get('fname'));
    let lname = convertToTitleCase(formData.get('lname'));

    console.log(email, password, fname, lname);
    

    try {
        const syncRequest = new XMLHttpRequest();
        syncRequest.open("POST", "register.php", false);
        syncRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        syncRequest.send(`email=${email}&password=${password}&fname=${fname}&lname=${lname}`);

        if (syncRequest.status === 200) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(syncRequest.responseText, "text/xml");
            var courseform = document.getElementById("login-form");
            courseform.reset();


            // login success
            // if (scripts.length > 0) {
            //     document.body.innerHTML = syncRequest.responseText;
            //     let scripts = document.body.getElementsByTagName("script");
            //     eval(scripts[0].text); // execute the declaration code for our returned 
            //     // functions so that the browser knows they exist
            // }
            // // login fail
            // else {
            //     let errorDiv = document.getElementById("login-error");
            //     errorDiv.innerHTML = syncRequest.responseText;
            // }
        }
    }
    catch (exception) {
        alert("Request failed. Please try again.");
    }

}