(function(){

	"use strict";

	var count = 0;

	request();
	
	/**
	 * creates the html elements
	 * for a channel entry
	 */
	function createEntry(name, channelUrl, imageUrl, subCount)
	{
		var container = createElement("div", entries);
		container.className = "channel-entry";

		var numberContainer = createElement("div", container);
		numberContainer.className = "channel-number";
		createElement("div", numberContainer);
		createTextNode("#" + ++count, numberContainer);

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
		    	data = sortData(data);
		    	for (let i = 0; i < data.length; i++)
		    	{
			    	let name = data[i].title;
			    	let channelUrl = "https://www.youtube.com/channel/" +
			    					 data[i].userId;
			    	let imgUrl = data[i].avatar;
			    	let subCount = formatSubCount(data[i].subCount);
			    	createEntry(name, channelUrl, imgUrl, subCount);
		    	}
		    }
		};
		xhttp.open("GET", "server.php", true);
		xhttp.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
		xhttp.send();
	}

	/**
	 * sorts the channels in descending
	 * order by their subcriber count
	 * note: +n - converts to number
	 */
	function sortData(data)
	{
		for (let i = 0; i < data.length; i++)
    	{
	    	for (let j = 0; j < data.length - i - 1; j++)
	    	{
	    		if (+data[j].subCount < +data[j + 1].subCount)
	    		{
	    			let tmp = data[j];
	    			data[j] = data[j + 1];
	    			data[j + 1] = tmp;
	    		}
	    	}
    	}
    	return data;
	}


	/**
	 * puts a coma at every
	 * fourth position in a string
	 */
	function formatSubCount(subCount)
	{
		for (let i = 3; i < subCount.length; i += 4)
		{
			let s1 = subCount.substr(0, subCount.length - i);
			let s2 = subCount.substr(subCount.length - i);
			subCount = s1 + "," + s2;
		}

		return subCount;
	}


})();
