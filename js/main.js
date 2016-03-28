//location of api and cache info
weather_api="cache_feed.php";


function processWeather(WeatherDataNew){
	
	
weatherData=WeatherDataNew;
  
	  //reshape the node
	  for (my_element in weatherObj.dataMap) {
        format(my_element, weatherObj.dataMap[my_element])
      }
	  
	  
	  $('.weather-icon').attr('src',weatherReading["icon_url"] );
	  $('.weather').html(weatherReading["weather"]);
	  
	 
	   currenttemp=weatherReading["temperature_string"].replace("(", "<br><span class='small'>");
	   currenttemp=currenttemp.replace(")", "</span>");
	  $('.temperature_string').html(currenttemp);
	  full=weatherReading["full"].replace(",", "<br>");
	   $('.wind_string').html("Winds "+weatherReading["wind_string"] + " <span class='subhead'>Humidity "+weatherReading["relative_humidity"]+"</span>");
	   $('.citylocation').html(full);
	   $('.observationtime').html(weatherReading["observation_time"]);
	   
	   
	   
	   //get the cityies
	  
	   var tempcity="";
	  for (my_element in weatherObj.city) {
		 selected = my_element==current_city ? "selected"  : "";
		 tempcity+="<div class='city "+selected+"' onclick=\"getWeather('"+my_element+"');\">"+my_element+"</div>";
      }
	  
	  $('.safehouse').html(tempcity);
	  
  
}

function getWeather(city){
	
	//console.log(city);
	current_city=city;
    current_state=weatherObj.city[current_city];
	checkWeather();

	
}


function format(dataType, weatherArray){
	

	  var weatherComponent;
	 // var weatherReading;
	  for(var i=0;i<weatherArray.length;i++){
		  weatherComponent=weatherArray[i];
	  switch(dataType){
		    case "observation_location":
			case "display_location":
			 weatherReading[weatherComponent]=weatherData[dataType][weatherComponent];
			break;
			
			case "root":
			 weatherReading[weatherComponent]=weatherData[weatherComponent];
			break;
			
			default:
			
			 
			break;
				 
		 }

	   
	 }

	
	 
}





function checkWeather(){
	
	getinfo.url = weather_api;
	getinfo.data="city="+current_city+"&state="+current_state;
 	getinfo.action="liveweather";
    fetch_info(getinfo);
	
	
	
}
	







/*fetches the weather json if not in cache*/
function fetch_info(getinfo){
 
	
	var xmlhttp = new XMLHttpRequest();
	var url=getinfo.url;
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			
			
			var data = JSON.parse(xmlhttp.responseText);
			
			switch(getinfo.action){
				case "liveweather":
				processWeather(data);
				break;
			
			default:
			    //kept switch for future expansion
				break;
			}
		}
	};
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlhttp.send(getinfo.data);
}

		
		
		