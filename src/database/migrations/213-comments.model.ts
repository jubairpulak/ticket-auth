import { QueryInterface, DataTypes } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			"comments",
			{
				id: {
					type: DataTypes.BIGINT,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				comment: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				attachment: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "employees", // References the employees table
						key: "id",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
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
		await queryInterface.dropTable("comments");
	},
};
