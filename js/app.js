// --- Initial Location Data.
var initLocations = [
  {
    name: 'Doobys',
    lat: 39.298811,
    lng: -76.615898
  },
  {
    name: 'Park Cafe',
    lat: 39.308889,
    lng: -76.625599
  },
  {
    name: 'Mt. Royal Tavern',
    lat: 39.306803,
    lng: -76.620491
  },
  {
    name: 'On The Hill',
    lat: 39.308437,
    lng: -76.623762
  },
  {
    name: 'The Bun Shop',
    lat: 39.300623,
    lng: -76.619562
  },
  {
    name: 'Station North Arts Cafe',
    lat: 39.310422,
    lng: -76.616725
  }

];

// --- Global Variables.
var map;
var ClientID;
var ClientSecret;

// --- View Model.
function AppViewModel() {

  // Setting This
  var self = this

  // Declaring Observables
  self.locationInput = ko.observable("");

  self.locationList = ko.observableArray([]);

  // Foursquare ClientID && ClientSecret
  ClientID = "ISJFZIOWGYDLS0TDOJBS1RTPJPM4RDYRHO30DHZGUWICMTNN";
  ClientSecret = "Y1QAZNCN1Q3AAUBB2KZU0ZOSLO3UKMBLORWV5M5BXW33X4YF";

  // Initial Map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.305, lng: -76.617},
    zoom: 16
  });

  // Map Handler
  initLocations.forEach(function(locationItem) {
    self.locationList.push(new Location(locationItem));
  });

  // List
  self.filteredList = ko.computed(function () {
    var filter = self.locationInput().toLowerCase();

    if (!filter) {
      self.locationList().forEach(function(locationItem) {
        locationItem.visible(true);
      });
      return self.locationList();
  } else {
    return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
      var string = locationItem.name.toLowerCase();
      var result = (string.search(filter) >= 0);
      locationItem.visible(result);
      return result;
    });
    }
  }, self);
  self.mapElem = document.getElementById('map');
  self.mapElem.style.height = window.innerHeight - 50;
}

// --- Location information and foursquare URLJSON.
var Location = function(data) {

  // Setting Self
  var self = this;
  self.name = data.name;
  self.lat = data.lat;
  self.lng = data.lng;
  self.URL = "";
  self.street = "";
  self.city = "";
  self.phone = "";
  self.visible = ko.observable(true);

  // Foursquare URL
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + ClientID + '&client_secret=' + ClientSecret + '&v=20160118' + '&query=' + this.name;

  // Foursquare JSON
  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.URL = results.url;
    if (typeof self.URL === 'undefined') {
      self.URL = "";
    }
    self.street = results.location.formattedAddress[0];
    self.city = results.location.formattedAddress[1];
  }).fail(function() {
    alert("There was a problem loading the Foursquare API. Check your connection.")
  });

  // Click
  this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + '</b></div>' +
  '<div class="content"><a href="' + self.URL +'">' + self.URL + '</a></div>' +
  '<div class="content">' + self.street + '</div>' +
  '<div class="content">' + self.city + '</div>';

  // Infowindow
  this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

  // Marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lat, data.lng),
    title: data.name,
    map: map
  });

  // Show Marker
  this.showMarker = ko.computed(function() {
    if(self.visible() === true) {
      self.marker.setMap(map);
    } else {
      self.marker.setMap(null);
    }
    return true;
  }, self);

  self.marker.addListener('click', function(){
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
    '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
    '<div class="content">' + self.street + "</div>" +
    '<div class="content">' + self.city + "</div>";

  self.infoWindow.setContent(self.contentString);
    self.infoWindow.open(map, this);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);
	});

	self.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};

// --- Initalize Application.
function initApp() {
  ko.applyBindings(new AppViewModel());
}

// --- Error Handler.
function errorHandler() {
  alert("Something has gone wrong, please check your connection and try again.")
}
