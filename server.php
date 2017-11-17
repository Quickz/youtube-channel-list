<?php

$key = json_decode(
	file_get_contents("youtubeApiKey.json")
)->key;

$userID = json_decode(
	file_get_contents("channelList.json")
)->ids;

$data;
$data = getUserData($userID, $key);

echo json_encode($data);


/**
 * obtains channel data:
 * id, url, thumbnail, title
 */
function getUserData($userID, $key)
{
	$url = "https://www.googleapis.com/youtube/v3/channels?" .
			"part=snippet,statistics&id=%s&key=%s";
	$userIdString = $userID[0];

	// 50 seems to be the limit of items per request
	for ($i = 1; $i < sizeof($userID) && $i < 50; $i++)
		$userIdString .= "," . $userID[$i];
	
	// removing stored ids
	// necessary since youtube has a limit
	// for the number of requests that can
	// be sent at once
	array_splice($userID, 0, $i);

	// putting in the data in the urls
	$url = sprintf($url, $userIdString, $key);

	$data = json_decode(requestdata($url));

	$result = [];
	if (sizeof($data) > 0)
	{
		$userInfo = $data->items;
		$lng = sizeof($userInfo);
		for ($i = 0; $i < $lng; $i++)
		{
			$result[$i] = (object)[];
			$result[$i]->userId = $userInfo[$i]->id;
			$snippet = $userInfo[$i]->snippet;
			$result[$i]->title = $snippet->title;
			$result[$i]->avatar = $snippet->thumbnails->default->url;
			
			$stats = $userInfo[$i]->statistics;
			$result[$i]->subCount = $stats->subscriberCount;
		}
	}

	// obtaining data for leftover ids
	if (sizeof($userID) > 0)
		$restOfResult = getUserData($userID, $key);
	else
		$restOfResult = [];

	return array_merge($result, $restOfResult);
}

/**
 * obtains a string of data
 * from a url
 */
function requestData($url)
{
	// initialization
	$request = curl_init();

	// options
	curl_setopt($request, CURLOPT_URL, $url);
	curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($request, CURLOPT_SSL_VERIFYPEER, false);

	// execution
	$data = curl_exec($request);
	
	curl_close($request);
	return $data;
}
