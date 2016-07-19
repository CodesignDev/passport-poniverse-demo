var knex = require('knex');
var bookshelf = require('bookshelf');
var knexConfig = require('../knexfile.js')[process.env.NODE_ENV || 'development'];

module.exports = bookshelf(knex(knexConfig));

