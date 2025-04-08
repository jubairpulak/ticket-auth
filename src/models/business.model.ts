import {
	Table,
	Column,
	Model,
	DataType,
	HasMany,
	HasOne,
} from "sequelize-typescript";
import { BusinessMembersModel } from "./business-member.model";
import { BusinessAttendanceTypesModel } from "./business-attendance-types.model";
import { BusinessOfficesModel } from "./business-office.model";
import { BusinessOfficeHoursModel } from "./business-office-hour.model";
import { OfficePolicyRulesModel } from "./office-policy-rule.model";
import { OfficeSettingChangesLogsModel } from "./office-setting-changes-log.model";
import { BusinessWeekendsModel } from "./business-weekend.model";
import { BusinessWeekendSettingsModel } from "./business-weekend-setting.model";
import { HALF_DAY_CONFIGURATION } from "src/constants/api.enums";

//@Table({ tableName: 'businesses', timestamps: true })
@Table({ tableName: "businesses" })
export class BusinessesModel extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.INTEGER, // Dynamically load enum values
		allowNull: false,
		defaultValue: HALF_DAY_CONFIGURATION.DISABLE,
	})
	is_half_day_enable: HALF_DAY_CONFIGURATION;

	@Column({
		type: DataType.JSON,
		allowNull: true,
	})
	half_day_configuration: string;

	// Relation
	@HasMany(() => BusinessMembersModel) // Will create a foreign key in the BusinessMembersModel table with the name business_id
	businessMembers: BusinessMembersModel[];

	@HasMany(() => BusinessAttendanceTypesModel) // Will create a foreign key in the BusinessAttendanceTypesModel table with the name business_id
	attendance_type: BusinessAttendanceTypesModel[];

	@HasMany(() => BusinessOfficesModel) // Will create a foreign key in the BusinessOfficesModel table with the name business_id
	business_office: BusinessOfficesModel[];

	@HasOne(() => BusinessOfficeHoursModel) // Will create a foreign key in the BusinessOfficeHoursModel table with the name business_id
	business_office_hours: BusinessOfficeHoursModel;

	@HasMany(() => OfficePolicyRulesModel) // Will create a foreign key in the OfficePolicyRulesModel table with the name business_id
	office_policy_rules: OfficePolicyRulesModel[];

	@HasMany(() => OfficeSettingChangesLogsModel) // Will create a foreign key in the OfficeSettingChangesLogsModel table with the name business_id
	office_setting_changes_logs: OfficeSettingChangesLogsModel[];

	@HasMany(() => BusinessWeekendsModel) // Will create a foreign key in the BusinessWeekendsModel table with the name business_id
	business_weekends: BusinessWeekendsModel[];

	@HasMany(() => BusinessWeekendSettingsModel) // Will create a foreign key in the BusinessWeekendSettingsModel table with the name business_id
	business_weekend_settings: BusinessWeekendSettingsModel[];
}
