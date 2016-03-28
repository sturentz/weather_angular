<?php
header('Access-Control-Allow-Origin: *');  


global $city, $state, $weather, $apiFile, $localfile, $epoch, $dataHolder;

//was setting null as placeholder for variable of future function for new city-state lookup
$data = $_POST['data'];
$city = $data['city'];
$state = $data['state'];



$city= strtoupper($city);//convert to uppercase prevent duplication in json
$state= strtoupper($state);

//temp
$city=rawurlencode($city);//deal with spaces for api


$next_update=300;//seconds - how long to wait before next update
$epoch=time();
$apiKey="490b7f6020319ed9";// set API key;
$apiFile="http://api.wunderground.com/api/$apiKey/conditions/q/$state/$city.json";
$localfile="weather_data.json";
$lastTime=null;
$json_decode="";
$dataHolder=array();




if(file_exists($localfile)){
	   $json_decode=getWeather($localfile);
	   $weather=checkWeather($json_decode);
	
	
}else{
	//if file does not exist, seed it
	$weather=checkWeather($json_decode);
}

	


function getWeather($theFile){
	
	  
	  $context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
	  $fileContents= file_get_contents($theFile,false,$context); 
	  $json_decode=json_decode($fileContents,true);
	 
	
	
	  return $json_decode;
	
}

function checkWeather($json_decode){
	   global $city, $state, $epoch, $next_update, $apiFile, $dataHolder;
	   
	   $cityHolder=array();
	   
	
	   $lastTime=(empty($json_decode['city'][$city][time])) ? 0 : $json_decode['city'][$city][time];
	   $updateTime = ($epoch-$next_update>$lastTime) ? 0 : 1;
	   
	    
	   if(!$updateTime){
		  //update weather
		  
		 $tempweather=getWeather($apiFile);  
		 $weather=$tempweather["current_observation"];//["display_location"]["full"];
	
		 
		//capture new data and set into array for adding to json
		 $cityHolder["time"]=$epoch;
		 $cityHolder["weather"]=$weather;
		 $json_decode["city"][$city]=$cityHolder;

		 updateWeather($json_decode);
		
		   
	   }else{
		   
		 //just pass along weather;
		 $weather=$json_decode['city'][$city]['weather'];
	   }
	   
	   
	   return $weather;
	   
	   
	   
	
}
	
function updateWeather($json_decode){	  
	        global $localfile;
			
			  $newWeather=json_encode($json_decode);
			  file_put_contents($localfile, $newWeather);
			
		 
}

   
   

echo (json_encode($weather));//send stored json of this city to browser

?>