<?php
$targetPath = $_GET['imagePath'];
if (file_exists($targetPath)) {
    unlink($targetPath);
}