import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessesModel } from './business.model';
import {
  POLICY_TYPE,
  POLICY_ACTION
} from '../constants/api.enums';
@Table({
  tableName: 'office_policy_rules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OfficePolicyRulesModel extends Model<OfficePolicyRulesModel> {
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
  policy_type: POLICY_TYPE;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  from_days: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  to_days: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action: POLICY_ACTION;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  penalty_type: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  penalty_amount: number;

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

  //Relationship with business table
    @BelongsTo(() => BusinessesModel)
    business: BusinessesModel;
}