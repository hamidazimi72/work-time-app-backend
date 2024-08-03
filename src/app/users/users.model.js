import { DataTypes } from 'sequelize';

import { sequelize } from '../../config/database.js';

export const Users_Model = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		role: {
			type: DataTypes.ENUM('user', 'admin'),
			defaultValue: 'user',
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nationalNumber: {
			type: DataTypes.CHAR(10),
			unique: true,
		},
		mobile: {
			type: DataTypes.CHAR(11),
			unique: true,
		},
		firstname: {
			type: DataTypes.STRING,
		},
		lastname: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: 'users',
		timestamps: true,
	}
);

Users_Model.associate = (models) => {
	Users_Model.hasMany(models.Task, {
		foreignKey: 'userId',
		as: 'tasks',
	});
};
