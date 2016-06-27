Handlebars.registerHelper('capitalize', function (context, options) {
	if ('string' !== typeof context) return context;
	return context.charAt(0).toUpperCase() + context.slice(1);
});
