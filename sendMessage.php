<?php

	require_once('database.php');

	if (isset($_REQUEST['chatId']) && isset($_REQUEST['postedById']) && isset($_REQUEST['messageText']))
	{
		$chatId = $_REQUEST['chatId'];
		$postedById = $_REQUEST['postedById'];
		$messageText = $_REQUEST['messageText'];

		$db = new ChatterboxDatabase();
		if ($db->getChatById($chatId))
		{
			if ($db->getUserById($postedById))
			{
				$db->addMessage($chatId, $postedById, $messageText);

				sendHttpResponse(200, "Message Posted!");
			}
			else
			{
				sendHttpResponse(404, "That's not a real user!");
			}
		}
		else
		{
			sendHttpResponse(404, "That's not a real chat");
		}
	}
	else
	{
		sendHttpResponse(400, "Go away bad guy!");
	}