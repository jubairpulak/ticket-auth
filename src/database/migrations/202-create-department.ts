import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"departments",
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				department_id: {
					type: DataTypes.STRING(50),
					allowNull: false,
					unique: true,
				},
				parent_company: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "companies", // References the companies table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				head_of_department: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				status: {
					type: DataTypes.ENUM("ACTIVE", "INACTIVE"), // Replace with actual values from DepartmentStatus
					allowNull: false,
					defaultValue: "ACTIVE",
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
		await queryInterface.dropTable("departments");
	},
};
