var views = {
	L.Map = L.Map.extend({
		openPopup: function(popup) {
			this._popup = popup;

			return this.addLayer(popup).fire("popupopen", {
				popup: this._popup
			});
		}
	});

	settingsView: {
		bitsInput: $("#bitsInput"),
		bitsLabel: $("#bitsOutput"),
		bboxOption: $("#bboxOption"),

		setBits: function(bits) {
			this.bitsLabel.text(bits);
		},
		
		setBBoxOption: function(option) {
			this.bboxOption.attr("checked", option);
		},

		setChangeListener: function(listener) {
			this.bitsInput.on("change", function() {
				listener.onBitsChanged(this.bitsInput.val());
			});
			this.bboxOption.on("change", function() {
				listener.onBBoxOptionChanged(this.bboxOption.attr("checked"));
			});
		}
	},
	
	mapView: {
		map: L.map("map"),
		marker: null,
		bbox: null,
		bboxPoints: L.layerGroup(),

		pointAsString: function(point) {
			return "(" + point.lat + ", " + point.lng + ")";
		},

		moveMarkerTo: function(point) {
			if (null == this.marker) {
				this.marker = L.marker(point).addTo(this.map);
				this.marker.bindPopup(this.pointAsString(point));
				
				var self = this;
				this.marker.on("mouseover", e => self.marker.openPopup());
				this.marker.on("mouseout", e => self.marker.closePopup());
			} else {
				this.marker.setLatLng(point)
					.setPopupContent(this.pointAsString(point))
					.update();
			}
		},

		drawMap: function(mapOptions) {
			this.map.setView(mapOptions.center, mapOptions.zoom);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(this.map);
		},

		setChangeListener: function(listener) {
			this.map.on("click", ev => listener.onPointChanged(ev.latlng));
		},

		showHint: function(hint, point) {
			L.popup({maxWidth: 200})
				.setLatLng(point)
				.setContent(hint)
				.openOn(view.map);
		},
		
		createBBoxPoint: function(point) {
			return L.circleMarker(point, {radius: 5, color: "#7D0F33"});
		},

		showBBoxPointsInfo: function(bbox) {
			// TODO: move variable to controller
			var points = [
				L.latLng(0.5*(bbox.minLat + bbox.maxLat), 0.5*(bbox.minLng + bbox.maxLng)),
				L.latLng(bbox.minLat, bbox.minLng),
				L.latLng(bbox.minLat, bbox.maxLng),	
				L.latLng(bbox.maxLat, bbox.maxLng),
				L.latLng(bbox.maxLat, bbox.minLng)i
			];

			for (var i = 0; i < 5; i++) {
				this.bboxPoints.addLayer(this.createBBoxPoint(points[i]));
			}
			
			var self = this;
			this.map.addLayer(this.bboxPoints);
			this.bboxPoints.eachLayer(layer => {
				layer.bindPopup(self.pointAsString(layer.getLatLng()));
				layer.openPopup();
			});
		},

		hideBBoxPointsInfo: function() {
			this.bboxPoints.eachLayer(layer => {
				layer.closePopup();
				layer.unbindPopup();
			});
			this.bboxPoints.clearLayers();
			this.map.removeLayer(this.bboxPoints);
		},

		drawBBox: function(bbox) {
			var bounds = [[bbox.minLat, bbox.minLng], [bbox.maxLat, bbox.maxLng]];
			if (null == this.bbox) {
				this.bbox = L.rectangle(bounds, {color: "#EC3F0F", fillOpacity: 0.25, weight: 2});

				var self = this;
				this.bbox.on("mouseover", e => self.showBBoxPointsInfo(bbox));
				this.bbox.on("mouseout", e => self.hideBBoxPointsInfo());
			} else {
				this.bbox.setBounds(bounds);
			}
			this.map.fitBounds(bounds);
		},

		clearBBox: function() {
			this.map.removeLayer(this.bbox);
		}
	},

	geohashInfoView: {
		hashLabel: $("#hashLabel"),

		setBinaryValue: function(value) {
			this.hashLabel.text(value);
		}
	}
};
