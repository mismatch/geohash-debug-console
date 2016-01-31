L.Map = L.Map.extend({
	openPopup: function(popup) {
		this._popup = popup;

		return this.addLayer(popup).fire("popupopen", {
			popup: this._popup
		});
	}
});

var views = {

	settingsView: {
		bitsInput: $("#bitsInput"),
		bitsLabel: $("#bitsOutput"),
		bboxOption: $("#bboxOption"),

		updateBitsLabel: function(bits) {
			this.bitsLabel.text(bits);
		},
		
		setChangeListener: function(listener) {
			var self = this;
			this.bitsInput.on("change", function() {
				listener.onBitsChanged(self.bitsInput.val());
			});
			this.bboxOption.on("change", function() {
				listener.onBBoxOptionChanged(self.bboxOption.attr("checked"));
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
				.openOn(this.map);
		},
		
		createBBoxPoint: function(point) {
			return L.circleMarker(point, {radius: 5, color: "#7D0F33"});
		},

		showBBoxPointsInfo: function() {
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
			this.map.removeLayer(this.bboxPoints);
		},

		drawBBox: function(bounds, points) {
			if (null == this.bbox) {
				this.bbox = L.rectangle(bounds, {color: "#EC3F0F", fillOpacity: 0.25, weight: 2});

				var self = this;
				this.bbox.on("mouseover", e => self.showBBoxPointsInfo());
				this.bbox.on("mouseout", e => self.hideBBoxPointsInfo());
			} else {
				this.bbox.setBounds(bounds);
			}

			if (!this.map.hasLayer(this.bbox)) {
				this.map.addLayer(this.bbox);
			}
			this.map.fitBounds(bounds);

			this.bboxPoints.clearLayers();
			for (var i = 0; i < 5; i++) {
				this.bboxPoints.addLayer(this.createBBoxPoint(points[i]));
			}
		},

		clearBBox: function() {
			if (null != this.bbox) {
				this.map.removeLayer(this.bbox);
			}
		}
	},

	geohashInfoView: {
		hashLabel: $("#hashLabel"),

		setBinaryValue: function(value) {
			this.hashLabel.text(value);
		}
	}
};
