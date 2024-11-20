import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('asuse', 'asuse', 'kl0pik', {
  host: 'asuse-ai-dev.infoenergo.loc',
  port: 5432,
  dialect: 'postgres',
  logging: false, // Disable logging; default: console.log
});

export default sequelize;