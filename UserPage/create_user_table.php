<?php
    require_once 'login_Game_database.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if ($conn->connect_error) die("Fatal Error");
    
    $username = get_post($conn, 'username');
    $password = get_post($conn, 'password');

    $query  = "SELECT * FROM `account_data` WHERE `username` = '$username';";
    $result = $conn->query($query);
    if (!$result) die("Fatal Error");

    echo !$result->num_rows;
    if(!$result->num_rows){
        $query  = "SELECT * FROM `setup_num` WHERE 1";
        $result = $conn->query($query);
        if (!$result) die("Fatal Error");
        $result->data_seek(0);
        $row = $result->fetch_assoc();
        $next_account = $row['account'];
        $table = "user".$next_account;
    
        $query = "CREATE TABLE $table (".
                "No INT,".
                "hold BOOLEAN,".
                "STAR INT,".
                "LV INT,".
                "HP INT,".
                "RG INT,".
                "ATK INT,".
                "ACD INT,".
                "DF INT,".
                "KB INT,".
                "SATK INT,".
                "SACD INT,".
                "SDF INT,".
                "SCD INT,".
                "SCT INT,".
                "COST INT,".
                "BUYCD INT,".
                "CUREXP INT) ENGINE InnoDB;";
        $result = $conn->query($query);
        if (!$result) die("Fatal Error");

        $query = "INSERT INTO $table ".
                "SELECT * FROM `user_initial` ".
                "WHERE 1;";
        $result = $conn->query($query);
        if (!$result) die("Fatal Error");

        $query = "INSERT INTO `account_data` (`userID`, `username`, `userpassword`, `gold`, `potion`, `kirito_fragments`, `megumin_fragments`, `dio_fragments`, `tanjiro_fragments`, `saber_fragments`, `mash_fragments`, `goro_fragments`, `rucia_fragments`, `team_member1`, `team_member2`, `team_member3`, `team_member4`, `team_member5`, `team_member6`, `team_member7`, `team_member8`, `subject1_passed`, `subject2_passed`, `subject3_passed`, `subject4_passed`)".
                    "VALUES ($next_account, '$username', '$password', 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 12, 13, 14, 17, 19, 20, 1, 0, 0, 0, 0);";
        $result = $conn->query($query);
        if (!$result) die("Fatal Error");

        $query    = "UPDATE `setup_num` SET `account` = ($next_account + 1) WHERE 1;";
        $result   = $conn->query($query);
    }
    
    $conn->close();

    function get_post($conn, $var)
    {
        return $conn->real_escape_string($_POST[$var]);
    }
?>