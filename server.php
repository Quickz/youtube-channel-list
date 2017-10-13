<?php

$key = json_decode(
	file_get_contents("youtubeApiKey.json")
)->key;

$userID = json_decode(
	file_get_contents("channelList.json")
)->ids;


$data = [];
for ($i = 0; $i < sizeOf($userID); $i++)
{
	$data[$i] = getUserData($userID[$i], $key);
}

echo json_encode($data);


/**
 *
 *
 */
function getUserData($userID, $key)
{
	$url1 = "https://www.googleapis.com/youtube/v3/channels?" .
			"part=snippet&id=" . $userID . "&key=" . $key;

	$url2 = "https://www.googleapis.com/youtube/v3/channels?" .
			"part=statistics&id=" . $userID . "&key=" . $key;

	$data = json_decode(requestdata($url1));

	if (sizeof($data->items) > 0)
	{
		$data = $data->items[0];
		$result = (object)[];
		$result->title = $data->snippet->title;
		$result->avatar = $data->snippet->thumbnails->default->url;

		$data = json_decode(requestData($url2));
		if (sizeOf($data->items) > 0)
		{
			$data = $data->items[0];
			$result->subCount = $data->statistics->subscriberCount;
			$result->userId = $userID;

			return $result;
		}
	}
}

/**
 *
 *
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
