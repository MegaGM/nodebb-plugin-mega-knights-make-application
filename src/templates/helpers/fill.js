Handlebars.registerHelper('fill', function (context, options) {
	if ('string' !== typeof context) return context;
	if ('' == context) return 'не заполнено';
	return context;
});
