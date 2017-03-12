var map;
var markersArray = [];
var mapOptions;
var friendsName;
var div;
//for stopping the bouncing of markers of the previously clicked friends

function stopBouncing() {

    $.each(markersArray, function(key, val) {
        console.log(key, val);
        if (val.getAnimation() !== null) {
            val.setAnimation(null);
        }

    });
}


function loadFriend(fid) {
    FB.api(fid, {
        limit: 2,
        fields: 'name,gender,location,link,statuses,events,checkins'
    }, function(response) {
        if (response.error) {
            return;
        }
        var lat;
        var long;
        var imageEvent;

        if (response.checkins.data.length > 0) {
            //console.log(response.checkins.data[0].place.location);
            //console.log(response.checkins.data[0].place.location.latitude);
            lat = response.checkins.data[0].place.location.latitude;
            console.log(lat);
            //console.log(response.checkins.data[0].place.location.longitude);
            long = response.checkins.data[0].place.location.longitude;
            console.log(long);
            // loading the informations of friends who have the checkins information
            div = $('<div>').appendTo('#friends');
            div.addClass(response.gender);
            $('<img>').attr('src', 'https://graph.facebook.com/' + fid + '/picture').appendTo(div);
            imageEvent = 'https://graph.facebook.com/' + fid + '/picture';
            console.log(imageEvent);
            //only for cheacking the location coordinates
            // var locDiv = "<div id='location'>" + lat + "," + long + "</div>";
            // div.append(locDiv);
            var link = $('<a>');
            link.attr('href', response.link);
            link.attr('target', '_blank');
            link.text(response.name);
            div.append(link);
            friendsName = response.name;
            console.log(friendsName);


            if (response.location) {
                div.append(" is living at " + response.location.name);
            }


            if (response.statuses && response.statuses.data.length > 0) {
                $.each(response.statuses.data, function(i, e) {
                    $('<div>').addClass('status').text(e.message).appendTo(div);
                });
            } else {
                div.append(" is boring friend :(");
            }

            if (response.events && response.events.data.length > 0) {
                $.each(response.events.data, function(i, e) {
                    div.append(e.name);
                });
            }
            console.log("--> loading marker");
            //for creating the marker on the map with the lat long value with title and icon
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(lat), parseFloat(long)),
                map: map,
                title: friendsName,
                icon: imageEvent

            });

            //store markers
            markersArray.push(marker);

        } else {
            console.log("array empty!");
        }



        $(div).click(function() {


            //console.log("clicked element with image: ", $(this).find("img"));
            //console.log("clicked element: ", $(this).find("div"));
            stopBouncing(); // remove bouncing of other objects
            marker.setAnimation(google.maps.Animation.BOUNCE);

            //get coordinates from marker
            console.log("marker data", marker.position);
            console.log("my marker latitude", marker.position.$a);
            console.log("my marker longitude", marker.position.ab);
            // set center point of the map to marker
            // zoom in with specific magnitude
            map.setZoom(10);
            map.setCenter(marker.position);
            
        }).hover(

        function() {
            $(this).css('background', '#ff00ff');
        }, function() {
            $(this).css('background', '');
        });

    });
}
//for making div element clickable
//var myDiv = document.getElementById('#friends');

function load() {
    FB.api('/me', function(response) {
        $('#status').text("Hello " + response.name + "!");
    });

    FB.api('/me/friends', {
        limit: 15 //although the limit is 20 we are only loading with checkins value
    }, function(response) {
        $.each(response.data, function(i, e) {
            loadFriend(e.id);
        });
    });

}

FB.init({
    appId: '237054969827928'
});
//this part is for google maps api
// window's load event happens when everything is loaded in the page

function loadMap() {
    var mapOptions = {
        //center: new google.maps.LatLng(60.18, 24.95),
        center: new google.maps.LatLng(35.746512, -39.462891),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

FB.login(function(response) {
    if (response.authResponse) {
        loadMap();
        load();
    } else {
        // not logged in
    }

}, {
    scope: 'friends_location, friends_status, friends_events'
});
//$(function() {...}); is used,which cause the code inside to run only after the <body> tag has finished loading.
$(function() {
 
$("#button").click(function() {
        //console.log("Sucessfuly looged out ");
/* var r ="";
        confirm('Do you really want to logOut?', 'Confirmation Dialog', function(r) {
            alert('Confirmed: ' + r, 'Confirmation Results');
            
        });*/
        FB.logout();
        alert('You are going to logOut', 'Alert Dialog');
        FB.logout();
    });

	
	
$("#btn").click(function() {

function loadFriends(user) {
  var t = $('#friends').empty();
  
  FB.api('/' + user + '/friends', function (response) {
    $.each(response.data, function (i, e) {
      var d = $('<div>').appendTo(t);
      $('<img>').attr('src', 'http://graph.facebook.com/' + e.id + '/picture').appendTo(d);
      d.append(e.name);
    });
  });
  
  }

});

});