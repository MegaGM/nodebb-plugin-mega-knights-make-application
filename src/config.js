var config = {
	title: 'Создать заявку',
	breadcrumbs: nbbHelpers.buildBreadcrumbs([{}]),
	statutePid: '2',
	gameCids: {
		apb: 14,
		bns: 22,
		gta: 9
	},
	gameCheckboxRegexp: /i-choose-(\w{3})/i,
	gameCharRegexp: /(\w{3})-char-/i,
	tokenBBcodeRegexp: /\[application-hash\=\@([^"]+)\@\]/i,
	choosenGames: [],
	newTopics: {},
	redisKey: 'mega:applications:',
	jwtSecret: 'megasecretkeyboardcatlolmeow',
	username: ''
};

module.exports = config;
