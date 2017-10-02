/* 
* extended version of: https://codepen.io/arjentienkamp/pen/MYpYMO?q=tinder&limit=all&order=popularity&depth=everything&show_forks=false
* and: https://codepen.io/sdnyco/pen/wardxd?q=tinder&limit=all&type=type-pens
*/

$(document).ready(function(event) {
  var radius = 0;
	var currentDog = 0;
	var queriedDogs = [];
	
	// init
  var fb = initFirebase();
	var gofMale = new geoOnFire('male', fb.database().ref());
	var gofFemale = new geoOnFire('female', fb.database().ref());
	initRangeSlider();
	initEvents();
	
	// create view
	displayDogs(radius);
	
	function initFirebase() {
    var config = {
      apiKey: "AIzaSyCw9tFan0QLYEbK9uOtO5tLCv8koy1PoV4",
      authDomain: "fir-nearby.firebaseapp.com",
      databaseURL: "https://fir-nearby.firebaseio.com",
      projectId: "fir-nearby"
    };
    
    return fb = firebase.initializeApp(config);
  }
  
  function initEvents() {
    $("div#swipe_like").on( "click", function() {
  		swipeLike();
  	});	
  
  	$("div#swipe_dislike").on( "click", function() {
  		swipeDislike();
  	});
  	
  	$('.rangeslider .output').on("DOMSubtreeModified", function() {
  	  delay(function() {
  	    $("div.content").html(null)
        displayDogs(parseInt($(".rangeslider .output").val()));
  	  }, 500);
    });
  }

  function displayDogs(radius) {
    gofFemale.getLocationsByRadius({ lat: 33.8124, lng: -112.5484 }, radius).once()
  	  .then(dogs => {
  	    if (dogs.length > 0) {
  	      $(".footer").css({ display: 'block' });
          $(".loader .pulse").css({ display: 'none' });
          $(".loader .pulse-center").css({ display: 'none' });
          
          queriedDogs = [];
  	      currentDog = 0;
  	    
    	    dogs.map(dog => {
    	      queriedDogs.push(dog.val())
    	    });
    	    
    	    addNewProfile();
  	    } else {
  	      displayLoader();
  	    }
  	  });
  }
  
  function initRangeSlider() {
    $(".rangeslider-fill-lower").css({ width: 0 });
    $(".rangeslider-thumb").css({ left: 0 });
  }

	function swipe(dog) {
		Draggable.create("#photo", {
		   	throwProps:true,
		   	onDragEnd:function(endX) {
	   			if(Math.round(this.endX) > 0 ) {
	   				swipeLike();			
	   			}
	   			else {
	   				swipeDislike();
	   			}
	   			console.log(Math.round(this.endX));
			}
		});
	}

	function swipeLike() {
			var $photo = $("div.content").find('#photo');
			
			var swipe = new TimelineMax({repeat:0, yoyo:false, repeatDelay:0, onComplete:remove, onCompleteParams:[$photo]});
			swipe.staggerTo($photo, 0.8, {bezier:[{left:"+=400", top:"+=300", rotation:"60"}], ease:Power1.easeInOut});

			addNewProfile();
	}

	function swipeDislike() {
			var $photo = $("div.content").find('#photo');

			var swipe = new TimelineMax({repeat:0, yoyo:false, repeatDelay:0, onComplete:remove, onCompleteParams:[$photo]});
			swipe.staggerTo($photo, 0.8, {bezier:[{left:"+=-350", top:"+=300", rotation:"-60"}], ease:Power1.easeInOut});

			addNewProfile();
	}

	function remove(photo) {
	    $(photo).remove();
	}

	function addNewProfile() {
  	if (queriedDogs.length <= currentDog) {
      displayLoader();
    }
    
		$("div.content").prepend('<div class="photo" id="photo" style="background-image:url('+ queriedDogs[currentDog].image  +')">'
    	+ '<span class="meta">' 
    	+ '<p>'+ queriedDogs[currentDog].name +', '+ queriedDogs[currentDog].age +'</p>' 
    	+ '<p>'+ queriedDogs[currentDog].description +'</p>' 
    	+ '</span>' 
    	+ '</div>');
    	
    	 currentDog++;
    	 
    	swipe();
	}
	
	function displayLoader() {
	  $(".footer").css({ display: 'none' });
    $(".loader .pulse").css({ display: 'block' });
    $(".loader .pulse-center").css({ display: 'block' });
	}
	
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

});
