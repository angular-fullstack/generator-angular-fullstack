'use strict';

// Dependencies
var mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var mongoose_timestamp = require('mongoose-timestamp');

// Model dependencies

// Schema
var schema = new mongoose.Schema(require('./../../../shared/models/<%= name%>s.json'));

// Schema plugins
schema.plugin(mongoose_delete, {
    deletedAt: true
});
schema.plugin(mongoose_timestamp);

// Return model
module.exports = mongoose.model('<%= name %>', schema);
