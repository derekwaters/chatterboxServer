var currentChat = null;

function startItUp ()
{
	var chats = [];
	populateChats(chats);

	sendAjax('getAllChats.php', {
	}, function(xmlhttp) {
		if (xmlhttp.status == 200)
		{
			responseData = JSON.parse(xmlhttp.responseText);
			populateChats(responseData);
			selectChat(responseData[0].id);
		}
	});
}

function populateChats (chats)
{
	var chatList = document.getElementById("chatList");
	chatList.innerHTML = "";

	var html = "";
	for (var i = 0; i < chats.length; i++)
	{
		var chat = chats[i];
		html += '<div class="chatLink" id="openChat' + chat.id + '">' + chat.name + '</div>';
	}
	chatList.innerHTML = html;
	for (var i = 0; i < chats.length; i++)
	{
		var chat = chats[i];
		var chatLink = document.getElementById("openChat" + chat.id);
		chatLink.onclick = function(theId) {
			return function() {
				selectChat(theId);
			}
		}(chat.id);
	}
}

function selectChat (chatId)
{
	currentChat = chatId;

	refreshMessages();
}

function refreshMessages ()
{
	sendAjax('getAllMessages.php', {
		chatId: currentChat
	}, function(xmlhttp) {
		if (xmlhttp.status == 200)
		{
			var chatDiv = document.getElementById("chatBody");
			responseData = JSON.parse(xmlhttp.responseText);
			var tableData = '<table><thead><tr><td>Message</td><td>By</td><td>Time</td></tr></thead><tbody>';
			for (var i = 0; i < responseData.length; i++)
			{
				var msg = responseData[i];
				var theRealDate = new Date();
				theRealDate.setTime(msg.dateTime * 1000);

				var minutesPad = (theRealDate.getMinutes() < 10 ? '0' : '');
				var secondsPad = (theRealDate.getSeconds() < 10 ? '0' : '');
				var timeString = theRealDate.getHours() + ':' + minutesPad + theRealDate.getMinutes() + ':' + secondsPad + theRealDate.getSeconds();

				tableData += '<tr><td>'  + msg.messageText + '</td><td>' + msg.userId + '</td><td>' + theRealDate.toDateString() + ' ' + timeString + '</td></tr>';
			}
			tableData += '</tbody></table>';
			chatDiv.innerHTML = tableData;
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
