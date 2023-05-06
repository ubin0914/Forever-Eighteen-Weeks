<?php
  require_once 'login_Game_database.php';
  $conn = new mysqli($hn, $un, $pw, $db);
  if ($conn->connect_error) die("Fatal Error");
  
  $userID = get_post($conn, 'userID');
  $stage = get_post($conn, 'stage');
  $stage_level = get_post($conn, 'stage_level');
  $gain_gold = get_post($conn, 'gain_gold');
  $gain_potion = get_post($conn, 'gain_potion');
  $gain_fragments = get_post($conn, 'gain_fragments');

  $gain_kirito_fragments = 0;
  $gain_megumin_fragments = 0;
  $gain_dio_fragments = 0;
  $gain_tanjiro_fragments = 0;
  $gain_saber_fragments = 0;
  $gain_mash_fragments = 0;
  $gain_goro_fragments = 0;
  $gain_rucia_fragments = 0;
  switch ($stage)
  {
    case 1:
      $gain_kirito_fragments = $gain_fragments;
      break;
    case 2:
      $gain_megumin_fragments = $gain_fragments;
      break;
    case 3:
      $gain_dio_fragments = $gain_fragments;
      break;
    case 4:
      $gain_tanjiro_fragments = $gain_fragments;
      break;
    case 5:
      $gain_saber_fragments = $gain_fragments;
      break;
    case 6:
      $gain_mash_fragments = $gain_fragments;
      break;
    case 7:
      $gain_goro_fragments = $gain_fragments;
      break;
    case 8:
      $gain_rucia_fragments = $gain_fragments;
      break;
    default:
      break;
  }

  $query3  = "SELECT * FROM `account_data` ORDER BY `userID`;";
  $result3 = $conn->query($query3);
  $result3->data_seek($userID);   //帳號修改這裡
  $row = $result3->fetch_assoc();
  $passed_column = 'subject'.($stage - 10).'_passed';
  $stage_passed = $row[$passed_column];
  if($stage_level > $stage_passed) $stage_passed = $stage_level;
  $gold = $row['gold'] + $gain_gold;
  $potion = $row['potion'] + $gain_potion;
  $kirito_fragments = $row['kirito_fragments'] + $gain_kirito_fragments;
  $megumin_fragments = $row['megumin_fragments'] + $gain_megumin_fragments;
  $dio_fragments = $row['dio_fragments'] + $gain_dio_fragments;
  $tanjiro_fragments = $row['tanjiro_fragments'] + $gain_tanjiro_fragments;
  $saber_fragments = $row['saber_fragments'] + $gain_saber_fragments;
  $mash_fragments = $row['mash_fragments'] + $gain_mash_fragments;
  $goro_fragments = $row['goro_fragments'] + $gain_goro_fragments;
  $rucia_fragments = $row['rucia_fragments'] + $gain_rucia_fragments;

  $query4    = "UPDATE `account_data` SET `gold` = $gold, `potion` = $potion, $passed_column = $stage_passed, ".
    "`kirito_fragments` = $kirito_fragments, `megumin_fragments` = $megumin_fragments, `dio_fragments` = $dio_fragments, `tanjiro_fragments` = $tanjiro_fragments, ".
    "`saber_fragments` = $saber_fragments, `mash_fragments` = $mash_fragments, `goro_fragments` = $goro_fragments, `rucia_fragments` = $rucia_fragments ".
    "WHERE `userID` = $userID;";  //帳號修改這裡
  $result4   = $conn->query($query4);

  if($stage <= 10){
    $user_table = "user$userID";
    $query5    = "UPDATE $user_table SET `hold` = 1 WHERE `No` = $stage;";
    $result5   = $conn->query($query5);
  }

  $conn->close();

  function get_post($conn, $var)
  {
    return $conn->real_escape_string($_POST[$var]);
  }
?>