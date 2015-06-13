//Data for where then major Dallas sports teams play
  var locationModel = ko.observableArray([
    {lat: 32.747284,
     lang:-97.094494,
     name: "Dallas Cowboys",
     show : ko.observable(true)
    },
    {lat:32.791536,
     lang:-96.810381,
     name: "Dallas Mavericks",
     show : ko.observable(true)
    },
    {lat:32.751271,
     lang:-97.082451,
     name: "Texas Rangers",
     show : ko.observable(true)
    }
  ]);

var markers = [];
var map = new google.maps.Map(document.getElementById('map-canvas'));

function ViewModel() {

  var self = this;
  self.locationData = locationModel;
  self.filter = ko.observableArray();
  self.availablePlace = ko.observableArray();
  function initialize() {

    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

    for (var i in self.locationData()) {
      var p = self.locationData()[i];
      var latlng = new google.maps.LatLng(p.lat, p.lang);
      bounds.extend(latlng);
      createMarker(p);

      var infoWindow = new google.maps.InfoWindow({
      });

// create markers for each of the locations
      function createMarker (p){
        self.availablePlace.push(p);
        var marker = new google.maps.Marker({
          map: map,
          position: latlng,
          title: p.name
        });
//markers are pushed into an array
        markers.push(marker);
//creates infowindow for each marker
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
          infoWindow.setContent(p.name);
        });
      };
    };
    map.fitBounds(bounds);
  };
  google.maps.event.addDomListener(window, 'load', initialize);

//adds all markers back
  function resetMap(map) {
    for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    };
  };
//compares the filtered data with the marker data in order to see which markers should be shown
  function filter_twoArrays(filtered,map_markers){
    var i=0, j=0;
    resetMap(null);
    for(i=0; i<map_markers.length; i++){
      for(j=0; j<filtered.length;j++){
        if (filtered[j].name == map_markers[i].title){
        map_markers[i].setMap(map);
      };
    };
  };
  return (map_markers)
  };

//Wikipedia API Request
  for (i=0; i < locationModel().length; i++){
    locationModel()[i].wikiRequest = function(){
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.name + '&format=json&callback=wikiCallback'
      console.log(this.name);
//If there is an error, an error message will be created
      var wikiRequestTimeout = setTimeout(function() {
          $('.wikiData').text("Failed to get wikipedia resources");
        }, 8000);
      $.ajax({
        url: wikiUrl ,
        dataType:"jsonp",
        success: function (response) {
          var articleList = response[1];

          for (var i = 0; i < 3 ; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $('.wikiData').append('<li><a href="' + url + '">'+ articleStr + '</a></li>');
          };
          clearTimeout(wikiRequestTimeout);
        }
      });
    };
  };
//this function will adjust the view to show only what is filtered
  filterAll =  function(){
    if(this.filter().length > 0){
      var arr;

      for(item in self.availablePlace()){
        self.availablePlace()[item].show(false)
        $(".wikiData").empty();
      };

      arr = $.grep(self.availablePlace(), function(n){
        return (n.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1);
      })

      console.log(arr)

      filter_twoArrays(arr,markers);
//what is left after filtering out will be displayed and the request for the wikipedia API is activated.
      for(item in arr){
        arr[item].show(true);
        arr[item].wikiRequest();
      };
    } else {
      resetMap(map)
      $(".wikiData").empty();
      for (item in self.availablePlace()){
        self.availablePlace()[item].show(true)
      };
    };
  };
};
// Activates knockout.js
ko.applyBindings(new ViewModel());
