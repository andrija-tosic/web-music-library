<?php
$targetPath = "images/" . basename($_FILES["imageInput"]["name"]);
$toAppend = ($_POST["musicLibraryId"]);
$newPath = $toAppend . $targetPath;

move_uploaded_file($_FILES["imageInput"]["tmp_name"], $newPath);
