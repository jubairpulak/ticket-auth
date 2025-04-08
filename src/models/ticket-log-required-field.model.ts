import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { TicketLogModel } from "./ticket-log.model";
import { RequiredFieldsModel } from "./required-fields.model";
import { RequiredFieldOptionsModel } from "./required-field-options.model";

@Table({
	tableName: "ticket_log_required_fields",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class TicketLogRequiredFieldModel extends Model<TicketLogRequiredFieldModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@ForeignKey(() => TicketLogModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	ticket_log_id: number;

	@ForeignKey(() => RequiredFieldsModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	required_field_id: number;

	@ForeignKey(() => RequiredFieldOptionsModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	required_field_option_id: number;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	value: string;

	@BelongsTo(() => TicketLogModel)
	ticketLog: TicketLogModel;

	@BelongsTo(() => RequiredFieldsModel)
	requiredField: RequiredFieldsModel;

	@BelongsTo(() => RequiredFieldOptionsModel)
	requiredFieldOption: RequiredFieldOptionsModel;

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
