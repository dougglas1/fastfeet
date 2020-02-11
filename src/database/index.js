import Sequelize from 'sequelize';

// Exemplo importar Model
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

import databaseConfig from '../config/database';

// Utilizar
const models = [User, Recipient];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // Percorrer os models
    models.map(model => model.init(this.connection));
  }
}

export default new DataBase();
