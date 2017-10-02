document.addEventListener("DOMContentLoaded", function() {
  var markers = {};
	var markerKeys = [];
	var locations = [];
	var selectedCategory = 'all';
	
	// initalizations
  var fb = initializeFirebase();
	var map = initMap();
	var gof = new geoOnFire('events', fb.database().ref());
	initOnIdle();
	initPlacesAutocomplete();
	initOnCategory();
	
  function initializeFirebase() {
    var config = {
      apiKey: "AIzaSyCw9tFan0QLYEbK9uOtO5tLCv8koy1PoV4",
      authDomain: "fir-nearby.firebaseapp.com",
      databaseURL: "https://fir-nearby.firebaseio.com",
      projectId: "fir-nearby"
    };
    
    return fb = firebase.initializeApp(config);
  }
    
  function initMap() {
    var center = { lat: 37.713172, lng: -122.421297 };
    return new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: center
    });
  }

  function addMarker(map, location) {
  	return new google.maps.Marker({
      position: location,
      map: map
    });
  }
  
  function removeMarker(existingMarkers, markerKeys, markers) {
    let markersToRemove = existingMarkers.filter(x => markerKeys.indexOf(x) == -1);
  
    markersToRemove.map(function (markerToRemove) {
      markers[markerToRemove].setMap(null);
      delete markers[markerToRemove];
    });
    
    return markers;
  }
  
  function getLocations(map, gof, boundaries) {
    return gof.getLocationsByBoundaries(boundaries, 1).once('value');
  }

  function displayEvent(events) {
    document.getElementById("events").innerHTML = '';
    
    events.map(function (event) {
      var div = document.createElement('div');
      var title = document.createElement('h2');
      var cropWrap = document.createElement('li');
      var img = document.createElement('img');
      
      title.innerHTML = event.title;
      img.src = event.image;
      
      cropWrap.appendChild(img);
      div.appendChild(cropWrap);
      div.appendChild(title);

      document.getElementById("events").appendChild(div);
    });
  }

  function initOnIdle() {
  	map.addListener('idle', function() {
  	  var boundaries = map.getBounds();
      var ne = boundaries.getNorthEast();
      var sw = boundaries.getSouthWest();
      
      getLocations(map, gof, { sw: { lat: sw.lat(), lng: sw.lng() }, ne: { lat: ne.lat(), lng: ne.lng() } })
        .then(events => {
          let existingMarkers = markerKeys;
          markerKeys = [];
          locations = [];
          
          events = filterCategory(events);
          
          events.forEach((event) => {
            markerKeys.push(event.key);
            
            if (!markers[event.key]) {
              markers[event.key] = addMarker(map, event.val().location);            
            }
  
            locations.push(event.val());
          });
          
          markers = removeMarker(existingMarkers, markerKeys, markers);
          displayEvent(locations);
        });
  	});
  }
  
  function initOnCategory() {
    var category = document.getElementById("category");
    
    category.addEventListener('change', function() {
      selectedCategory = category.options[category.selectedIndex].value;
      google.maps.event.trigger(map, 'idle');
    });
  }
  
  function filterCategory(events) {
    if (selectedCategory !== "all") {
      events = events.filter(event => event.val().category === selectedCategory)
    }
    
    return events;
  }
  
  function initPlacesAutocomplete() {
     var input = document.getElementById('searchTextField');
     var autocomplete = new google.maps.places.Autocomplete(input);
     
     google.maps.event.addListener(autocomplete, 'place_changed', function() {
       var place = autocomplete.getPlace();
       map.setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
    });
  }
});
