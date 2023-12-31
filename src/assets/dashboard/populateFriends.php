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
$user_email = $_SESSION['email'];
$sql = $conn->prepare(
    'SELECT friends.email2, user.firstName, user.lastName FROM friends JOIN user ON friends.email2 = user.email WHERE friends.email1 = ?'
);
$sql->bind_param('s', $user_email);
$sql->execute();
$result = $sql->get_result();

echo '<div class="row" style="overflow-x:auto;overflow-y:auto;">
<div class="col"><table id="myTable">';
echo '<tr>
    <th class="red-label">Name</th>
    <th class="red-label">Email</th>
    </tr>';

if (mysqli_num_rows($result) == 0) {
    echo '</table></div></div>';
    echo '<p style="display:flex; 
                    justify-content:center;
                        align-item:center;
                        margin-top: 20px;
                        color: rgb(167, 37, 48);
                        font-weight: bold;
                        font-size: 18px;">' .
        $NotFound .
        '</p>';
}

$i = 1;

while ($ta = $result->fetch_assoc()) {
    echo '<tr>
    <td>' .
        $ta['firstName'] .
        ' ' .
        $ta['lastName'] .
        '</td>
    <td>' .
        $ta['email2'] .
        '</td>
    </tr>';

    $i++;
}

echo '</table></div></div>';

?>
