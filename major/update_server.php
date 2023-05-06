<?php
  require_once 'login_Game_database.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if ($conn->connect_error) die("Fatal Error");
  
  $stage = get_post($conn, 'stage');
  $stage_level = get_post($conn, 'stage_level');

  $query4    = "UPDATE `server_link` SET `stage` = $stage, `stage_level` = $stage_level WHERE `serve` = 0;";  //只有0
  $result4   = $conn->query($query4);

  $conn->close();

  function get_post($conn, $var)
  {
    return $conn->real_escape_string($_POST[$var]);
  }

?>