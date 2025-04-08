import { Model, Column, Table, DataType, HasMany } from "sequelize-typescript";
import { DepartmentModel } from "./department.model";

@Table({
	tableName: "companies",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class CompanyModel extends Model<CompanyModel> {
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

	@HasMany(() => DepartmentModel)
	departments: DepartmentModel[];

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
