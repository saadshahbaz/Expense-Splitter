let global_friend = "NA";
let button_one = true;
let button_two = true;
let button_three = true;
let button_four = true;
let transaction_id = 0;

function getAllFriends() {
    console.log("entered!!");
    try {
        const req = new XMLHttpRequest();
        req.open("GET", `./dashboard.php?action=getFriends`, true);
        req.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                populateTable(req, 'friend');
            }
        }
        req.send(null);
    }catch (exception)
    {
        alert ("Request failed. Please try again.");
    }
}

function getExpenses() 
{
    //document.getElementById('removeFilter').hidden = true;
    try {
        const req = new XMLHttpRequest();
        req.open("GET", './getExpenses.php', true);
        req.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                populateTable(req, 'expense-table');
            }
        }
        req.send(null);
    }catch (exception)
    {
        alert ("Request failed. Please try again.");
    }
}

function populateTable(request, tableName)
{
    let table = document.getElementById(tableName);
    table.innerHTML = request.responseText;
}


function getFriends() {
    try {
        const req = new XMLHttpRequest();
        req.open("GET", './populateFriends.php', true);
        req.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                populateTable(req, 'user-friends');
            }
        }
        req.send(null);
    }catch (exception)
    {
        alert ("Request failed. Please try again.");
    }
}

function checkUser() {
    getFriends();
}

function saveExpense() {
    const formData = new FormData(document.getElementById("add-expense-form"));
    let email = formData.get('inst-email');
    let description = formData.get('inst-description');
    let amount = formData.get('inst-amount');
}

function editFriendList(action) {
    let email;
    var courseform;
    if (action == 'add') {
        courseform = document.getElementById("add-friend-form");
        const formData = new FormData(courseform);
        email = formData.get('friend-email');
    } else {
        courseform = document.getElementById("remove-friend-form");
        const formData = new FormData(courseform);
        email = formData.get('friend-email');
    }
    
    console.log(action);
    console.log(email);

    try {
        const syncRequest = new XMLHttpRequest();
        syncRequest.open("POST", "friends.php", false);
        syncRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        syncRequest.send(`email=${email}&action=${action}`);

        if (syncRequest.status === 200) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(syncRequest.responseText, "text/xml");
            courseform.reset();
            getFriends();
            getAllFriends();

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
function showPaidEquallyForm() {
    const friend_temp = document.getElementById('friend');
    const selectFriend = friend_temp.options[friend_temp.selectedIndex].value;
    global_friend = selectFriend;
    console.log(selectFriend);

    // Listen for changes in the price input field
    const priceInput = document.getElementsByName("inst-amount")[0];
    priceInput.addEventListener("input", updatePrices);

    function updatePrices() {
        const priceAdded = priceInput.value;

        try {
            const req = new XMLHttpRequest();
            req.open("GET", `./dashboard.php?action=getPersonName&email=${selectFriend}`, true);
            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE) {
                    if (req.status === 200) {
                        try {
                            const response = JSON.parse(req.responseText);
                            const firstName2 = response[0];
                            const firstName1 = response[1];

                            const halfPrice = (parseFloat(priceAdded) / 2).toFixed(2);

                            console.log("First Name 1: " + firstName1);
                            console.log("First Name 2: " + firstName2);

                            document.getElementById("button1").innerHTML = `${firstName1} paid, split equally<br><span style="color: green;">${firstName2} owes you : $${halfPrice}</span>`;
                            document.getElementById("button2").innerHTML = `${firstName1} is owed the full amount<br><span style="color: green;">${firstName2} owes you : $${priceAdded}</span>`;
                            document.getElementById("button3").innerHTML = `${firstName2} paid, split equally<br><span style="color: red;">${firstName1} owes you : $${halfPrice}</span>`;
                            document.getElementById("button4").innerHTML = `${firstName2} is owed the full amount<br><span style="color: red;">${firstName1} owes you : $${priceAdded}</span>`;
                        } catch (error) {
                            console.error("Error parsing JSON: " + error);
                        }
                    } else {
                        console.error("Request failed with status: " + req.status);
                    }
                }
            };

            req.onerror = function () {
                alert("Request failed. Please try again.");
            };

            req.send();
        } catch (exception) {
            alert("Request failed. Please try again.");
        }

        console.log("came here!!");
        document.getElementById("paid-equally-button").style.display = "none";
        document.getElementById("paid-equally-form").style.display = "block";
        showAllButtons();
    }

    // Call updatePrices initially to set up the initial values
    updatePrices();

    document.getElementById("button1").onclick = function () {
        if (button_one) {
            hideAllButtonsExcept("button1");
            button_one = false;
        } else {
            showAllButtons();
        }
    };

    document.getElementById("button2").onclick = function () {
        if (button_two) {
            hideAllButtonsExcept("button2");
            button_two = false;
        } else {
            showAllButtons();
        }
    };

    document.getElementById("button3").onclick = function () {
        if (button_three) {
            hideAllButtonsExcept("button3");
            button_three = false;
        } else {
            showAllButtons();
        }
    };

    document.getElementById("button4").onclick = function () {
        if (button_four) {
            hideAllButtonsExcept("button4");
            button_four = false;
        } else {
            showAllButtons();
        }
    };
}

function hideAllButtonsExcept(selectedButtonId) {
    const buttonIds = ["button1", "button2", "button3", "button4"];

    buttonIds.forEach(function (buttonId) {
        const button = document.getElementById(buttonId);
        if (buttonId === selectedButtonId) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });
}

function showAllButtons() {
    const buttonIds = ["button1", "button2", "button3", "button4"];
    button_one = true;
    button_two = true;
    button_three = true;
    button_four = true;

    buttonIds.forEach(function (buttonId) {
        const button = document.getElementById(buttonId);
        button.style.display = "block";
    });
}

function addExpense() {

    console.log("add expense");
    // loigc to add expense
    // so the button that was selected (was in block) is the one that is selected

    // button one (user 1 paid, split equally)
    // button two (user 1 paid, user 2 owes full amount)
    // button three (user 2 paid, split equally)
    // button four (user 2 paid, user 1 owes full amount)

    // get the button that is selected
    let selectedButtonId = "paid-equally-button";
    const buttonIds = ["button1", "button2", "button3", "button4"];
    buttonIds.forEach(function (buttonId) {
        const button = document.getElementById(buttonId);
        if (button.style.display === "block") {
            selectedButtonId = buttonId;
        }
    });

    // get the amount
    const priceInput = document.getElementsByName("inst-amount")[0];
    const priceAdded = priceInput.value;
    const halfPrice = (parseFloat(priceAdded) / 2).toFixed(2);

    // get the friend
    const friend_temp = document.getElementById('friend');
    const selectFriend = friend_temp.options[friend_temp.selectedIndex].value;

    // get the description
    const descriptionInput = document.getElementsByName("inst-description")[0];
    let inputValue = descriptionInput.value;

// Capitalize the first letter
    let capitalizedValue = inputValue.toLowerCase().replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });

    // Update the input value with the capitalized version
    descriptionInput.value = capitalizedValue;

    // generate transaction id"
    transaction_id += 1;

    // if statement to check which button was selected
    if (selectedButtonId === "button1") {
        // user 1 paid, split equally
        // add transaction to database
        addTransactionToDatabase(priceAdded, descriptionInput.value, halfPrice, "accountHolder", selectFriend);
    } else if (selectedButtonId === "button2") {
        // user 1 paid, user 2 owes full amount
        // add transaction to database
        addTransactionToDatabase( priceAdded, descriptionInput.value, priceAdded, "accountHolder", selectFriend);
    } else if (selectedButtonId === "button3") {
        // user 2 paid, split equally
        // add transaction to database
        addTransactionToDatabase(priceAdded, descriptionInput.value, halfPrice, selectFriend, "accountHolder");
    } else if (selectedButtonId === "button4") {
        // user 2 paid, user 1 owes full amount
        // add transaction to database
        addTransactionToDatabase(priceAdded, descriptionInput.value, priceAdded, selectFriend, "accountHolder");
    } if (selectedButtonId === "paid-equally-button") {
        // user 1 paid, split equally
        // add transaction to database
        addTransactionToDatabase(priceAdded, descriptionInput.value, halfPrice, "accountHolder", selectFriend);
    }

}

function addTransactionToDatabase(actualAmount, description, amount, paid_by, paid_to) {
    try {
        const syncRequest = new XMLHttpRequest();
        syncRequest.open("POST", "./expense.php", false);
        syncRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        syncRequest.send(`sender=expense&&description=${description}&amount=${amount}&paid_by=${paid_by}&paid_to=${paid_to}&actualAmount=${actualAmount}`);
    if (syncRequest.status === 200) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(syncRequest.responseText, "text/xml");
        let error_msgs = xmlDoc.getElementsByClassName("error");
        
        // check if we received an error while trying to register
        if (error_msgs.length > 0) {
            let error_div = document.getElementById("error-msg-cont");
            // append all error messages
            for (msg of error_msgs) {
                error_div.appendChild(msg);
            }
        }
        var taform = document.getElementById("add-expense-form");
        taform.reset();
        resetButtons();
        getExpenses();
        updateTotalOwed();

        }
    } catch (exception) {
        alert("Request failed. Please try again.");
    }
}

function updateTotalOwed() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'calculate_total.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const totalOwed = response.totalOwed;
                const isOwed = response.isOwed;

                const totalOwedElement = document.getElementById('totalOwed');
                totalOwedElement.innerText = `$${Math.abs(totalOwed).toFixed(2)}`;

                // Determine whether the user owes or is owed
                const oweText = isOwed ? 'You are owed' : 'You owe';

                // Apply styling and text based on whether the user owes or is owed
                totalOwedElement.style.color = isOwed ? 'green' : 'red';

                // Update the oweText span
                const oweTextElement = document.getElementById('oweText');
                oweTextElement.innerText = `${oweText}: `;
            } else {
                console.error('Error fetching total owed: ' + xhr.status);
            }
        }
    };
    xhr.send();
}


function removeExpense(transaction_id) {

    try {
        const syncRequest = new XMLHttpRequest();
        syncRequest.open("POST", "./remove_expenses.php", false);
        syncRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        syncRequest.send(`sender=ta_admin&transactionID=${transaction_id}`)
    if (syncRequest.status === 200) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(syncRequest.responseText, "text/xml");
        let error_msgs = xmlDoc.getElementsByClassName("error");
        
        // check if we received an error while trying to register
        if (error_msgs.length > 0) {
            let error_div = document.getElementById("error-msg-cont");
            // append all error messages
            for (msg of error_msgs) {
                error_div.appendChild(msg);
            }
        }
        getExpenses();
        updateTotalOwed();
        populateTable(syncRequest, 'output_add');
        const delay = ms => new Promise(res => setTimeout(res, ms));
        delay(5000).then(() => {
            let val = "";
            let table = document.getElementById('output_add');
            table.innerHTML = val;
        });
    }
} catch (exception) {
    alert("Request failed. Please try again.");
    
}
}




function buttonInformationRemove(id)
{
    console.log(id);
    let x = document.getElementById("myTable").rows[parseInt(id)]
    let description = x.cells[0].innerHTML;
    let paid_by = x.cells[1].innerHTML;
    let paid_to = x.cells[2].innerHTML;
    let amount = x.cells[3].innerHTML;
    let transaction_id = x.cells[6].innerHTML.trim();
    
    console.log("this is the transaction id: " + transaction_id);

    let y = confirm("Are you sure you want to remove \nDescription: " + description + " \nPaid By: " + paid_by + " \nPaid To: " + paid_to +"\nAmount: " + amount);

    if (y == true) {
        removeExpense(transaction_id);
    }else{
        return;
    }
}


function resetButtons() {
    const buttonIds = ["button1", "button2", "button3", "button4"];
    buttonIds.forEach(function (buttonId) {
        const button = document.getElementById(buttonId);
        button.style.display = "none";
    });
    document.getElementById("paid-equally-button").style.display = "block";
}

// Call this function to update the total owed when needed


