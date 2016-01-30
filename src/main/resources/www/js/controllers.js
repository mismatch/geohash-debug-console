var controllers = {
	settingsController: function(userRequest, view) {
		return {
			onBitsChanged: function(bits) {
				view.setBits(bits);
				userRequest.bits = bits;
				userRequest.perform();
			},

			onBBoxOptionChanged: function(option) {
				userRequest.withBBox = option;
				userRequest.perform();
			},

			initView: function() {
				view.setBits(userRequest.bits);
				view.setBBoxOption(userRequest.withBBox);
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
				view.drawBBox(bbox); // TODO: split bbox into bounds and points
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
