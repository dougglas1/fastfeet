import Sequelize from 'sequelize';

// Exemplo importar Model
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import File from '../app/models/File';

import databaseConfig from '../config/database';

// Utilizar
const models = [User, Recipient, Deliveryman, File];

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
