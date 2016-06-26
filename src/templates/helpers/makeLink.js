Handlebars.registerHelper('makeLink', function (context, options) {
	if ('' == context) return 'не заполнено';
	var link = context.substring(context.lastIndexOf('/'));
	return '<a href="' + context + '">' + link + '</a>';
});
