

var dallas = new google.maps.LatLng(32.7815617,-96.7928802);

var locations = [
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

var marker;
var map;

function initialize() {
  var mapOptions = {
    zoom: 12,
    center: dallas
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

for (i = 0; i < locations.length; i++) {
  marker = new google.maps.Marker({
    map:map,
    draggable:false,
    animation: google.maps.Animation.DROP,
    position: locations[i].LatLng
  });
}
  google.maps.event.addListener(marker, 'click', toggleBounce);
}

function toggleBounce() {

  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
google.maps.event.addDomListener(window, 'load', initialize);

