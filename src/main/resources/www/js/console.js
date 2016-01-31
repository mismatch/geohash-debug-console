(function(zeroRequest) {
	var request = userRequest(zeroRequest);
	var settingsController = controllers.settingsController(request, views.settingsView);
	var mapController = controllers.mapController(request, views.mapView);
	var geohashInfoController = controllers.geohashInfoController(views.geohashInfoView, mapController);
	request.onResponse = geohashInfoController.onInfoReceived;

	settingsController.initView();
	mapController.initView();
})({bits: 8, withBBox: false});
