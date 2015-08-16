(function() {
	var map = L.map('map').setView([49.977, 20.027], 12);
	var marker = null;
	map.on('click', onMapClick);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

	function onMapClick(e) {
		var coords = e.latlng;
		if (null == marker) {
			marker = L.marker(coords).addTo(map);
		} else {
			marker.setLatLng(coords).update();
		}

		$("#point").text("(" + coords.lat + ", " + coords.lng + ")");
		
		$.getJSON("/hashes/point?bits=32&lat=" + coords.lat + "&lng=" + coords.lng, 
				function(data) {
					$("#geohash").text(data.geohash);
				});
	}
})();
