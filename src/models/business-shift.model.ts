import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
import { Timestamp } from 'rxjs';

@Table({
  tableName: 'business_shifts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BusinessShiftsModel extends Model<BusinessShiftsModel> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  start_time: Timestamp<Date>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  end_time: Timestamp<Date>;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  checkin_grace_enable: number; // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  checkin_grace_time: number; // in minutes default 0

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  checkout_grace_enable: number; // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  checkout_grace_time: number; // in minutes default 0

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  is_halfday_enable: number; // in minutes default 0

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color_code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  max_office_hours: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deleted_at: Date;

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

  //relation
  @BelongsTo(() => BusinessesModel)
  business: BusinessesModel; //business_id is the foreign key in this model
}