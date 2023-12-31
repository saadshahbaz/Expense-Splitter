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
    'SELECT t.*, u1.FirstName AS paidByFirstName, u1.LastName AS paidByLastName, u2.FirstName AS paidToFirstName, u2.LastName AS paidToLastName
    FROM Transaction t
    JOIN User u1 ON t.paidBy = u1.email
    JOIN User u2 ON t.paidTo = u2.email
    WHERE t.paidBy = ? OR t.paidTo = ?'
);
$email = $_SESSION['email'];
$sql->bind_param('ss', $email, $email);
$sql->execute();
$result = $sql->get_result();

echo '<div class="row" style="overflow-x:auto;overflow-y:auto;">
<div class="col"><table id="myTable">';
echo '<tr>
    <th class="red-label">Description</th>
    <th class="red-label">Paid By</th>
    <th class="red-label">Paid To</th>
    <th class="red-label">Amount</th>
    <th class="red-label">Total Amount</th>
    <th class="red-label">Remove</th>
    <th style="display: none;">Transaction ID</th>
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
while ($transaction = $result->fetch_assoc()) {
    $fontColor =
        $transaction['paidBy'] == $email ? 'green' : 'rgb(167, 37, 48)';

    echo '<tr>
    <td>' .
    $transaction['description'] .
    '</td>
    <td>' .
    $transaction['paidByFirstName'] .
    ' ' .
    $transaction['paidByLastName'] .
    '</td>
    <td>' .
    $transaction['paidToFirstName'] .
    ' ' .
    $transaction['paidToLastName'] .
    '</td>
    <td style="color: ' .
    $fontColor .
    '">$' . // Set font color inline
    $transaction['price'] .
    '</td>
    <td style="color: ' .
    $fontColor .
    '">$' . // Set font color inline
        $transaction['totalAmount'] .
        '</td>
    <td><button type="button" id="' .
        $i .
        '-remove' .
        '" class="btn btn-outline-secondary" data-toggle="modal" onClick="buttonInformationRemove(this.id)"><i class="fa fa-minus"></i> Remove </button>
    </td>
    <td style="display: none;">' .
        $transaction['transactionID'] .
        '</td>
</tr>';

    $i++;
}

echo '</table></div></div>';

$sql->close();
$conn->close();
?>
