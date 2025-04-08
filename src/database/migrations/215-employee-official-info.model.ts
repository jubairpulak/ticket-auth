import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn("employee_official_info", "role", {
			type: DataTypes.STRING(255),
			allowNull: false,
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn("employee_official_info", "role");
	},
};
