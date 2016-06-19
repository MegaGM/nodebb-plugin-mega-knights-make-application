var fs = require('fs'),
	path = require('path'),
	gameTemplates = {
		apb: fs.readFileSync(getTemplatePath('apb')).toString(),
		bns: fs.readFileSync(getTemplatePath('bns')).toString(),
		gta: fs.readFileSync(getTemplatePath('gta')).toString()
	};

function getTemplatePath(game) {
	return path.join(__dirname, '../templates/partials/', game + '-related.tpl');
}

module.exports = gameTemplates;
