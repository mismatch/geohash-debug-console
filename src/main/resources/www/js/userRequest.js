var userRequest = function(zeroRequest) {
	return $.extend({
		point: null,
		bits: null,
		withBBox: false,

		perform: function() {
			console.log("this = ", this);
			if (null == this.point) {
				return;
			}
			$.getJSON("/hashes/point?" 
					+ $.param({
						lat: this.point.lat, 
						lng: this.point.lng, 
						bits: this.bits,
						withBBox: this.withBBox
					}), 
					this.onResponse);
		},
	}, zeroRequest);
}
