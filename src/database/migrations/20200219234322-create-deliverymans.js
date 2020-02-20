module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliverymans', {
      id: {
        type: Sequelize.INTEGER,
        alloNull: false, // Não permite nulo
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      email: {
        type: Sequelize.STRING,
        alloNull: false,
        unique: true, // Não permitir e-mail repetido
      },
      created_at: {
        type: Sequelize.DATE,
        alloNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        alloNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('usdeliverymansers');
  },
};
