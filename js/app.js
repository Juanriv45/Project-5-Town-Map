
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

var markers = ko.observableArray();
var availablePlace = ko.observableArray();
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
          content: p.name + '<p class="wikiData1">xxxx</p>'
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
////////////////
  //Wikipedia API Request
for (i=0; i < locationModel().length; i++){
  locationModel()[i].wikiRequest = function(){
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.name + '&format=json&callback=wikiCallback'
        console.log(this.name);
        var wikiRequestTimeout = setTimeout(function() {
            $('.wikiData').text("Failed to get wikipedia resources");
        }, 8000);
        $.ajax( {
            url: wikiUrl ,
            dataType:"jsonp",
            //jsonp: "callback",
            success: function (response) {
                var articleList = response[1];
                for (var i = 0; i < 3 ; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    $('.wikiData').append('<li><a href="' + url + '">'+ articleStr + '</a></li>');
                };
                clearTimeout(wikiRequestTimeout);
            }
        } );
      };
    };
//////////////////////
  popo =  function(){
    if(this.filter().length > 0){
      var arr;

      for(item in availablePlace()){ //display off on all listed view
        availablePlace()[item].show(false)
        $(".wikiData" ).empty();
      };

      arr = $.grep(availablePlace(), function(n){ //arr is what is going to displayed in listview
        return (n.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1);
      })

      console.log(arr)

      filter_twoArrays(arr,markers());

      for(item in arr){ //what is left after filtering out, turn them on display
        arr[item].show(true);
        arr[item].wikiRequest();
      };
    } else {
      setAllMap(map)
      $(".wikiData" ).empty();
      for (item in availablePlace()){
        availablePlace()[item].show(true)
      };
    };
  };
};
// Activates knockout.js
ko.applyBindings(new ViewModel());
