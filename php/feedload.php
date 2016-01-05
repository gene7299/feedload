<?php

function _get($str){ 
    $val = !empty($_GET[$str]) ? $_GET[$str] : null; 
    return $val; 
} 
$MaxCount = _get('num');

if($MaxCount == null)
	$MaxCount = 1000;

$feedurl_encodeURIComponent = _get('q');
$number = _get('n');
$feedurl = rawurldecode($feedurl_encodeURIComponent);

header('Content-Type: application/json');
$feed = new DOMDocument();
$feed->load($feedurl);
$json = array();

$json['responseData']['feed']['feedurl'] = $feedurl;

//--------------------------
if($feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('title')->item(0))
	$json['responseData']['feed']['title'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('title')->item(0)->firstChild->nodeValue;
else
	$json['responseData']['feed']['title'] = '';
//--------------------------
if($feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('link')->item(0))
	$json['responseData']['feed']['link'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('link')->item(0)->firstChild->nodeValue;
else
	$json['responseData']['feed']['link'] = '';
//--------------------------
if($feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('author')->item(0))
	$json['responseData']['feed']['author'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('author')->item(0)->firstChild->nodeValue;
else
	$json['responseData']['feed']['author'] = '';
//--------------------------
if($feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('description')->item(0))
	$json['responseData']['feed']['description'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('description')->item(0)->firstChild->nodeValue;
else
	$json['responseData']['feed']['description'] = '';
//--------------------------
$json['responseData']['feed']['type'] = 'rss20';//$feed->getElementsByTagName('rss')->getAttribute('version');
//--------------------------
$items = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('item');
$json['responseData']['feed']['entries'] = array();

$i = 0;
$item_num = 0;

foreach($items as $item) {
	if($i > ($MaxCount-1))
		break;

	$title = null;
	$description = null;
	$pubDate = null;
	$guid = null;
	$link = null;
	$author = null;
	$copyright = null;
	$category = null;

	if($item->getElementsByTagName('title')->item(0))
	{
		$title = $item->getElementsByTagName('title')->item(0)->firstChild->nodeValue;
	}
	if($item->getElementsByTagName('description')->item(0))
	{
		$description = $item->getElementsByTagName('description')->item(0)->firstChild->nodeValue;
	}
	if($item->getElementsByTagName('pubDate')->item(0))
	{
		$pubDate = $item->getElementsByTagName('pubDate')->item(0)->firstChild->nodeValue;
	}
	if($item->getElementsByTagName('guid')->item(0))
	{
		$guid = $item->getElementsByTagName('guid')->item(0)->firstChild->nodeValue;
	}  
	if($item->getElementsByTagName('link')->item(0))
	{
		$link = $item->getElementsByTagName('link')->item(0)->firstChild->nodeValue;
	}
	if($item->getElementsByTagName('author')->item(0))
	{
		$author = $item->getElementsByTagName('author')->item(0)->firstChild->nodeValue;
	}
	if($item->getElementsByTagName('category')->item(0))
	{
		$category = $item->getElementsByTagName('category')->item(0)->firstChild->nodeValue;
	}
	if($item->getElementsByTagName('copyright')->item(0))
	{
		$copyright = $item->getElementsByTagName('copyright')->item(0)->firstChild->nodeValue;
	}	
  	
  	if($title != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['title'] = $title;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['title'] = "";	
  	}

  	if($link != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['link'] = $link;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['link'] = "";	
  	}

   	if($author != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['author'] = $author;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['author'] = "";	
  	}

  	if($pubDate != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['publishedDate'] = $pubDate;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['publishedDate'] = "";	
  	}	

   	if($description != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['content'] = $description;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['content'] = "";	
  	}
  	
   	if($copyright != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['copyright'] = $copyright;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['copyright'] = "";	
  	}
  	
   	if($category != null)
  	{
  		$json['responseData']['feed']['entries'][$i]['category'] = $category;
  	}else
  	{
  		$json['responseData']['feed']['entries'][$i]['category'] = "";	
  	} 	 	 
   	$i++;
   
}



echo json_encode($json);


?>