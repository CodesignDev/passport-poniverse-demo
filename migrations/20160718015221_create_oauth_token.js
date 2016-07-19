
exports.up = function(knex, Promise) {
  return knex.schema.createTable('external_users', function (table) {
    table.increments('id').primary();
    table.integer('external_user_id');
    table.string('type');
    table.string('service');
    table.string('access_token');
    table.string('refresh_token');
    table.timestamp('expires');
    table.integer('user_id').references('users.id');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('external_users');
};
