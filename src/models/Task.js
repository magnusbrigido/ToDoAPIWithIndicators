const { Model, DataTypes } = require("sequelize");

class Task extends Model {
  static init(sequelize) {
    super.init({
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      description: DataTypes.STRING,
      status: DataTypes.ENUM("CREATED", "RUNNING", "DONE"),
      runningDate: DataTypes.DATE,
      doneDate: DataTypes.DATE
    },
    {
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

module.exports = Task;