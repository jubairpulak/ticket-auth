import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import { ProfilesModel } from "./profile.model";
import { BusinessMembersModel } from "./business-member.model";

//@Table({ tableName: 'members', timestamps: true })
@Table({ tableName: "members" })
export class MembersModel extends Model {
	@Column({
		type: DataType.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	remember_token: string;

	@ForeignKey(() => ProfilesModel)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	profile_id: number; // Primary key of profiles table

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	emergency_contract_person_number: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	emergency_contract_person_relationship: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	emergency_contract_person_name: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
	})
	created_by: number; // Profiles table primary key

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	created_by_name: string; // Profiles table name

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false,
		//allowNull: true
	})
	updated_by: number; // Profiles table primary key

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	updated_by_name: string; // Profiles table name

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		allowNull: false,
	})
	created_at: Date;

	@Column({
		type: DataType.DATE,
		//defaultValue: DataType.NOW,
		allowNull: true, // maybe allowNull: true
	})
	updated_at: Date;

	// @Column({
	//   type: DataType.DATE,
	//   allowNull: true,
	// })
	// deletedAt: Date;

  	// Relationship
	@BelongsTo(() => ProfilesModel, { foreignKey: 'profile_id', as: 'profile' })
	profile: ProfilesModel;

	@HasMany(() => BusinessMembersModel)
	businessMembers: BusinessMembersModel[];
}
