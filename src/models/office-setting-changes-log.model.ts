import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
@Table({
  tableName: 'office_setting_changes_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OfficeSettingChangesLogsModel extends Model<OfficeSettingChangesLogsModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

    @ForeignKey(() => BusinessesModel)
    @Column({
        // Primary key of businesses table
        type: DataType.INTEGER,
        allowNull: true,
    })
    business_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  from: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  to: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logs: string;

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

  // BelongsTo Relation with BusinessesModel
    @BelongsTo(() => BusinessesModel)
    business: BusinessesModel;
}