import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
import { 
  ATTENDANCE_TYPE
} from '../constants/api.enums';

@Table({
  tableName: 'business_attendance_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
})
export class BusinessAttendanceTypesModel extends Model<BusinessAttendanceTypesModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => BusinessesModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  attendance_type: ATTENDANCE_TYPE;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_by: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  created_by_name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  updated_by: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  updated_by_name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at'
  })
  deleted_at: Date;
  // Relation with business model
  @BelongsTo(() => BusinessesModel)
  business: BusinessesModel; // business_id foreign key in this model
}