(function(debugParams) {

	var view = {
		map: L.map("map"),
		marker: null,
		debugLine: {
			pointLabel: $("#pointLabel"),
			hashLabel: $("#hashLabel")
		}
	};

	var controller = {
		onLocationChange: function(ev) {
			var point = ev.latlng;
			debugParams.lat = point.lat;
			debugParams.lng = point.lng;

			controller.updateMarker(point);
			controller.updatePointLabel(point);
			controller.requestHashData();
		},

		requestHashData: function() {
			$.getJSON("/hashes/point?" + $.param(debugParams), controller.whenHashReceived);
		},

		whenHashReceived: function(hashData) {
			view.debugLine.hashLabel.text(hashData.geohash);
		},

		updateMarker: function(point) {
			view.marker.setLatLng(point).update();
		},

		updatePointLabel: function(point) {
			view.debugLine.pointLabel.text("(" + point.lat + ", " + point.lng + ")");
		},

		initView: function() {
			var mapCenter = [debugParams.lat, debugParams.lng];
			view.map.setView(mapCenter, 12);
			view.marker = L.marker(mapCenter).addTo(view.map);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(view.map);
			view.map.on('click', controller.onLocationChange);
			controller.onLocationChange({latlng: debugParams});
		}
	};

	controller.initView();

})({lat:49.977, lng: 20.027, bits: 32});
