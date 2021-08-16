<?php

	require_once('database.php');

	$db = new ChatterboxDatabase();
	$users = $db->getAllChats();

	header('Content-type: text/json');
	echo json_encode($users);