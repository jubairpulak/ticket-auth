import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn("employee_personal_info", "password", {
			type: DataTypes.STRING,
			allowNull: true,
		});

		await queryInterface.addColumn(
			"employee_personal_info",
			"mobile_token",
			{
				type: DataTypes.STRING,
				allowNull: true,
			},
		);

		await queryInterface.addColumn("employee_personal_info", "email", {
			type: DataTypes.STRING,
			allowNull: true,
		});

		await queryInterface.addColumn(
			"employee_personal_info",
			"email_verified",
			{
				type: DataTypes.INTEGER,
				defaultValue: 0, // value is 0 or 1
				allowNull: false,
			},
		);
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn("employee_personal_info", "password");
		await queryInterface.removeColumn(
			"employee_personal_info",
			"mobile_token",
		);
		await queryInterface.removeColumn("employee_personal_info", "email");
		await queryInterface.removeColumn(
			"employee_personal_info",
			"email_verified",
		);
	},
};
