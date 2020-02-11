module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipients', {
      id: {
        type: Sequelize.INTEGER,
        alloNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      street: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      number: {
        type: Sequelize.INTEGER,
        alloNull: false,
      },
      complement: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      state: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      city: {
        type: Sequelize.STRING,
        alloNull: false,
      },
      zip_code: {
        type: Sequelize.STRING,
        alloNull: false,
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
    return queryInterface.dropTable('users');
  },
};
