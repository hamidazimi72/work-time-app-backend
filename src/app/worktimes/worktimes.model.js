import { DataTypes } from 'sequelize';

import { sequelize } from '../../config/database.js';

export const Worktimes_Model = sequelize.define(
	'Worktime',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		arrivalDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		departureDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isVacation: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
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
		tableName: 'worktimes',
		timestamps: true,
	}
);

Worktimes_Model.associate = (models) => {
	Worktimes_Model.belongsTo(models.User, {
		foreignKey: 'userId',
		as: 'user',
	});
};
