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
$email = $_POST['email'];
$user_email = $_SESSION['email'];
$action = $_POST['action'];

echo 'Email: ' . $email . '<br>';

// Checking if all fields entered
if (empty($email) || empty($action)) {
    echo '<text style="color: #FF0000;">Please fill in all fields.</text>';
    return;
}

// Check if email already exists
$sql = $conn->prepare('SELECT * FROM User WHERE email = ?');
$sql->bind_param('s', $email);
$sql->execute();
$result = $sql->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo '<text style="color: #FF0000;"> ' .
        $email .
        ' is not on the app. Please invite your friend to Splitting Expense :).</text>';
    die();
}

// Add or remove friend based on the action
if ($action == 'add') {
    // Add to friends table
    $sql = $conn->prepare('INSERT INTO friends (email1, email2) VALUES (?, ?)');
    $sql->bind_param('ss', $email, $user_email);
    $sql->execute();
    $sql->close();

    $sql = $conn->prepare('INSERT INTO friends (email2, email1) VALUES (?, ?)');
    $sql->bind_param('ss', $email, $user_email);
    $sql->execute();
    $sql->close();

    if ($sql) {
        echo '<p class="text-success" >Friend Added successfully!</p>';
    } else {
        echo '<p class="text-danger" >Already Exists...</p>';
    }
} elseif ($action == 'remove') {
    // Remove from friends table
    $sql = $conn->prepare(
        'DELETE FROM friends WHERE email1 = ? AND email2 = ?'
    );
    $sql->bind_param('ss', $email, $user_email);
    $sql->execute();
    $sql->close();

    $sql = $conn->prepare(
        'DELETE FROM friends WHERE email2 = ? AND email1 = ?'
    );
    $sql->bind_param('ss', $email, $user_email);
    $sql->execute();
    $sql->close();
    if ($sql) {
        echo '<p class="text-success" >Friend Removed successfully!</p>';
    } else {
        echo '<p class="text-danger" >Friend not found...</p>';
    }
}

$conn->close();
?>
