'use strict';
/*eslint no-process-env:0*/

let mongoAddr;

if(process.env.MONGO_PORT_27017_TCP_ADDR) {
  mongoAddr = `mongodb://${process.env.MONGO_PORT_27017_TCP_ADDR}:${process.env.MONGO_PORT_27017_TCP_PORT}/<%= lodash.slugify(appname) %>`;
} else {
  mongoAddr = 'mongodb://localhost/<%= lodash.slugify(appname) %>';
}

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || <%= prodPort %><% if(filters.mongoose) { %>,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI
      || process.env.MONGOHQ_URL
      || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
      || mongoAddr
  }<% } if (filters.sequelize) { %>,

  sequelize: {
    uri: process.env.SEQUELIZE_URI
      || 'sqlite://',
    options: {
      logging: false,
      storage: 'dist.sqlite',
      define: {
        timestamps: false
      }
    }
  }<% } %>
};
