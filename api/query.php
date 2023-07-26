<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nohekhone";

// Create connection
global $conn;
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
// echo "Connected successfully";

function connect_to_db()
{
}

function qry($sql)
{
  $conn = $GLOBALS['conn'];
//   $sql = "SELECT * FROM users WHERE id = $id";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    $rows = [];
    while ($row = $result->fetch_assoc()) {
       array_push($rows, $row);
    }

    return $rows;
  } else {
    return json_encode(["ok"=>"false", "error"=>"0_results"]);
  }
}

function getMadahes() {
    return qry("SELECT * FROM madahes");
}

function getNohes() {
    return qry("SELECT * FROM nohes");
}

?>