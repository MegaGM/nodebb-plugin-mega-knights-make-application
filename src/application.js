'use strict';
var Block = {};

/* ================================================
 * GET /make-application
 * ===============================================*/
Block.getApplicationPage = require('./getApplication.js');

/* ================================================
 * POST /make-application
 * ===============================================*/
Block.postApplicationPage = require('./postApplication.js');

/* ================================================
 * plugin for parsing templates in topics
 * ===============================================*/
Block.parseApplication = require('./parseApplication.js');

module.exports = Block;
