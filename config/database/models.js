var bookshelf = require('../database');

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  externalUsers: function() {
    return this.hasMany(ExternalUser);
  }
});

var ExternalUser = bookshelf.Model.extend({
  tableName: 'external_users',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = {
  User: User,
  ExternalUser: ExternalUser
};
