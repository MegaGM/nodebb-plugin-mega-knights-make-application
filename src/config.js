'use strict';

let nbbHelpers = require.main.require('./src/controllers/helpers');

let // logger
	log4js = require('log4js'),
	logOptions = {
		replaceConsole: true,
		appenders: [{
			type: 'console',
			layout: {
				type: 'pattern',
				pattern: '%d{ABSOLUTE} %[%c.%p%] - %m'
			}
		}]
	};
log4js.configure(logOptions);

let
	apbCid = 14,
	bnsCid = 22,
	gtaCid = 9;
let // actual config
	config = {
	logOptions: logOptions,
	title: 'Создать заявку',
	breadcrumbs: nbbHelpers.buildBreadcrumbs([{
		text: 'Создать заявку'
	}]),
	statutePid: '2',
	gameCids: {
		apb: apbCid,
		bns: bnsCid,
		gta: gtaCid
	},
	groupNames: [ // should be in asc
		'Рыцари',
		'Рекрутеры',
		'Офицеры',
		'Генералы',
		'Лидер'
	],
	groupsByCid: {
		[apbCid]: ['Рыцари', 'APB'],
		[bnsCid]: ['Рыцари', 'BNS'],
		[gtaCid]: ['Рыцари', 'GTA']
	},
	voteMultipliers: {
		'Рыцари': 1,
		'Рекрутеры': 10,
		'Офицеры': 30,
		'Генералы': 75,
		'Лидер': 100
	},
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
