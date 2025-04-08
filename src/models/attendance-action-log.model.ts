import {
	Model,
	Column,
	DataType,
	ForeignKey,
	Table,
} from "sequelize-typescript";
import { AttendancesModel } from "./attendance.model";
import { ATTENDANCE_STATUS, ATTENDANCE_LOG_TYPE } from "../constants/api.enums";

@Table({
	tableName: "attendance_action_logs",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class AttendanceActionLogsModel extends Model<AttendanceActionLogsModel> {
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
	action: ATTENDANCE_LOG_TYPE;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	status: ATTENDANCE_STATUS;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
	})
	in_grace_period: boolean;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	note: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	device_id: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	ip: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: true,
	})
	is_in_wifi: boolean;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: true,
	})
	is_remote: boolean;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: true,
	})
	is_geo_location: boolean;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	business_office_id: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	remote_mode: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	user_agent: string;

	@Column({
		type: DataType.JSON,
		allowNull: true,
	})
	location: JSON;

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
}
