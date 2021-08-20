<?php

	require_once('database.php');

	if (isset($_REQUEST['chatId']))
	{
		$chatId = $_REQUEST['chatId'];;

		$db = new ChatterboxDatabase();
		$msgs = $db->getAllMessages($chatId);

		foreach ($msgs as $key => $message)
		{
			$userId = $message['userId'];
			$user = $db->getUserById($userId);
			$msgs[$key]['userName'] = $user['name'];
		}

		header('Content-type: text/json');
		echo json_encode($msgs);
	}
	else
	{
		sendHttpResponse(400, "Go away bad guy!");
	}