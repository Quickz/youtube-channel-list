(function(){

	"use strict";

	request();

	/**
	 * creates the html elements
	 * for a channel entry
	 */
	function createEntry(name, channelUrl, imageUrl, subCount)
	{
		var container = createElement("div", entries);
		container.className = "channel-entry";

		var imgContainer = createElement("div", container);
		imgContainer.className = "channel-avatar";

		var img = createElement("img", imgContainer);
		img.src = imageUrl;

		var nameContainer = createElement("div", container);
		nameContainer.className = "channel-name";

		var anchor = createElement("a", nameContainer);
		createTextNode(name, anchor);
		anchor.href = channelUrl;

		var subCountContainer = createElement("div", container);
		var subTxtContainer = createElement("div", subCountContainer);
		createTextNode(subCount, subTxtContainer);
		subCountContainer.className = "channel-subCount";
	}

	/**
	 * creates the specified element
	 * and assigns it as child of the parent
	 */
	function createElement(tagName, parent)
	{
		var element = document.createElement(tagName);
		parent.appendChild(element);
		return element;
	}

	/**
	 * creates a text node
	 * and adds it to the specified element
	 */
	function createTextNode(text, parent)
	{
		var textnode = document.createTextNode(text);
		parent.appendChild(textnode);
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
