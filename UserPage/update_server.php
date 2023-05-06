<?php
  require_once 'login_Game_database.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if ($conn->connect_error) die("Fatal Error");
  
  $username = get_post($conn, 'username');
  $password = get_post($conn, 'password');

  $query  = "SELECT * FROM `account_data` WHERE `username` = '$username' and `userpassword` = '$password';";
  $result = $conn->query($query);
  if (!$result) die("Fatal Error");
  if($result->num_rows){
    $result->data_seek(0);
    $row = $result->fetch_assoc();
    $userID = $row['userID'];
  }
  else $userID = -1;
  echo $userID;
  
  if($userID != -1){
    $query4    = "UPDATE `server_link` SET `userID` = $userID WHERE `serve` = 0;";  //只有0
    $result4   = $conn->query($query4);
  }

  $conn->close();

  function get_post($conn, $var)
  {
    return $conn->real_escape_string($_POST[$var]);
  }

?>