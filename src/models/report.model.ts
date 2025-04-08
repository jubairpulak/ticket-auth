import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { BusinessesModel } from "./business.model";
import { BusinessMembersModel } from "./business-member.model";

@Table({ tableName: "reports", timestamps: true })
export class ReportModel extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@ForeignKey(() => BusinessesModel)
	@Column({
		type: DataType.INTEGER.UNSIGNED,
		allowNull: true,
	})
	business_id: number;

	@ForeignKey(() => BusinessMembersModel)
	@Column({
		type: DataType.INTEGER.UNSIGNED,
		allowNull: true,
	})
	business_member_id: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		defaultValue: "pending",
	})
	status: string;
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	remarks: string;
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	startDate: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	endDate: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	name: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	fileUrl: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	downloadTime: number;

	@BelongsTo(() => BusinessesModel)
	business: BusinessesModel;

	@BelongsTo(() => BusinessMembersModel)
	businessMember: BusinessMembersModel;
}
