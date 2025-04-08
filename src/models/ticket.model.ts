import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import { DepartmentModel } from "./department.model";
import { CategoryModel } from "./category.model";
import { EmployeeModel } from "./employee.model";
import { ShiftPriorityEnum, TicketStatus } from "../constants/api.enums";
import { RequiredFieldsModel } from "./required-fields.model";
import { TicketLogModel } from "./ticket-log.model";
import { CommentsModel } from "./comments.model";

@Table({
	tableName: "tickets",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class TicketModel extends Model<TicketModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
		unique: true,
	})
	ticket_generated_id: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	description: string;

	@ForeignKey(() => DepartmentModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	department_id: number;

	@ForeignKey(() => CategoryModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	category_id: number;

	@Column({
		type: DataType.ENUM(...Object.values(ShiftPriorityEnum)),
		allowNull: false,
		defaultValue: ShiftPriorityEnum.MEDIUM,
	})
	priority: ShiftPriorityEnum;

	@Column({
		type: DataType.ENUM(...Object.values(TicketStatus)),
		allowNull: false,
		defaultValue: TicketStatus.ACTIVE,
	})
	status: TicketStatus;

	@Column({
		type: DataType.JSON,
		allowNull: true,
	})
	tags: any;

	@ForeignKey(() => EmployeeModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	created_by: number;

	@BelongsTo(() => DepartmentModel)
	department: DepartmentModel;

	@BelongsTo(() => CategoryModel)
	category: CategoryModel;

	@BelongsTo(() => EmployeeModel)
	creator: EmployeeModel;

	@HasMany(() => RequiredFieldsModel)
	requiredFields: RequiredFieldsModel[];

	@HasMany(() => TicketLogModel)
	logs: TicketLogModel[];

	@HasMany(() => CommentsModel)
	comments: CommentsModel[];

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
