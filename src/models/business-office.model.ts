import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
@Table({
  tableName: 'business_offices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
})
export class BusinessOfficesModel extends Model<BusinessOfficesModel> {
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
  name: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  location: object;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_location: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ip: string;

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
  })
  deleted_at: Date;

  // Relation BusinessOfficesModel belongs to BusinessesModel
    @BelongsTo(() => BusinessesModel)
    business: BusinessesModel;
}