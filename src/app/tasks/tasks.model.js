import { DataTypes } from 'sequelize';

import { sequelize } from '../../config/database.js';

export const Tasks_Model = sequelize.define(
	'Task',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isComplete: {
			type: DataTypes.BOOLEAN,
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
		tableName: 'tasks',
		timestamps: true,
	}
);

Tasks_Model.associate = (models) => {
	Tasks_Model.belongsTo(models.User, {
		foreignKey: 'userId',
		as: 'user',
	});
};
