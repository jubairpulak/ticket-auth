import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
@Table({
  tableName: 'business_weekends',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BusinessWeekendsModel extends Model<BusinessWeekendsModel> {
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
  weekday_name: string;

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

  // relation with businesses table
    @BelongsTo(() => BusinessesModel)   // relation with businesses table
    business: BusinessesModel;
}