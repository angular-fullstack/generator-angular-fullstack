'use strict';

module.exports = function(sequelize, DataTypes) {
  var Thing = sequelize.define("Thing", {
    title: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        Thing.belongsTo(models.Thing);
      }
    }
  });

  return Thing;
};
