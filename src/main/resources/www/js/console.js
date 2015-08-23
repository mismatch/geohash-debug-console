(function(debugParams) {

	var view = {
		map: L.map("map"),
		marker: null,
		bitsControl: {
			input: $("#bitsInput"),
			label: $("#bitsOutput")
		},
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

		onBitsChanged: function() {
			debugParams.bits = view.bitsControl.input.val();
			view.bitsControl.label.text(debugParams.bits);
			controller.requestHashData();
		},

		requestHashData: function() {
			$.getJSON("/hashes/point?" + $.param(debugParams), controller.whenHashReceived);
		},

		whenHashReceived: function(hashData) {
			view.debugLine.hashLabel.text(hashData.binary);
		},

		setMarker: function(point) {
			view.marker = L.marker(point).addTo(view.map);
		},

		updateMarker: function(point) {
			view.marker.setLatLng(point).update();
		},

		updatePointLabel: function(point) {
			view.debugLine.pointLabel.text("(" + point.lat + ", " + point.lng + ")");
		},

		initMap: function(center) {
			view.map.setView(center, 12);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(view.map);
			view.map.on('click', controller.onLocationChange);
		},

		initBitsControl: function() {
			view.bitsControl.label.text(debugParams.bits);
			view.bitsControl.input.val(debugParams.bits);
			view.bitsControl.input.on('change', controller.onBitsChanged);
		},

		initView: function() {
			var mapCenter = [debugParams.lat, debugParams.lng];

			controller.initMap(mapCenter);
			controller.setMarker(mapCenter);
			controller.initBitsControl();

			controller.onLocationChange({latlng: debugParams});
		}
	};

	controller.initView();

})({lat:49.977, lng: 20.027, bits: 32});
