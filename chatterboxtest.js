var newChatName,
			newUserName,
			newChatChatId,
			newChatUserId,
			newChatMessage,
			getChatId,
			responseDiv,
			infoDiv;

		function startItUp ()
		{
			newChatName = document.getElementById('newChatName');
			newUserName = document.getElementById('newUserName');
			newChatChatId = document.getElementById('newChatChatId');
			newChatUserId = document.getElementById('newChatUserId');
			newChatMessage = document.getElementById('newChatMessage');
			getChatId = document.getElementById('getChatId');
			responseDiv = document.getElementById('responseDiv');
			infoDiv = document.getElementById('infoDiv');

			document.getElementById('newChatBtn').onclick  = function(event) {
				postChat();
			}
			document.getElementById('GetUsersBtn').onclick  = function(event) {
				getAllUsers();
			}
			document.getElementById('GetChatsBtn').onclick  = function(event) {
				getAllChats();
			}

			document.getElementById('addNewUserBtn').onclick  = function(event) {
				addUser();
			}

			/*
			document.getElementById('getChatBtn').onclick = function(event) {
				getChatMessages();
			}
			*/
			setInterval(getChatMessages, 5000);
		}

		function postChat ()
		{
			var chatId = newChatChatId.value;
			var userId = newChatUserId.value;
			var message = newChatMessage.value;

			if (message.length > 0)
			{
				sendAjax('sendMessage.php', {
					chatId: chatId,
					postedById: userId,
					messageText: message
				}, function(xmlhttp) {
					if (xmlhttp.status == 200)
					{
						getChatMessages();
						newChatMessage.value = "";
					}
					else
					{
						responseDiv.innerHTML = "OOps broken!";
					}
				});
			}
		}

		function getAllUsers ()
		{
			sendAjax('getAllUsers.php', {
			}, function(xmlhttp) {
				if (xmlhttp.status == 200)
				{
					responseData = JSON.parse(xmlhttp.responseText);
					var tableData = '<table><thead><tr><td>Id</td><td>Name</td></tr></thead><tbody>';
					for (var i = 0; i < responseData.length; i++)
					{
						var user = responseData[i];
						tableData += '<tr><td>' + user.id + '</td><td>' + user.name + '</td></tr>';
					}
					tableData += '</tbody></table>';
					infoDiv.innerHTML = tableData;
				}
				else
				{
					infoDiv.innerHTML = "OOps, Broken!";
				}
			});
		}

		function getAllChats ()
		{


			sendAjax('getAllChats.php', {
			}, function(xmlhttp) {
				if (xmlhttp.status == 200)
				{
					responseData = JSON.parse(xmlhttp.responseText);
					var tableData = '<table><thead><tr><td>Id</td><td>Name</td></tr></thead><tbody>';
					for (var i = 0; i < responseData.length; i++)
					{
						var chat = responseData[i];
						tableData += '<tr><td>' + chat.id + '</td><td>' + chat.name + '</td></tr>';
					}
					tableData += '</tbody></table>';
					infoDiv.innerHTML = tableData;
				}
				else
				{
					infoDiv.innerHTML = "OOps, Broken!";
				}
			});
		}

		function getChatMessages ()
		{
			var chatId = getChatId.value;
			sendAjax('getAllMessages.php', {
				chatId: chatId
			}, function(xmlhttp) {
				if (xmlhttp.status == 200)
				{
					responseData = JSON.parse(xmlhttp.responseText);
					var tableData = '<table><thead><tr><td>Id</td><td>Message</td><td>By</td><td>Message</td></tr></thead><tbody>';
					for (var i = 0; i < responseData.length; i++)
					{
						var msg = responseData[i];
						var theRealDate = new Date();
						theRealDate.setTime(msg.dateTime * 1000);

						var minutesPad = (theRealDate.getMinutes() < 10 ? '0' : '');
						var secondsPad = (theRealDate.getSeconds() < 10 ? '0' : '');
						var timeString = theRealDate.getHours() + ':' + minutesPad + theRealDate.getMinutes() + ':' + secondsPad + theRealDate.getSeconds();

						tableData += '<tr><td>' + msg.id + '</td><td>' + msg.messageText + '</td><td>' + msg.userId + '</td><td>' + theRealDate.toDateString() + ' ' + timeString + '</td></tr>';
					}
					tableData += '</tbody></table>';
					responseDiv.innerHTML = tableData;
				}
				else
				{
					responseDiv.innerHTML = "OOps, Broken!";
				}
			});
		}

		function sendAjax (urlPath, inputData, responseFunction)
		{
			var xmlhttp = null;
			if (window.XMLHttpRequest)
			{
				xmlhttp=new XMLHttpRequest();
			}
			else
			{
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}

			var url = '/chatterbox/' + urlPath;

			var isFirstKey = true;
			for (var key in inputData)
			{
				if (isFirstKey)
				{
					url = url + '?';
					isFirstKey =  false;
				}
				else
				{
					url = url + '&';
				}
				url = url + key + '=' + encodeURIComponent(inputData[key]);
			}

			xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4)
				{
					responseFunction(xmlhttp);
				}
			}
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		}
