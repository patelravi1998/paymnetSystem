const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Transfer = sequelize.define(
  "Transfer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    from_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    to_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },

    status: {
      type: DataTypes.ENUM("SUCCESS", "FAILED", "PENDING"),
      defaultValue: "SUCCESS",
    },
  },
  {
    tableName: "transfers",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Transfer;
