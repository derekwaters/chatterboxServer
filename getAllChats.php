<?php

	require_once('database.php');

	$db = new ChatterboxDatabase();
	$chats = $db->getAllChats();

	header('Content-type: text/json');
	echo json_encode($chats);