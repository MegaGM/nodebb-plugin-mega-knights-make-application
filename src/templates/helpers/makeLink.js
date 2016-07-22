Handlebars.registerHelper('makeLink', function (context, options) {
	if (!context) return 'не заполнено';
	var l = context.length - 1;
	context = context[l] === '/' ? context.substring(0, l) : context;

	var link = context.substring(context.lastIndexOf('/') + 1),
		anchor = context.indexOf('http') === 0 ? context : 'http://' + context;
	return '<a href="' + anchor + '">' + link + '</a>';
});
