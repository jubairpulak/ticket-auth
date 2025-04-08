import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessMembersModel } from './business-member.model';
import { ShiftAssignmentsModel } from './shift-assignment.model';
import { Timestamp } from 'rxjs';
import {
    ATTENDANCE_STATUS
} from "../constants/api.enums";

@Table({
  tableName: 'attendance_summary',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AttendanceSummaryModel extends Model<AttendanceSummaryModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => BusinessMembersModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_member_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_present: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_late_checkin: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_early_checkout: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_checkin_grace: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_checkout_grace: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  total_leave: number;

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

  //relation
  @BelongsTo(() => BusinessMembersModel)
  business_member: BusinessMembersModel; // business_member_id foreign key in this model
}