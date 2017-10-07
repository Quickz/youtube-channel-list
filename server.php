<?php

$key = json_decode(
	file_get_contents("youtubeApiKey.json")
)->key;

if (isset($_POST["data"]))
{
	$userID = htmlspecialchars($_POST["data"]);
	$url1 = "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" .
			$userID . "&key=" . $key;

	$url2 = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" .
			$userID . "&key=" . $key;

	$data = json_decode(requestdata($url1));
	

	if (sizeof($data) > 0)
	{
		$data = $data->items[0];
		$result = (object)[];
		$result->title = $data->snippet->title;
		$result->avatar = $data->snippet->thumbnails->default->url;

		$data = json_decode(requestData($url2));
		if (sizeOf($data) > 0)
		{
			$data = $data->items[0];
			$result->subCount = $data->statistics->subscriberCount;

			echo json_encode($result);
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





//https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=&key=

//https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=pewdiepie&key=AIzaSyB8gUlB_zCraZJ_ShgdRRPB1mSGvI_66JU
