import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { RequiredFieldsModel } from "./required-fields.model";

@Table({
	tableName: "required_field_options",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class RequiredFieldOptionsModel extends Model<RequiredFieldOptionsModel> {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@ForeignKey(() => RequiredFieldsModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	required_field_id: number;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	required_field_option: string;

	@BelongsTo(() => RequiredFieldsModel)
	requiredField: RequiredFieldsModel;

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
