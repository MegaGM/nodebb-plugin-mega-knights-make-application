var nbbHelpers = require.main.require('./src/controllers/helpers');

var config = {
	title: 'Создать заявку',
	breadcrumbs: nbbHelpers.buildBreadcrumbs([{
		text: 'Создать заявку'
	}]),
	statutePid: '2',
	gameCids: {
		apb: 14,
		bns: 22,
		gta: 9
	},
	groupNames: [
		'Рыцари',
		'Рекрутеры',
		'Офицеры',
		'Генералы',
		'Лидер'
	],
	gameCheckboxRegexp: /i-choose-(\w{3})/i,
	gameCharRegexp: /(\w{3})-char-(\d+)/i,
	tokenBBcodeRegexp: /\[application-hash\=\@([^"]+)\@\]/i,
	choosenGames: [],
	newTopics: {},
	redisKey: 'mega:applications:',
	jwtSecret: 'megasecretkeyboardcatlolmeow',
	username: ''
};

module.exports = config;
