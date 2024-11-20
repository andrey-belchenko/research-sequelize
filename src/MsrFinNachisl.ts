import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

// Define the attributes for the model
interface MsrFinNachislAttributes {
  id: number;
  changed_at?: Date;
  refresh_slice_id?: number;
  договор_id?: number;
  вид_реал_id?: number;
  дата?: Date;
  док_нач_id?: number;
  вид_тов_id?: number;
  начисл?: number;
}

// Define the model class
class MsrFinNachisl extends Model<MsrFinNachislAttributes> implements MsrFinNachislAttributes {
  public id!: number;
  public changed_at?: Date;
  public refresh_slice_id?: number;
  public договор_id?: number;
  public вид_реал_id?: number;
  public дата?: Date;
  public док_нач_id?: number;
  public вид_тов_id?: number;
  public начисл?: number;
}

// Initialize the model
MsrFinNachisl.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    refresh_slice_id: {
      type: DataTypes.INTEGER,
    },
    договор_id: {
      type: DataTypes.INTEGER,
    },
    вид_реал_id: {
      type: DataTypes.INTEGER,
    },
    дата: {
      type: DataTypes.DATEONLY,
    },
    док_нач_id: {
      type: DataTypes.INTEGER,
    },
    вид_тов_id: {
      type: DataTypes.INTEGER,
    },
    начисл: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    sequelize,
    tableName: 'msr_фин_начисл',
    schema: 'report_dm',
    timestamps: false,
  }
);

export default MsrFinNachisl;