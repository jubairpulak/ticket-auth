import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"ticket_log_required_fields",
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				ticket_log_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "ticket_logs", // References the ticket_logs table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				required_field_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "required_fields", // References the required_fields table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				required_field_option_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: "required_field_options", // References the required_field_options table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "SET NULL",
				},
				value: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				created_at: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				updated_at: {
					type: DataTypes.DATE,
					allowNull: false,
				},
			},
			{
				charset: "utf8mb4",
				collate: "utf8mb4_unicode_ci",
			},
		);
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable("ticket_log_required_fields");
	},
};
