(function(debugParams) {

	var view = {
		map: L.map("map"),
		marker: null,
		hashBounds: null,
		hashBoundsCenter: null,
		bitsControl: {
			input: $("#bitsInput"),
			label: $("#bitsOutput")
		},
		debugLine: {
			hashLabel: $("#hashLabel")
		},

		bindEmptyPopup: function(marker) {
			marker.popup = L.popup();
			marker.bindPopup(marker.popup);
		}
	};

	var controller = {
		onLocationChange: function(ev) {
			var point = ev.latlng;
			debugParams.lat = point.lat;
			debugParams.lng = point.lng;

			controller.updateMarker(point);
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
			controller.setHashBounds(hashData.bbox);
			controller.setHashBoundsCenter(hashData.bbox);
		},

		setHashBounds: function(bbox) {
			var bounds = [[bbox.minLat, bbox.minLng], [bbox.maxLat, bbox.maxLng]];
			if (null == view.hashBounds) {
				view.hashBounds = L.rectangle(bounds, {color: "#EC3F0F", fillOpacity: 0.25, weight: 2});
				view.hashBounds.addTo(view.map);
			} else {
				view.hashBounds.setBounds(bounds);
			}
			view.map.fitBounds(bounds);
		},
		
		setHashBoundsCenter: function(bbox) {
			var center = L.latLng(0.5*(bbox.minLat + bbox.maxLat), 0.5*(bbox.minLng + bbox.maxLng));
			if (null == view.hashBoundsCenter) {
				view.hashBoundsCenter = L.circleMarker(center, {radius: 5, color: "#7D0F33"});
				view.bindEmptyPopup(view.hashBoundsCenter);
				view.hashBoundsCenter.on("mouseover", function(e) {view.hashBoundsCenter.openPopup();});
				view.hashBoundsCenter.on("mouseout", function(e) {view.hashBoundsCenter.closePopup();});
				view.map.addLayer(view.hashBoundsCenter);
			} else {
				view.hashBoundsCenter.setLatLng(center);
			}
			view.hashBoundsCenter.popup.setContent(controller.pointAsString(center));
		},

		setMarker: function(point) {
			view.marker = L.marker(point).addTo(view.map);
			view.marker.bindPopup(controller.pointAsString(point));
			view.marker.on("mouseover", function(e) {view.marker.openPopup();});
			view.marker.on("mouseout", function(e) {view.marker.closePopup();});
		},

		updateMarker: function(point) {
			view.marker.setLatLng(point).setPopupContent(controller.pointAsString(point)).update();
		},

		pointAsString: function(point) {
			return "(" + point.lat + ", " + point.lng + ")";
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
