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
			responseData = JSON.parse(xmlhttp.responseText);


			var chatDiv = document.getElementById("chatBody");
			var tableData = '<table><thead><tr><td>Message</td><td>By</td><td>Time</td></tr></thead><tbody>';
			for (var i = 0; i < responseData.length; i++)
			{
				var msg = responseData[i];
				var theRealDate = new Date();
				theRealDate.setTime(msg.dateTime * 1000);

				var minutesPad = (theRealDate.getMinutes() < 10 ? '0' : '');
				var secondsPad = (theRealDate.getSeconds() < 10 ? '0' : '');
				var timeString = theRealDate.getHours() + ':' + minutesPad + theRealDate.getMinutes() + ':' + secondsPad + theRealDate.getSeconds();

				tableData += '<tr><td>'  + msg.messageText + '</td><td>' + msg.userName + '</td><td>' + theRealDate.toDateString() + ' ' + timeString + '</td></tr>';
			}

			tableData += '</tbody></table>';
			// chatDiv.innerHTML = tableData;


			var now = new Date();

			var listGroupTemplate = '<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">' +
				'<img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">' +
				'<div class="d-flex gap-2 w-100 justify-content-between">' +
					'<div>' +
						'<span class="mb-0 chatUser">{{userName}}</span>' +
						'<span class="mb-0 opacity-75">{{messageText}}</span>' +
					'</div>' +
					'<small class="opacity-50 text-nowrap">{{relativeDate}}</small>' +
				'</div>' +
			'</a>';

			var chatPosts = $('#chatPosts');
			chatPosts.empty();
			for (var i = 0; i < responseData.length; i++)
			{
				var msg = responseData[i];

				var msgDate = new Date();
				msgDate.setTime(msg.dateTime * 1000);
				var daysDiff = dateDiffInDays(msgDate, now);
				if (daysDiff === 0)
				{
					var minutesPad = (msgDate.getMinutes() < 10 ? '0' : '');
					var secondsPad = (msgDate.getSeconds() < 10 ? '0' : '');
					msg.relativeDate = msgDate.getHours() + ':' + minutesPad + msgDate.getMinutes() + ':' + secondsPad + theRealDate.getSeconds();
				}
				else
				{
					msg.relativeDate = daysDiff + 'd';
				}

				html = mustache.render(listGroupTemplate, msg);
				//var newStuff = $(html);
				//chatPosts.append(html);
				//html.appendTo('.chatPosts');
				$(html).hide().appendTo('#chatPosts').slideDown();
			}
		}
	});
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
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
