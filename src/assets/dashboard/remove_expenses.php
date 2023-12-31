<?php
session_start();

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

$transactionID = $_POST['transactionID'];

if (empty($transactionID)) {
    echo '<p class="text-danger"> Please fill out all fields! </p>';
    $conn->close();
    die();
}

// Use prepared statement to prevent SQL injection
$sql = $conn->prepare('DELETE FROM Transaction WHERE transactionID = ?');
$sql->bind_param('i', $transactionID);
$result = $sql->execute();

if ($result) {
    echo '<p class="text-success">Transaction was successfully removed!</p>';
} else {
    echo '<p class="text-danger">Error: Transaction was not removed...</p>';
}

$conn->close();
?>
