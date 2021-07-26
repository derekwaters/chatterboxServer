<?php

	require_once('database.php');

	if (isset($_REQUEST['chatName']))
	{
		$chatName = $_REQUEST['chatName'];

		if (strlen($chatName) > 0)
		{
			$db = new ChatterboxDatabase();
			$db->addChat($chatName);

			sendHttpResponse(200, "Added Chat!");
		}
		else
		{
			sendHttpResponse(404, "Chat Name can't be empty");
		}
	}
	else
	{
		sendHttpResponse(400, "Go away bad guy!");
	}