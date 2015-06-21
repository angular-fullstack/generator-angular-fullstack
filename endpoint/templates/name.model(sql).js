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

  <%= classedName %>
    .sync({force: true})
    .then(function (){
      return <%= classedName %>.create({
        title: 'title',
        info: 'info',
        active: true
      });
    });

  return <%= classedName %>;
};
