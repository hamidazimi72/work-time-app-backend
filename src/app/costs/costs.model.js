import { DataTypes } from 'sequelize';

import { sequelize } from '../../config/database.js';

export const Costs_Model = sequelize.define(
	'Cost',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'users',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
	},
	{
		tableName: 'costs',
		timestamps: true,
	}
);

Costs_Model.associate = (models) => {
	Costs_Model.belongsTo(models.User, {
		foreignKey: 'userId',
		as: 'user',
	});
};
