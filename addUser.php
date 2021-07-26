<?php

	require_once('database.php');

	if (isset($_REQUEST['userName']))
	{
		$userName = $_REQUEST['userName'];

		if (strlen($userName) > 0)
		{
			$db = new ChatterboxDatabase();
			$db->addUser($userName);

			sendHttpResponse(200, "Added User!");
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