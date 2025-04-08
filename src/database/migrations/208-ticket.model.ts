import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"tickets",
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				ticket_generated_id: {
					type: DataTypes.STRING(50),
					allowNull: false,
					unique: true,
				},
				name: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				department_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "departments", // References the departments table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				category_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "categories", // References the categories table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				priority: {
					type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"), // Replace with actual values from ShiftPriorityEnum
					allowNull: false,
					defaultValue: "MEDIUM",
				},
				status: {
					type: DataTypes.ENUM("ACTIVE", "INACTIVE", "RESOLVED"), // Replace with actual values from TicketStatus
					allowNull: false,
					defaultValue: "ACTIVE",
				},
				tags: {
					type: DataTypes.JSON,
					allowNull: true,
				},
				created_by: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "employees", // References the employees table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
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
		await queryInterface.dropTable("tickets");
	},
};
