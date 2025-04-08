import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { EmployeeModel } from "./employee.model";
import { DepartmentModel } from "./department.model";

@Table({
	tableName: "employee_official_info",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class EmployeeOfficialInfoModel extends Model<EmployeeOfficialInfoModel> {
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
		type: DataType.STRING(255),
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
		unique: true,
	})
	email: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
		unique: true,
	})
	role: string;

	@ForeignKey(() => DepartmentModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	department_id: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	line_manager: number;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
	})
	date_of_joining: Date;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
	})
	employee_type: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: true,
	})
	giver_employee_id: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: true,
	})
	grade: string;

	@BelongsTo(() => EmployeeModel)
	employee: EmployeeModel;

	@BelongsTo(() => DepartmentModel)
	department: DepartmentModel;

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
