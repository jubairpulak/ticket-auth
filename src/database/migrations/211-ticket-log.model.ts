import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"ticket_logs",
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				ticket_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "tickets", // References the tickets table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				required_field_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: "required_fields", // References the required_fields table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "SET NULL",
				},
				raised_by: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "employees", // References the employees table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				approved_by: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: "employees", // References the employees table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "SET NULL",
				},
				bypass: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				time: {
					type: DataTypes.TIME,
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
		await queryInterface.dropTable("ticket_logs");
	},
};
