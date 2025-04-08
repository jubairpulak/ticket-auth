import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"employees",
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
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
		await queryInterface.dropTable("employees");
	},
};
