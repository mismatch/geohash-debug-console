var controllers = {
	settingsController: function(userRequest, view) {
		return {
			onBitsChanged: function(bits) {
				view.updateBitsLabel(bits);
				userRequest.bits = bits;
				userRequest.perform();
			},

			onBBoxOptionChanged: function(option) {
				userRequest.withBBox = option;
				userRequest.perform();
			},

			initView: function() {
				view.setChangeListener(this);
			}
		};
	},

	mapController: function(userRequest, view) {
		return {
			onPointChanged: function(point) {
				view.moveMarkerTo(point);
				userRequest.point = point;
				userRequest.perform();
			},

			initView: function() {
				var mapCenter = [50.675, 11.925];
				view.drawMap({center: mapCenter, zoom: 5});
				view.setChangeListener(this);
				view.showHint("Please, click anywhere on the map to start using console.", mapCenter);
			},

			drawBBox: function(bbox) {
				var points = [
					[bbox.minLat, bbox.minLng],
					[bbox.minLat, bbox.maxLng],	
					[0.5*(bbox.minLat + bbox.maxLat), 0.5*(bbox.minLng + bbox.maxLng)],
					[bbox.maxLat, bbox.minLng],
					[bbox.maxLat, bbox.maxLng]
				];
				var bounds = [points[0], points[4]];

				view.drawBBox(bounds, points);
			},

			clearBBox: function() {
				view.clearBBox();
			}
		};
	},

	geohashInfoController: function(view, mapController) {
		return {
			onInfoReceived: function(hashData) {
				view.setBinaryValue(hashData.binary);
				if (hashData.bbox) {
					mapController.drawBBox(hashData.bbox);
				} else {
					mapController.clearBBox();
				}
			}
		};
	}
};
