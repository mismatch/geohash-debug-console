(function(debugParams) {

	var view = {
		map: L.map("map"),
		marker: null,
		hashBounds: null,
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
			controller.setHashBounds(hashData.bbox)
		},

		setHashBounds: function(bbox) {
			var bounds = [[bbox.minLat, bbox.minLng], [bbox.maxLat, bbox.maxLng]];
			if (null == view.hashBounds) {
				view.hashBounds = L.rectangle(bounds, {color: "#D8C358", fillOpacity: 0.75, weight: 1});
				view.hashBounds.addTo(view.map);
			} else {
				view.hashBounds.setBounds(bounds);
			}
			view.map.fitBounds(bounds);
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

})({lat:50.0675, lng: 19.925, bits: 24});
