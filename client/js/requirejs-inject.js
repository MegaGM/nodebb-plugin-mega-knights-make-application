(function () {
	// get RequireJS config;
	var rjsConfig = requirejs.s.contexts._.config;

	// to prevent changing of NodeBB templates
	// inject modules directly to RequireJS config file
	var pluginPrefix = 'knights-make-application/',
		pluginPath = '../../plugins/nodebb-plugin-mega-knights-make-application/';
	var registerAMD = function (name, path) {
		rjsConfig.paths[pluginPrefix + name] = pluginPath + path;
	};

	registerAMD('localStorage', 'js/lib/store.min');
	registerAMD('validator', 'js/lib/validator.min');
	registerAMD('validation', 'js/validation');
	registerAMD('templates', 'templates/index');

	// Handlebars is an exception! Let it register without any namespace, if it wasn't already registered
	if (!rjsConfig.paths['handlebars'])
		rjsConfig.paths['handlebars'] = pluginPath + 'js/lib/handlebars.runtime-v4.0.5';
})();
