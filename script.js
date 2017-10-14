(function(){

	request();
	
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

		container.appendChild(img);
		container.appendChild(nameContainer);
		container.appendChild(anchor);
		container.appendChild(subCountContainer);
		entries.appendChild(container);
	}

	/**
	 * sends a request to the server
	 * to get the user data
	 */
	function request()
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200)
		    {
		    	var data = JSON.parse(this.responseText);
		    	
		    	for (let i = 0; i < data.length; i++)
		    	{
			    	let name = data[i].title;
			    	let channelUrl = "https://www.youtube.com/channel/" +
			    					 data[i].userId;
			    	let imgUrl = data[i].avatar;
			    	let subCount = data[i].subCount;
			    	createEntry(name, channelUrl, imgUrl, subCount);
		    	}
		    }
		};
		xhttp.open("GET", "server.php", true);
		xhttp.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
		xhttp.send();
	}

})();
