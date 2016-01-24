(function(debugParams) {

	L.Map = L.Map.extend({
		openPopup: function(popup) {
			this._popup = popup;

			return this.addLayer(popup).fire('popupopen', {
				popup: this._popup
			});
		}
	});

	var view = {
		map: L.map("map"),
		marker: null,
		hashBBox: null,
		hashBBoxPoints: null,
		bboxOption: $("#bboxOption"),
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

		onBBoxOptionChange: function() {
			debugParams.withBBox = view.bboxOption.attr("checked");
			controller.requestHashData();
		},

		requestHashData: function() {
			$.getJSON("/hashes/point?" + $.param(debugParams), controller.whenHashReceived);
		},

		whenHashReceived: function(hashData) {
			view.debugLine.hashLabel.text(hashData.binary);
			if (hashData.bbox) {
				controller.setBBoxPoints(hashData.bbox);
				controller.setHashBounds(hashData.bbox);
				if (!controller.isBBoxOnMap()) {
					view.map.addLayer(view.hashBBox);
				}
			} else if (controller.isBBoxOnMap()) {
				view.map.removeLayer(view.hashBBox);
			}
		},

		isBBoxOnMap: function() {
			return view.map.hasLayer(view.hashBBox);
		},

		setHashBounds: function(bbox) {
			var bounds = [[bbox.minLat, bbox.minLng], [bbox.maxLat, bbox.maxLng]];
			if (null == view.hashBBox) {
				view.hashBBox = L.rectangle(bounds, {color: "#EC3F0F", fillOpacity: 0.25, weight: 2});
				view.hashBBox.on("mouseover", e => controller.showBBoxPointsInfo());
				view.hashBBox.on("mouseout", e => controller.hideBBoxPointsInfo());
			} else {
				view.hashBBox.setBounds(bounds);
			}
			view.map.fitBounds(bounds);
		},

		showBBoxPointsInfo: function() {
			view.map.addLayer(view.hashBBoxPoints);
			view.hashBBoxPoints.eachLayer(layer => {
				layer.popup.setContent(controller.pointAsString(layer.getLatLng()));
				layer.openPopup();
			});
		},

		hideBBoxPointsInfo: function() {
			view.hashBBoxPoints.eachLayer(layer => layer.closePopup());
			view.map.removeLayer(view.hashBBoxPoints);
		},

		setBBoxPoints: function(bbox) {
			var self = controller;
			if (null == view.hashBBoxPoints) {
				view.hashBBoxPoints = L.layerGroup([
					self.createBBoxPoint(bbox, 
						bbox => L.latLng(0.5*(bbox.minLat + bbox.maxLat), 0.5*(bbox.minLng + bbox.maxLng))),
					self.createBBoxPoint(bbox, bbox => L.latLng(bbox.minLat, bbox.minLng)),
					self.createBBoxPoint(bbox, bbox => L.latLng(bbox.minLat, bbox.maxLng)),
					self.createBBoxPoint(bbox, bbox => L.latLng(bbox.maxLat, bbox.maxLng)),
					self.createBBoxPoint(bbox, bbox => L.latLng(bbox.maxLat, bbox.minLng))]);
			} else {
				view.hashBBoxPoints.eachLayer(layer => layer.setLatLng(layer.locate(bbox)));
			}
		},

		createBBoxPoint: function(bbox, locationFunc) {
			var bboxPoint = L.circleMarker(locationFunc(bbox), {radius: 5, color: "#7D0F33"});
			bboxPoint.locate = locationFunc;
			view.bindEmptyPopup(bboxPoint);
			return bboxPoint;
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

		initBBoxOption: function() {
			view.bboxOption.on('change', controller.onBBoxOptionChange);
		},

		initView: function() {
			var mapCenter = [debugParams.lat, debugParams.lng];

			controller.initMap(mapCenter);
			controller.setMarker(mapCenter);
			controller.initBitsControl();
			controller.initBBoxOption();

			controller.onLocationChange({latlng: debugParams});
		}
	};

	controller.initView();

})({lat:50.0675, lng: 19.925, bits: 24});
