'use strict';

var _ = require('lodash');
var <%= name %> = require('./<%= name %>.model');

// Get list of <%= name %>s
exports.index = function (req, res) {
    <%= name %>.find(function (err, <%= name %>
        s) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(<%= name %>
            s);
    });
};

// Get a single <%= name %>
exports.show = function (req, res) {
    <%= name %>.findById(req.params.id, function (err, <%= name %>) {
        if (err) {
            return handleError(res, err);
        }
        if (!<%= name %>) {
            return res.status(404).send('Not Found');
        }
        return res.json(<%= name %>);
    });
};

// Creates a new <%= name %> in the DB.
exports.create = function (req, res) {
    <%= name %>.create(req.body, function (err, <%= name %>) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(<%= name %>);
    });
};

// Updates an existing <%= name %> in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    <%= name %>.findById(req.params.id, function (err, <%= name %>) {
        if (err) {
            return handleError(res, err);
        }
        if (!<%= name %>) {
            return res.status(404).send('Not Found');
        }
        var updated = _.merge(<%= name %>, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(<%= name %>);
        });
    });
};

// Deletes a <%= name %> from the DB.
exports.destroy = function (req, res) {
    <%= name %>.findById(req.params.id, function (err, <%= name %>) {
        if (err) {
            return handleError(res, err);
        }
        if (!<%= name %>) {
            return res.status(404).send('Not Found');
        }
        <%= name %>.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}
