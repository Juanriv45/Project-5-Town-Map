

var dallas = new google.maps.LatLng(32.7815617,-96.7928802);

var LocationDatas = [
    { name:"Angry Dog",
      LatLng: new google.maps.LatLng(32.782877,-96.783548)
    },
    { name:"Chicken Scratch",
      LatLng: new google.maps.LatLng(32.772802,-96.831495)
    },
    { name:"Twisted Root Burger Co",
      LatLng: new google.maps.LatLng(32.842388,-96.772196)
    }
];

var LocationData = [
    [32.782877,-96.783548, "Angry Dog" ],
    [32.772802,-96.831495, "Chicken Scratch" ],
    [32.842388,-96.772196, "Twisted Root" ]
];

function initialize() {

  var map = new google.maps.Map(document.getElementById('map-canvas'));
  var bounds = new google.maps.LatLngBounds();
  var infowindow = new google.maps.InfoWindow();

  for (var i in LocationData) {
    var p = LocationData[i];
    var latlng = new google.maps.LatLng(p[0], p[1]);
    bounds.extend(latlng);

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: p[2]
    });

    $(document).ready( function() {
      $('#locationsList').append('<li class="list-group-item">'+ LocationData[i][2] + '</li>');
    });


    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(this.title);
      infowindow.open(map, this);
    });
  }
  map.fitBounds(bounds);
}
google.maps.event.addDomListener(window, 'load', initialize);

