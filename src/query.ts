import sequelize from './sequelize';
import MsrFinNachisl from './MsrFinNachisl';
import { Op, where, col } from 'sequelize';

async function queryData() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Query the model with an "AND" condition and a comparison between two fields
    const results = await MsrFinNachisl.findAll({
      where: {
        [Op.and]: [
          { вид_реал_id: 1 }, // Example condition
          where(col('договор_id'), Op.gt, col('вид_реал_id')), // Example comparison between two fields
        ],
      },
    });

    console.log('Query results:', results);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

queryData();