<?php

	require_once('database.php');

	if (isset($_REQUEST['chatId']))
	{
		$chatId = $_REQUEST['chatId'];;

		$db = new ChatterboxDatabase();
		$msgs = $db->getAllMessages($chatId);

		header('Content-type: text/json');
		echo json_encode($msgs);

		//foreach ($msgs as $msg)
		//{
			//
		//	echo "MESSAGE: {$msg['id']} - " . date('Y-m-d H:i:s', $msg['dateTime']) . ") {$msg['messageText']}   [by {$msg['userId']}]\n";
		//}

		/*
		$chats = $db->getAllChats();
		if ($chats)
		{
			foreach ($chats as $chat)
			{
				echo "CHAT: {$chat['name']}   [{$chat['id']}]\n";
			}
		}
		else
		{
			echo "GOT NO CHATS!\n";
		}

		$users = $db->getAllUsers();
		if ($users)
		{
			foreach ($users as $user)
			{
				//
				echo "USER: {$user['name']}   [{$user['id']}]\n";
			}
		}
		else
		{
			echo "GOT NO USERS\n";
		}
		*/
	}
	else
	{
		sendHttpResponse(400, "Go away bad guy!");
	}