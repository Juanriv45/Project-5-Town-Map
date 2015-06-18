///Data for where then major Dallas sports teams play
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
    // create markers for each of the locations
    function createMarker(p){
      self.availablePlace.push(p);
      var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        title: p.name
      });
      //markers are pushed into an array
      markers.push(marker);
      //creates infowindow for each marker & the Wikipedia API request
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
        map.setCenter(marker.position);
        var wikiData;
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + p.name + '&format=json&callback=wikiCallback';
        //If there is an error, an error message will be created
        var wikiRequestTimeout = setTimeout(function() {
          wikiData = "Failed to get wikipedia resources";
        }, 8000);
        $.ajax({
          url: wikiUrl ,
          dataType:"jsonp",
          success: function (response) {
            var articleList = response[1];
            for (var i = 0; i < 3 ; i++) {
              var articleStr = articleList[i];
              var url = 'http://en.wikipedia.org/wiki/' + articleStr;
              infoWindow.setContent(p.name +='<li><a href="' + url + '">'+ articleStr + '</a></li>');
            }
            clearTimeout(wikiRequestTimeout);
          }
        });
      });
    }
    var bounds = new google.maps.LatLngBounds();

    for (i=0; i < self.locationData().length; i++) {
      var p = self.locationData()[i];
      var latlng = new google.maps.LatLng(p.lat, p.lang);
      bounds.extend(latlng);
      createMarker(p);

      var infoWindow = new google.maps.InfoWindow({
      });
    }
    map.fitBounds(bounds);
  }
  google.maps.event.addDomListener(window, 'load', initialize);
  //adds all markers back
  function resetMap(map) {
    for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    }
  }
  //compares the filtered data with the marker data in order to see which markers should be shown
  function filter_twoArrays(filtered,map_markers){
    var i=0, j=0;
    resetMap(null);
    for(i=0; i<map_markers.length; i++){
      for(j=0; j<filtered.length;j++){
        if (filtered[j].name == map_markers[i].title){
        map_markers[i].setMap(map);
      }
    }
  }
  return (map_markers);
  }
  //this function will adjust the view to show only what is filtered
  filterAll =  function(){
    if(this.filter().length > 0){
      var arr;

      for (i = 0; i < self.availablePlace().length; i++) {
        self.availablePlace()[i].show(false);
      }

      arr = $.grep(self.availablePlace(), function(n){
        return (n.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1);
      });

      filter_twoArrays(arr,markers);
      //what is left after filtering out will be displayed and the request for the wikipedia API is activated.
      for (i = 0; i < arr.length; i++) {
        arr[i].show(true);
      }
    } else {
      resetMap(map);
      for (i = 0; i < self.availablePlace().length; i++){
        self.availablePlace()[i].show(true);
      }
    }
  };
}
// Activates knockout.js
ko.applyBindings(new ViewModel());
