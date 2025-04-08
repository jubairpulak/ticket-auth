import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasOne,
	HasMany,
} from "sequelize-typescript";
import { BusinessesModel } from "./business.model";
import { MembersModel } from "./member.model";
import { BusinessRolesModel } from "./business-role.model";
import { ShiftAssignmentsModel } from "./shift-assignment.model";
import { AttendancesModel } from "./attendance.model";
import { AttendanceSummaryModel } from "./attendance-summary.model";

import { BUSINESS_MEMBER_TYPE, EMPLOYEE_STATUS, EMPLOYEE_TYPE } from "../constants/api.enums";
import { BusinessMemberBkashInfoModel } from "./BusinessMemberBkashInfo.model";

// @Table({ tableName: 'business_member', timestamps: true })
@Table({ tableName: "business_member" })
export class BusinessMembersModel extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@ForeignKey(() => BusinessesModel)
	@Column({
		// Primary key of businesses table
		type: DataType.INTEGER.UNSIGNED,
		allowNull: true,
	})
	business_id: number;

	@ForeignKey(() => MembersModel)
	@Column({
		// Primary key of members table
		type: DataType.INTEGER,
		allowNull: false,
	})
	member_id: number;

	@ForeignKey(() => BusinessRolesModel)
	@Column({
		// Primary key of business_roles table
		type: DataType.INTEGER,
		allowNull: true,
	})
	business_role_id: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	employee_id: string;

	@Column({
		// Primary key of business_member table
		type: DataType.INTEGER,
		allowNull: true,
	})
	manager_id: number;

	@Column({
		type: DataType.STRING,
		//enum: BUSINESS_MEMBER_TYPE,
		//defaultValue: BUSINESS_MEMBER_TYPE.ADMIN,
		allowNull: true,
	})
	type: BUSINESS_MEMBER_TYPE;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	join_date: Date;

	@Column({
		type: DataType.STRING,
		//enum: EMPLOYEE_STATUS,
		defaultValue: EMPLOYEE_STATUS.ACTIVE,
		allowNull: false,
	})
	status: EMPLOYEE_STATUS;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	grade: string;


	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	designation: string;

	@Column({
		type: DataType.STRING,
		//enum: EMPLOYEE_TYPE,
		defaultValue: EMPLOYEE_TYPE.PERMANENT,
		allowNull: false,
	})
	employee_type: EMPLOYEE_TYPE;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	department: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	mobile: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	early_bird_counter: number;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	is_location_active: number; // 0 or 1

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	is_wifi_network_active: number; // 0 or 1

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	is_remote_active: number; // 0 or 1

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	late_loteef_counter: number;

	@Column({
		type: DataType.DATE,
		//defaultValue: DataType.NOW,
		allowNull: true,
	})
	deleted_at: Date;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	created_by: number; // Profiles table primary key

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	created_by_name: string; // Profiles table name

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		//allowNull: false
		allowNull: true,
	})
	updated_by: number; // Profiles table primary key

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	updated_by_name: string; // Profiles table name

	@Column({
		type: DataType.DATE,
		//defaultValue: DataType.NOW,
		allowNull: false,
	})
	created_at: Date;

	@Column({
		type: DataType.DATE,
		//defaultValue: DataType.NOW,
		allowNull: true, // maybe allowNull: true
	})
	inactived_at: Date;

	@Column({
		type: DataType.DATE,
		//defaultValue: DataType.NOW,
		allowNull: true, // maybe allowNull: true
	})
	updated_at: Date;

	@BelongsTo(() => MembersModel)
	member: MembersModel;

	@BelongsTo(() => BusinessesModel)
	business: BusinessesModel;

	@BelongsTo(() => BusinessRolesModel)
	role: BusinessRolesModel;

	@HasMany(() => ShiftAssignmentsModel)
	shift_assign: ShiftAssignmentsModel; // shift_assignment_id foreign key in this model

	@HasMany(() => AttendancesModel)
	attendance: AttendancesModel;

	@HasMany(() => AttendanceSummaryModel)
	attendance_summary: AttendanceSummaryModel;

	@HasOne(() => BusinessMemberBkashInfoModel)
	bkash_info: BusinessMemberBkashInfoModel;
}
