import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
	HasOne,
} from "sequelize-typescript";
import { DepartmentModel } from "./department.model";
import { EmployeeOfficialInfoModel } from "./employee-official-info.model";
import { EmployeePersonalInfoModel } from "./employee-personal-info.model";

@Table({
	tableName: "employees",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class EmployeeModel extends Model<EmployeeModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@HasOne(() => EmployeeOfficialInfoModel)
	officialInfo: EmployeeOfficialInfoModel;

	@HasOne(() => EmployeePersonalInfoModel)
	personalInfo: EmployeePersonalInfoModel;

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
