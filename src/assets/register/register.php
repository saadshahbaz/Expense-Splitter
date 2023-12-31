<?php
//creating connection
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

//getting data from the form
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$password = $_POST['password'];

echo 'First Name: ' . $fname . '<br>';
echo 'Last Name: ' . $lname . '<br>';
echo 'Email: ' . $email . '<br>';
echo 'Password: ' . $password . '<br>';
$password_hashed = password_hash($password, PASSWORD_DEFAULT);

//checking if all fields entered
if (empty($fname) || empty($lname) || empty($email) || empty($password)) {
    echo '<text style="color: #FF0000;">Please fill in all fields.</text>';
    return;
}

//check if email already exists
$sql = $conn->prepare('SELECT * FROM User WHERE email = ?');
$sql->bind_param('s', $email);
$sql->execute();
$result = $sql->get_result();
$user = $result->fetch_assoc();

if ($user) {
    echo '<text style="color: #FF0000;">Email already exists.</text>';
    die();
}

//add to users table
$sql = $conn->prepare(
    'INSERT INTO User (email, firstName, lastName, password) VALUES (?, ?, ?, ?)'
);
$sql->bind_param('ssss', $email, $fname, $lname, $password_hashed);
$sql->execute();
$sql->close();

$conn->close();

if ($sql) {
    echo '<p class="text-success" >User Added successfully!</p>';
} else {
    echo '<p class="text-danger" >Registration failed...</p>';
}

// if success, redirect to dashboard
session_start();
$_SESSION['email'] = $email;
echo "<script>window.location.replace('../landingpage/landingpage.html'); </script>";

?>
