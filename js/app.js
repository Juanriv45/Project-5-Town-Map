
  var locationModel = ko.observableArray([
    {lat:32.782877,
     lang:-96.783548,
     name: "Angry Dog",
     show : ko.observable(true)
    },
    {lat:32.772802,
     lang:-96.831495,
     name: "Chicken Scratch",
     show : ko.observable(true)
    },
    {lat:32.842388,
     lang:-96.772196,
     name: "Twisted Root",
     show : ko.observable(true)
    }
  ]);

var markers = ko.observableArray();
var availablePlace = ko.observableArray([]);
var map = new google.maps.Map(document.getElementById('map-canvas'));

function ViewModel() {
  var self = this;
  self.locationData = locationModel;
  self.filter = ko.observableArray("");


  function initialize() {


    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

    for (var i in self.locationData()) {
      var p = self.locationData()[i];
      var latlng = new google.maps.LatLng(p.lat, p.lang);
      bounds.extend(latlng);
      createMapMarker(p);
      console.log(p);

      function createMapMarker (p){ //this function is to diplay Markers on Google Map for each data in model


        availablePlace.push(p);
        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
          map: map,
          position: latlng,
          title: p.name
        });

        markers().push(marker); //save the markers in array

        // infoWindows are the little helper windows that open when you click on Google Map

        var infoWindow = new google.maps.InfoWindow({
          content: p.name + '<br><p style="text-align:center"><b>Congrats!!</b></p>'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });
      };
    };
    map.fitBounds(bounds);
  };
  google.maps.event.addDomListener(window, 'load', initialize);

  function setAllMap(map) { //saves the map markers in array
    for (var i = 0; i < markers().length; i++) {
    markers()[i].setMap(map);
    };
  };

  function filter_twoArrays(filtered,map_markers){
    var i=0, j=0;
    setAllMap(null);
    for(i=0; i<map_markers.length; i++){
      var FLAG = 0;
      for(j=0; j<filtered.length;j++){
        if (filtered[j].name == map_markers[i].title){
        map_markers[i].setMap(map);
      };
    };
  };
  return (map_markers)
  };

  popo =  function(){
    if(this.filter().length > 0){
      var arr;

      for(item in availablePlace()){ //display off on all listed view
        availablePlace()[item].show(false)
      };

      arr = $.grep(availablePlace(), function(n){ //arr is what is going to displayed in listview
        return (n.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1);
      })

      console.log(arr)

      filter_twoArrays(arr,markers());

      for(item in arr){ //what is left after filtering out, turn them on display
        arr[item].show(true);
      };
    } else {
      setAllMap(map)
      for (item in availablePlace()){
        availablePlace()[item].show(true)
      };
    };
  };
};
// Activates knockout.js
ko.applyBindings(new ViewModel());
