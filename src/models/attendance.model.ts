import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
	HasOne,
} from "sequelize-typescript";
import { BusinessMembersModel } from "./business-member.model";
import { ShiftAssignmentsModel } from "./shift-assignment.model";
import { AttendanceOverrideLogsModel } from "./attendance-override-log.model";
import { AttendanceActionLogsModel } from "./attendance-action-log.model";
import { Timestamp } from "rxjs";
import { ATTENDANCE_STATUS, ATTENDANCE_LOG_TYPE } from "../constants/api.enums";

@Table({
	tableName: "attendances",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class AttendancesModel extends Model<AttendancesModel> {
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

	@ForeignKey(() => ShiftAssignmentsModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	shift_assignment_id: number;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	date: Date;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	checkin_time: string; //HH:MM:SS

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	checkout_time: string; //HH:MM:SS

	@Column({
		type: DataType.DECIMAL,
		allowNull: true,
	})
	staying_time_in_minutes: number;

	@Column({
		type: DataType.DECIMAL,
		allowNull: true,
	})
	overtime_in_minutes: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	status: ATTENDANCE_STATUS;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	remarks: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	is_off_day: number; // value 0 or 1, 0 means false, 1 means true

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	is_attendance_reconciled: number; // value 0 or 1, 0 means false, 1 means true

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
	@BelongsTo(() => ShiftAssignmentsModel)
	shift_assign: ShiftAssignmentsModel; // shift_assignment_id foreign key in this model

	@BelongsTo(() => BusinessMembersModel)
	business_member: BusinessMembersModel; // business_member_id foreign key in this model

	@HasMany(() => AttendanceOverrideLogsModel) // One-to-Many relationship
	//@HasOne(() => AttendanceOverrideLogsModel)  // One-to-One relationship
	attendance_override_log: AttendanceOverrideLogsModel; // attendance_id foreign key in this model

	@HasMany(() => AttendanceActionLogsModel)
	attendance_action_logs: AttendanceActionLogsModel[];
}
