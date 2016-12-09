'use strict';
import express from 'express';
import config from '../config/environment';<% if (filters.mongooseModels) { %>
import User from '../api/user/user.model';<% } %><% if (filters.sequelizeModels) { %>
import {User} from '../sqldb';<% } %>

// Passport Configuration
require('./local/passport').setup(User, config);<% if (filters.facebookAuth) { %>
require('./facebook/passport').setup(User, config);<% } %><% if (filters.googleAuth) { %>
require('./google/passport').setup(User, config);<% } %><% if (filters.twitterAuth) { %>
require('./twitter/passport').setup(User, config);<% } %>
<%_ if (filters.githubAuth) { -%>
require('./github/passport').setup(User, config);<% } %>

var router = express.Router();

router.use('/local', require('./local').default);<% if (filters.facebookAuth) { %>
router.use('/facebook', require('./facebook').default);<% } %><% if (filters.googleAuth) { %>
router.use('/google', require('./google').default);<% } %><% if (filters.twitterAuth) { %>
router.use('/twitter', require('./twitter').default);<% } %>
<%_ if (filters.githubAuth) { -%>
router.use('/github', require('./github').default);<% } %>

export default router;
