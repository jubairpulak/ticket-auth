import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import { TicketModel } from "./ticket.model";
import { EmployeeModel } from "./employee.model";
import { RequiredFieldsModel } from "./required-fields.model";
import { TicketLogRequiredFieldModel } from "./ticket-log-required-field.model";

@Table({
	tableName: "ticket_logs",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class TicketLogModel extends Model<TicketLogModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@ForeignKey(() => TicketModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	ticket_id: number;

	@ForeignKey(() => RequiredFieldsModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	required_field_id: number;

	@ForeignKey(() => EmployeeModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	raised_by: number;

	@ForeignKey(() => EmployeeModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	approved_by: number;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: true,
	})
	bypass: boolean;

	@Column({
		type: DataType.TIME,
		allowNull: true,
	})
	time: string;

	@BelongsTo(() => TicketModel)
	ticket: TicketModel;

	@BelongsTo(() => RequiredFieldsModel)
	requiredField: RequiredFieldsModel;

	@BelongsTo(() => EmployeeModel, "raised_by")
	raiser: EmployeeModel;

	@BelongsTo(() => EmployeeModel, "approved_by")
	approver: EmployeeModel;

	@HasMany(() => TicketLogRequiredFieldModel)
	logFields: TicketLogRequiredFieldModel[];

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
