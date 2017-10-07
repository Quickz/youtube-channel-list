(function(){

	var entries = document.getElementById("entries");
	var channelIdInput = document.getElementById("channel-id-input");
	var addChannelBtn = document.getElementById("add-channel");
	addChannelBtn.addEventListener("click", addChannel);
	channelList = [];
	loadChannelList();


	/**
	 * deletes both the array entry
	 * and the visible element of it
	 */
	function deleteEntry(e)
	{
		var container = e.target.parentElement;
		var containerParent = container.parentElement;
		var parentChildren = containerParent.children;
		for (let i = 0; i < parentChildren.length; i++)
		{
			if (parentChildren[i] == container)
			{
				containerParent.removeChild(container);
				channelList.splice(i, 1);
				saveChannelList();
				return;
			}
		}
	}

	/**
	 * adds a new channel id to the list
	 * and generates a new entry
	 */
	function addChannel()
	{
		channelList.push(channelIdInput.value);
		request(channelList[channelList.length - 1]);
		saveChannelList();
	}

	/**
	 * saves the channel list array in string format
	 * inside local storage
	 */
	function saveChannelList()
	{
		localStorage.YTchannelList = JSON.stringify(channelList);
	}

	/**
	 * loads the channel list from local storage
	 *
	 */
	function loadChannelList()
	{
		if (localStorage.YTchannelList)
		{
			channelList = JSON.parse(localStorage.YTchannelList);
			for (let i = 0; i < channelList.length; i++)
				request(channelList[i]);
		}
	}

	/**
	 * creates the html elements
	 * for a channel entry
	 */
	function createEntry(name, channelUrl, imageUrl, subCount)
	{
		var container = document.createElement("div");
		container.className = "channel-entry";

		var img = document.createElement("img");
		img.className = "channel-avatar";
		img.src = imageUrl;

		var nameContainer = document.createElement("div");
		var textnode = document.createTextNode(name);
		nameContainer.className = "channel-name";
		nameContainer.appendChild(textnode);

		var anchor = document.createElement("a");
		anchor.href = channelUrl;
		textnode = document.createTextNode("channel url");
		anchor.appendChild(textnode);

		var subCountContainer = document.createElement("div");
		textnode = document.createTextNode("Subscribers: " + subCount);
		subCountContainer.appendChild(textnode);

		var deleteBtn = document.createElement("button");
		textnode = document.createTextNode("Delete");
		deleteBtn.appendChild(textnode);
		deleteBtn.addEventListener("click", deleteEntry);

		container.appendChild(img);
		container.appendChild(nameContainer);
		container.appendChild(anchor);
		container.appendChild(subCountContainer);
		container.appendChild(deleteBtn);
		entries.appendChild(container);
	}

	/**
	 * sends a request to the server
	 * to get the user data
	 */
	function request(userID)
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200)
		    {
		    	var data = JSON.parse(this.responseText);
		    	var name = data.title;
		    	var channelUrl = "https://www.youtube.com/channel/" + userID;
		    	var imgUrl = data.avatar;
		    	createEntry(name, channelUrl, imgUrl, data.subCount);
		    }
		};
		xhttp.open("POST", "server.php", true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("data=" + userID);
	}

})();
