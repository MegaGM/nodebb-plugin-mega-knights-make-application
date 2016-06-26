(function () {
	// get RequireJS config;
	var rjsConfig = requirejs.s.contexts._.config;

	// to prevent changing of NodeBB templates
	// inject modules directly to RequireJS config file
	var moduleName = 'make-application/',
		modulePath = '../../plugins/nodebb-plugin-mega-knights-make-application/';
	var registerAMD = function (name, path) {
		rjsConfig.paths[moduleName + name] = modulePath + path;
	};

	registerAMD('localStorage', 'js/lib/store.min');
	registerAMD('validator', 'js/lib/validator.min');
	registerAMD('validation', 'js/validation');

	// Handlebars is an exception! Let it register without any namespace, if it wasn't already registered
	if (!rjsConfig.paths['handlebars'])
		rjsConfig.paths['handlebars'] = modulePath + 'js/lib/handlebars.runtime-v4.0.5';
})();
