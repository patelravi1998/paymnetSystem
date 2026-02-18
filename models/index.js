const User = require("./User");
const Transfer = require("./Transfer");

/**
 * User → Transfers (sent)
 */
User.hasMany(Transfer, {
  foreignKey: "from_user_id",
  as: "sentTransfers",
});

/**
 * User → Transfers (received)
 */
User.hasMany(Transfer, {
  foreignKey: "to_user_id",
  as: "receivedTransfers",
});

/**
 * Transfer → User (sender & receiver)
 */
Transfer.belongsTo(User, {
  foreignKey: "from_user_id",
  as: "fromUser",
});

Transfer.belongsTo(User, {
  foreignKey: "to_user_id",
  as: "toUser",
});

module.exports = {
  User,
  Transfer,
};
