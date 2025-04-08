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
import { RequiredFieldsType } from "../constants/api.enums";
import { RequiredFieldOptionsModel } from "./required-field-options.model";
import { TicketLogRequiredFieldModel } from "./ticket-log-required-field.model";

@Table({
	tableName: "required_fields",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class RequiredFieldsModel extends Model<RequiredFieldsModel> {
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

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	question_text: string;

	@Column({
		type: DataType.ENUM(...Object.values(RequiredFieldsType)),
		allowNull: false,
	})
	required_field_type: RequiredFieldsType;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	})
	is_required: boolean;

	@Column({
		type: DataType.JSON,
		allowNull: true,
	})
	settings: any;

	@BelongsTo(() => TicketModel)
	ticket: TicketModel;

	@HasMany(() => RequiredFieldOptionsModel)
	options: RequiredFieldOptionsModel[];

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
