import { Model, Column, Table, DataType, HasMany } from "sequelize-typescript";
import { TicketModel } from "./ticket.model";

@Table({
	tableName: "categories",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class CategoryModel extends Model<CategoryModel> {
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
		type: DataType.INTEGER,
		allowNull: false,
	})
	workflow: number;

	@HasMany(() => TicketModel)
	tickets: TicketModel[];

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
