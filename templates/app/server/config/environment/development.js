/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {<% if (filters.mongoose) { %>
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://localhost/<%= lodash.slugify(appname) %>-dev'
    },<% } if (filters.sequelize) { %>

    // Sequelize connection options
    sequelize: {
        uri: 'sqlite://',
        options: {
            logging: false,
            operatorsAliases: false,
            storage: 'dev.sqlite',
            define: {
                timestamps: false
            }
        }
    },<% } %>

    // Seed database on startup
    seedDB: true,
};
