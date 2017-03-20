// --- Initial Location Data.
var initLocations = [
  {
    name: 'Doobys',
    lat: 39.298811,
    long: -76.615898
  },
  {
    name: 'Park Cafe',
    lat: 39.308889,
    long: -76.625599
  },
  {
    name: 'Mt. Royal Tavern',
    lat: 39.306803,
    long: -76.620491
  },
  {
    name: 'On The Hill',
    lat: 39.308437,
    long: -76.623762
  },
  {
    name: 'The Bun Shop',
    lat: 39.300623,
    long: -76.619562
  },
  {
    name: 'Station North Arts Cafe',
    lat: 39.310422,
    long: -76.616725
  }

];

// --- Global Variables.
var ClientID;
var ClientSecret;
var map;

// --- View Model.
function AppViewModel() {

  // Setting Self
  var self = this

  // Declaring Observables
  this.locationInput = ko.observable("");

  this.locationList = ko.observablearray([]);

  // Foursquare ClientID && ClientSecret
  ClientID = "ISJFZIOWGYDLS0TDOJBS1RTPJPM4RDYRHO30DHZGUWICMTNN";
  ClientSecret = "Y1QAZNCN1Q3AAUBB2KZU0ZOSLO3UKMBLORWV5M5BXW33X4YF";

  // Initial Map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.305, long: -76.617},
    zoom: 25
  }):

  // Map Handler
  initLocations.forEach(function(locationItem) {
    self.locationList.push( new Location(locationItem));
  });

  this.filteredList = ko.computed(function () {
    var filter = self.locationInput().toLowerCase();

    if (!filter) {
      self.locationList().forEach(function(locationItem) {
        locationItem.visible(true);
      });
      return.self(locationList);
  } else {
    return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
      var string = locationItem.name.toLowerCase();
      var result = (string.search(filter) >= 0);
      locationItem.visible(result);
      return result;
    });
    }
  }, self);
  this.mapElem = document.getElementById('map');
  this.mapElem.style.height = window.innerHeight - 50;
}

// --- Location information and foursquare URL/JSON.
var location = function(data) {
  
  // Setting Self
  var self = this;
  this.name = data.name;
  this.lat = data.lat;
  this.long = data.long;
  this.URL = "";
  this.street = "";
  this.city = "";
  this.phone = "";
  this.visible = ko.observable(true);

  // Foursquare URL
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;

  // Foursquare JSON
  $get.JSON(foursquareURL).done(function(data) {
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
  '<div class="content">' + self.city + '</div>' +;

  // Infowindow
  this.infowindow = new google.maps.InfoWindow({content = self.contentString});

  // Marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lat, data.long),
    title: data.name,
    map: map
  })

  // Show Marker
  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);
}

// --- Initalize Application.
function InitializeApplication() {
  ko.applybindings(new AppViewModel());
}

// --- Error Handler.
function ErrorHandler() {
  alert("Something has gone wrong, please check your connection and try again.")
}
