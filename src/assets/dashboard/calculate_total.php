<?php
session_start();
$servername = 'localhost'; // Change accordingly
$username = 'root'; // Change accordingly
$password = ''; // Change accordingly
$db = 'expensesplitter'; // Change accordingly

// Create connection
$conn = new mysqli($servername, $username, $password, $db);
$NotFound = 'No Entry Found!';

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$sql = $conn->prepare(
    'SELECT t.price, t.totalAmount, u1.email AS paidBy, u2.email AS paidTo
    FROM Transaction t
    JOIN User u1 ON t.paidBy = u1.email
    JOIN User u2 ON t.paidTo = u2.email
    WHERE u1.email = ? OR u2.email = ?'
);
$email = $_SESSION['email'];
$sql->bind_param('ss', $email, $email);
$sql->execute();
$result = $sql->get_result();

$totalOwed = 0;
$isOwed = false;

while ($transaction = $result->fetch_assoc()) {
    if ($transaction['paidBy'] == $email) {
        $totalOwed -= $transaction['price'];
    } else {
        $totalOwed += $transaction['price'];
    }
}

// Determine whether the user owes or is owed
$isOwed = $totalOwed < 0;

echo json_encode(['totalOwed' => $totalOwed, 'isOwed' => $isOwed]);

$sql->close();
$conn->close();
?>
