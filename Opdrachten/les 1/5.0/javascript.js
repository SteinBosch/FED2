var app = app || {};

(function(){

	app.controller = {
		init: function () {
			console.log("log for controller.init");
			app.gps.init();
			app.map.log();
		}
	}

	app.gps = {
		init: function () {
			console.log("log for gps.init");
		}
	}

	app.map = {
		log: function() {
			console.log("log for map.log");
		}
	}

	app.debug = {
		
	}

	app.controller.init();

})();