const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init({
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.Task, { foreignKey: "userId", as: "tasks" });
  }
}

module.exports = User;