import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"employee_personal_info",
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
				gender: {
					type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"), // Replace with actual values from Gender enum
					allowNull: false,
				},
				phone: {
					type: DataTypes.STRING(20),
					allowNull: true,
				},
				date_of_birth: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				address: {
					type: DataTypes.STRING(255),
					allowNull: true,
				},
				nationality: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				nid: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				passport: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				blood_group: {
					type: DataTypes.ENUM(
						"A+",
						"A-",
						"B+",
						"B-",
						"O+",
						"O-",
						"AB+",
						"AB-",
					), // Replace with actual values from BloodGroup enum
					allowNull: true,
				},
				social_media: {
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
		await queryInterface.dropTable("employee_personal_info");
	},
};
