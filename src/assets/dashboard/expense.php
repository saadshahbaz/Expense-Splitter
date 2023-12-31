<?php
session_start();
// Creating connection
$servername = 'localhost'; // Change accordingly
$username = 'root'; // Change accordingly
$password = ''; // Change accordingly
$db = 'expensesplitter'; // Change accordingly

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Getting data from the form
$description = $_POST['description'];
$amount = $_POST['amount'];
$actualAmount = $_POST['actualAmount']; // Add this line to get the actual amount
$paid_by_temp = $_POST['paid_by'];
$paid_to_temp = $_POST['paid_to'];

$account_holder_email = $_SESSION['email'];

// Determine the actual values for $paid_by and $paid_to
if ($paid_by_temp == 'accountHolder') {
    $paid_by = $account_holder_email;
    $paid_to = $paid_to_temp;
} else {
    $paid_by = $paid_by_temp;
    $paid_to = $account_holder_email;
}

// Checking if all fields entered
if (
    empty($description) ||
    empty($amount) ||
    empty($actualAmount) ||
    empty($paid_by) ||
    empty($paid_to)
) {
    echo '<text style="color: #FF0000;">Please fill in all fields.</text>';
    return;
}

// Prepare and bind the SQL statements for both users
$stmt_payer = $conn->prepare(
    'INSERT INTO Transaction (paidBy, paidTo, description, price, totalAmount) VALUES (?, ?, ?, ?, ?)'
);
$stmt_payer->bind_param(
    'sssdd',
    $paid_by,
    $paid_to,
    $description,
    $amount,
    $actualAmount
);

// Execute the statements
if ($stmt_payer->execute()) {
    echo '<text style="color: #00FF00;">Transaction added successfully.</text>';
} else {
    echo '<text style="color: #FF0000;">Error adding transaction: ' .
        $stmt_payer->error .
        '</text>';
}

// Close the statements and connection
$stmt_payer->close();
$conn->close();
?>
