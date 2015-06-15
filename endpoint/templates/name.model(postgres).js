'use strict';

module.exports = function(sequelize, DataTypes) {
  var <%= classedName %> = sequelize.define('<%= classedName %>', {
    title: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        <%= classedName %>.belongsTo(models.<%= classedName %>);
      }
    }
  });

  return <%= classedName %>;
};
