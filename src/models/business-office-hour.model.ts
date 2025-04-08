import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
import {  
  OFFICE_HOURS_TYPE, 
} from '../constants/api.enums';

@Table({
  tableName: 'business_office_hours',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BusinessOfficeHoursModel extends Model<BusinessOfficeHoursModel> {
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
  type: OFFICE_HOURS_TYPE;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  number_of_days: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_weekend_included: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_start_grace_time_enable: boolean;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  start_time: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  start_grace_time: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_end_grace_time_enable: boolean;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  end_time: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  end_grace_time: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_grace_period_policy_enable: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_late_checkin_early_checkout_policy_enable: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_for_late_checkin: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_for_early_checkout: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_unpaid_leave_policy_enable: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  unauthorised_leave_penalty_component: string;

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

  //relationship with business table
    @BelongsTo(() => BusinessesModel)
    business: BusinessesModel;
}