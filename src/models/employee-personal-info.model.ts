import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { EmployeeModel } from "./employee.model";
import { Gender, BloodGroup } from "../constants/api.enums";

@Table({
	tableName: "employee_personal_info",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class EmployeePersonalInfoModel extends Model<EmployeePersonalInfoModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@ForeignKey(() => EmployeeModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	employee_id: number;

	@Column({
		type: DataType.ENUM(...Object.values(Gender)),
		allowNull: false,
	})
	gender: Gender;

	@Column({
		type: DataType.STRING(20),
		allowNull: true,
	})
	phone: string;

	@Column({
		type: DataType.DATEONLY,
		allowNull: true,
	})
	date_of_birth: Date;

	@Column({
		type: DataType.STRING(255),
		allowNull: true,
	})
	address: string;

	@Column({
		type: DataType.STRING(100),
		allowNull: true,
	})
	nationality: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: true,
	})
	nid: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: true,
	})
	passport: string;

	@Column({
		type: DataType.ENUM(...Object.values(BloodGroup)),
		allowNull: true,
	})
	blood_group: BloodGroup;

	@Column({
		// encrypted value
		type: DataType.STRING,
		allowNull: true,
	})
	password: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	mobile_token: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	email: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0, // value is 0,1
		allowNull: false,
	})
	email_verified: number;
	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	social_media: string;

	@BelongsTo(() => EmployeeModel)
	employee: EmployeeModel;

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
