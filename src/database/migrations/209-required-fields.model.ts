import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"required_fields",
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
				question_text: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				required_field_type: {
					type: DataTypes.ENUM("TEXT", "NUMBER", "DATE", "SELECT"), // Replace with actual values from RequiredFieldsType
					allowNull: false,
				},
				is_required: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					defaultValue: true,
				},
				settings: {
					type: DataTypes.JSON,
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
		await queryInterface.dropTable("required_fields");
	},
};
