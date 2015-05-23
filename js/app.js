
  var Locations = ko.observableArray([
    {lat:32.782877, lang:-96.783548, name: "Angry Dog"},
    {lat:32.772802, lang:-96.831495, name: "Chicken Scratch"},
    {lat:32.842388, lang:-96.772196, name: "Twisted Root"}
  ]);


function ViewModel() {
  var self = this;
  self.LocationData = Locations;

  function initialize() {

    var map = new google.maps.Map(document.getElementById('map-canvas'));
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

    for (var i in Locations()) {
      var p = Locations()[i];
      var latlng = new google.maps.LatLng(p.lat, p.lang);
      bounds.extend(latlng);

      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: p.name
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        infowindow.open(map, this);
      });
    }
    map.fitBounds(bounds);
  }
  google.maps.event.addDomListener(window, 'load', initialize);
};
// Activates knockout.js
ko.applyBindings(new ViewModel());
