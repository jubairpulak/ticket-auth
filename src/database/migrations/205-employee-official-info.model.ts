import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"employee_official_info",
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				employee_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "employees", // References the employees table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				name: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING(255),
					allowNull: false,
					unique: true,
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
				line_manager: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				date_of_joining: {
					type: DataTypes.DATEONLY,
					allowNull: false,
				},
				employee_type: {
					type: DataTypes.STRING(50),
					allowNull: false,
				},
				giver_employee_id: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				grade: {
					type: DataTypes.STRING(50),
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
		await queryInterface.dropTable("employee_official_info");
	},
};
