<?php

	require_once('utils.php');

	class ChatterboxDatabase
	{
		protected $handle;

		const SQLITE_FILENAME = 'chatterbox.db';

		const TABLE_CHAT = 'chat';
		const TABLE_USER = 'user';
		const TABLE_MESSAGE = 'message';

		const CREATE_TABLE_CHAT = 'CREATE TABLE chat (id INTEGER PRIMARY KEY, name TEXT)';
		const CREATE_TABLE_USER = 'CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT)';
		const CREATE_TABLE_MESSAGE = 'CREATE TABLE message (id INTEGER PRIMARY KEY, messageText TEXT, userId INTEGER, dateTime INTEGER, chatId INTEGER)';

		/*-----------------------------------------------*
		 | Chat Table                                    |
		 *-----------------------------------------------*
		 | id       |  name                              |
		 *-----------------------------------------------*

		 *-----------------------------------------------*
		 | User Table                                    |
		 *-----------------------------------------------*
		 | id       |  name                              |
		 *-----------------------------------------------*

		 *-----------------------------------------------*
		 | Message Table                                 |
		 *-----------------------------------------------*
		 | id | messageText | userId | chatId            |
		 *-----------------------------------------------*/


		public function __construct ()
		{
			$filename = dirname(__FILE__) . DIRECTORY_SEPARATOR . self::SQLITE_FILENAME;
			$doINeedToSetupTheDatabase = false;
			if (!file_exists($filename))
			{
				$doINeedToSetupTheDatabase = true;
			}

			$this->handle = new SQLite3($filename);
			if ($doINeedToSetupTheDatabase)
			{
				$this->setupDatabase();
			}
		}


		public function addMessage ($chatId, $userId, $messageText)
		{
			$when = time();

			$stmt = $this->handle->prepare("INSERT INTO MESSAGE (messageText, userId, dateTime, chatId) VALUES (:messageText, :userId, :dateTime, :chatId)");
			$stmt->bindValue(':messageText', $messageText, SQLITE3_TEXT);
			$stmt->bindValue(':userId', $userId, SQLITE3_INTEGER);
			$stmt->bindValue(':dateTime', $when, SQLITE3_INTEGER);
			$stmt->bindValue(':chatId', $chatId, SQLITE3_INTEGER);
			$stmt->execute();
		}

		public function addChat ($chatName)
		{
			$stmt = $this->handle->prepare("INSERT INTO CHAT (name) VALUES (:name)");
			$stmt->bindValue(':name', $chatName, SQLITE3_TEXT);
			$stmt->execute();
		}

		public function addUser ($userName)
		{
			$stmt = $this->handle->prepare("INSERT INTO USER (name) VALUES (:name)");
			$stmt->bindValue(':name', $userName, SQLITE3_TEXT);
			$stmt->execute();
		}



		public function getAllMessages ($chatId)
		{
			$stmt = $this->handle->prepare("SELECT * FROM message WHERE chatId = :chatId ORDER BY dateTime DESC");
			$stmt->bindValue(':chatId', $chatId, SQLITE3_INTEGER);
			$result = $stmt->execute();

			$messages = array();
			while ($row = $result->fetchArray(SQLITE3_ASSOC))
			{
				$messages[] = $row;
			}
			return $messages;
		}


		public function getAllChats ()
		{
			$stmt = $this->handle->prepare("SELECT * FROM chat ORDER BY name ASC");
			$result = $stmt->execute();

			$chats = array();
			while ($row = $result->fetchArray(SQLITE3_ASSOC))
			{
				$chats[] = $row;
			}
			return $chats;
		}

		public function getChatById ($chatId)
		{
			$stmt = $this->handle->prepare("SELECT * FROM chat WHERE id = :chatId");
			$stmt->bindValue(':chatId', $chatId, SQLITE3_INTEGER);
			$result = $stmt->execute();

			return $result->fetchArray(SQLITE3_ASSOC);
		}

		public function getAllUsers ()
		{

			$stmt = $this->handle->prepare("SELECT * FROM user ORDER BY name ASC");
			$result = $stmt->execute();

			$users = array();
			while ($row = $result->fetchArray(SQLITE3_ASSOC))
			{
				$users[] = $row;
			}
			return $users;
		}

		public function getUserById ($userId)
		{
			$stmt = $this->handle->prepare("SELECT * FROM user WHERE id = :userId");
			$stmt->bindValue(':userId', $userId, SQLITE3_INTEGER);
			$result = $stmt->execute();

			return $result->fetchArray(SQLITE3_ASSOC);
		}


		protected function setupDatabase ()
		{
			$this->handle->exec(self::CREATE_TABLE_CHAT);
			$this->handle->exec(self::CREATE_TABLE_USER);
			$this->handle->exec(self::CREATE_TABLE_MESSAGE);

			$this->handle->exec("INSERT INTO user (name) VALUES ('Goose')");
		}
	}