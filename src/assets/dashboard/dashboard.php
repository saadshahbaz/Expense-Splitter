<?php
session_start();

$servername = 'localhost'; // Change accordingly
$username = 'root'; // Change accordingly
$password = ''; // Change accordingly
$db = 'expensesplitter'; // Change accordingly

$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$user_email = $_SESSION['email'];

function getPersonName($email)
{
    global $conn;
    global $user_email;

    $sql = $conn->prepare('SELECT firstName FROM User WHERE email = ?');
    $sql->bind_param('s', $email);
    $sql->execute();
    $result = $sql->get_result();
    $row = $result->fetch_assoc();
    $firstName1 = $row['firstName'];

    $sql2 = $conn->prepare('SELECT firstName FROM User WHERE email = ?');
    $sql2->bind_param('s', $user_email);
    $sql2->execute();
    $result2 = $sql2->get_result();
    $row2 = $result2->fetch_assoc();
    $firstName2 = $row2['firstName'];

    $conn->close(); // Close connection here

    return [$firstName1, $firstName2];
}

function getFriends()
{
    global $conn;
    global $user_email;

    $sql = $conn->prepare(
        'SELECT friends.email2, user.firstName, user.lastName FROM friends JOIN user ON friends.email2 = user.email WHERE friends.email1 = ?'
    );
    $sql->bind_param('s', $user_email);
    $sql->execute();
    $result = $sql->get_result();
    echo '<option value="" selected disabled> Select a Friend.. </option>';
    while ($ta = $result->fetch_assoc()) {
        echo '<option value="' .
            $ta['email2'] .
            '">' .
            $ta['firstName'] .
            ' ' .
            $ta['lastName'] .
            '</option>';
    }
    // $conn->close(); // Commented out: Close connection here if you are not reusing it
}

if (isset($_GET['action'])) {
    if ($_GET['action'] === 'getFriends') {
        getFriends();
    } elseif ($_GET['action'] === 'getPersonName') {
        $email = $_GET['email'];
        $names = getPersonName($email);
        echo json_encode($names); // Echo JSON response only once
    }
}

?>
