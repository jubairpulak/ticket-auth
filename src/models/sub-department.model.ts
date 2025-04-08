import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { DepartmentModel } from "./department.model";
import { DepartmentStatus } from "../constants/api.enums";

@Table({
	tableName: "sub_departments",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class SubDepartmentModel extends Model<SubDepartmentModel> {
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
	sub_department_id: string;

	@ForeignKey(() => DepartmentModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	parent_department: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	manager: number;

	@Column({
		type: DataType.ENUM(...Object.values(DepartmentStatus)),
		allowNull: false,
		defaultValue: DepartmentStatus.ACTIVE,
	})
	status: DepartmentStatus;

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
