import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessShiftsModel } from './business-shift.model';
import { BusinessMembersModel } from './business-member.model';
import { Timestamp } from 'rxjs';

@Table({
  tableName: 'shift_assignments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ShiftAssignmentsModel extends Model<ShiftAssignmentsModel> {
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

  @ForeignKey(() => BusinessShiftsModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  shift_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  shift_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  shift_title: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  start_time: Timestamp<Date>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
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
  is_half_day: number; // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color_code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  is_general: number;  // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  is_weekend: number;  // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  is_holiday: number;  // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  is_unassigned: number;  // value 0 or 1, 0 means false, 1 means true

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  is_shift: number;  // value 0 or 1, 0 means false, 1 means true

	@Column({
		type: DataType.JSONB,
		allowNull: true,
	})
	shift_settings: object;

  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: true,
  // })
  // max_office_hours: number;

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
    @BelongsTo(() => BusinessShiftsModel)
    shift: BusinessShiftsModel; // shift_id foreign key in this model

    @BelongsTo(() => BusinessMembersModel)
    member: BusinessMembersModel; // business_member_id foreign key in this model
}