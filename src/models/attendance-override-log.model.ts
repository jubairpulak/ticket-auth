import { Model, Column, DataType, ForeignKey, Table, BelongsTo } from 'sequelize-typescript';
import { AttendancesModel } from './attendance.model';

@Table({
  tableName: 'attendance_override_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AttendanceOverrideLogsModel extends Model<AttendanceOverrideLogsModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => AttendancesModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  attendance_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  previous_time: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  new_time: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  previous_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  new_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  log: string;

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

    //relations here 
    @BelongsTo(() => AttendancesModel) 
    attendance: AttendancesModel;
}