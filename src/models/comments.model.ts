import {
	Model,
	Column,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { TicketModel } from "./ticket.model";
import { EmployeeModel } from "./employee.model";

@Table({
	tableName: "comments",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	charset: "utf8mb4",
	collate: "utf8mb4_unicode_ci",
})
export class CommentsModel extends Model<CommentsModel> {
	@Column({
		type: DataType.BIGINT,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	comment: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	attachment: string;

	@ForeignKey(() => EmployeeModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	user_id: number;

	@ForeignKey(() => TicketModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	ticket_id: number;

	@BelongsTo(() => EmployeeModel)
	user: EmployeeModel;

	@BelongsTo(() => TicketModel)
	ticket: TicketModel;

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
