import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import { CompanyModel } from "./company.model";
import { SubDepartmentModel } from "./sub-department.model";
import { DepartmentStatus } from "../constants/api.enums";

@Table({
	tableName: "departments",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class DepartmentModel extends Model<DepartmentModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
		unique: true,
	})
	department_id: string;

	@ForeignKey(() => CompanyModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	parent_company: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	head_of_department: number;

	@Column({
		type: DataType.ENUM(...Object.values(DepartmentStatus)),
		allowNull: false,
		defaultValue: DepartmentStatus.ACTIVE,
	})
	status: DepartmentStatus;

	@BelongsTo(() => CompanyModel)
	company: CompanyModel;

	@HasMany(() => SubDepartmentModel)
	subDepartments: SubDepartmentModel[];

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
