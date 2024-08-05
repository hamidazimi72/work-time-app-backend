import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { ServerResponse, Validation } from '../../utils/index.js';

import { Users_Model } from './users.model.js';

export class Users_Controller {
	//---------------* SEARCH *---------------//
	static search = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};

		const access = true;
		const validParams = true;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Users = await Users_Model.findAll({
				attributes: { exclude: ['password'] },
			});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Users Successfully',
				body: { info: Users || [] },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Users',
				error: error,
			});
		}
	};

	//---------------* GET *---------------//
	static get = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const userId = params?.id;

		const access = tokenData?.role === 'admin' || tokenData?.id == userId;
		const validParams = Validation.regex.userId.test(userId || '');

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const User = await Users_Model.findByPk(userId, {
				attributes: { exclude: ['password'] },
			});

			const userData = User?.dataValues;

			if (!userData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'User Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Get User Successfully',
				body: { info: userData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get User',
				error,
			});
		}
	};

	//---------------* SAVE *---------------//
	static save = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { username, password, nationalNumber, mobile, firstname, lastname } = body;

		const access = true;
		const validParams =
			Validation.regex.username.test(username || '') && Validation.regex.password.test(password || '');

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const hashedPassword = await bcrypt.hash(password, 10);

			const User = await Users_Model.create({
				username: username,
				password: hashedPassword,
				nationalNumber: nationalNumber || null,
				mobile: mobile || null,
				firstname: firstname || null,
				lastname: lastname || null,
			});

			const userData = User.dataValues;

			const token = jwt.sign(
				{ id: userData.id, username: userData.username, role: userData.role },
				process.env.JWT_SECRET_KEY,
				{
					expiresIn: '24h',
				}
			);

			return ServerResponse.json(res, {
				success: true,
				message: 'User Registered Successfully',
				body: { info: { ...userData, password: undefined }, token: token },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Registering User Error',
				error,
			});
		}
	};

	//---------------* UPDATE *---------------//
	static update = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const userId = params?.id;
		const { currentPassword, password, username, nationalNumber, mobile, firstname, lastname } = body;

		const access = tokenData?.role === 'admin' || tokenData?.id == userId;
		const validParams = Validation.regex.userId.test(userId || '') && currentPassword;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const User = await Users_Model.findByPk(userId);
			const userData = User?.dataValues;

			if (!userData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'User Not Found',
				});

			const isMatchPassword = await bcrypt.compare(currentPassword, userData.password);

			if (!isMatchPassword)
				return ServerResponse.json(res, {
					success: false,
					message: 'Password Not Match',
				});

			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);
				User.setDataValue('password', hashedPassword);
			}

			if (username) User.setDataValue('username', username);
			if (nationalNumber) User.setDataValue('nationalNumber', nationalNumber);
			if (mobile) User.setDataValue('mobile', mobile);
			if (firstname) User.setDataValue('firstname', firstname);
			if (lastname) User.setDataValue('lastname', lastname);

			await User.save();

			ServerResponse.json(res, {
				success: true,
				message: 'User Update Successfully',
				body: { info: { ...userData, password: undefined } },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Update User Error',
				error: error,
			});
		}
	};

	//---------------* DELETE *---------------//
	static delete = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const userId = params?.id;

		const access = tokenData?.role === 'admin' || tokenData?.id == userId;
		const validParams = Validation.regex.userId.test(userId || '');

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const deletedId = await Users_Model.destroy({
				where: {
					id: userId,
				},
			});

			if (!deletedId)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'User Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Delete User Successfully',
				body: { info: { id: userId } },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Delete User',
				error,
			});
		}
	};

	//---------------* LOGIN *---------------//
	static login = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { username, password } = body;

		const access = true;
		const validParams =
			Validation.regex.username.test(username || '') && Validation.regex.password.test(password || '');

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const User = await Users_Model.findOne({ where: { username } });

			const userData = User?.dataValues;

			if (!userData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'User Not Found',
				});

			const isMatchPassword = await bcrypt.compare(password, userData.password);

			if (!isMatchPassword)
				return ServerResponse.json(res, {
					success: false,
					message: 'User and Pass Not Match',
				});

			const token = jwt.sign(
				{ id: userData.id, username: userData.username, role: userData.role },
				process.env.JWT_SECRET_KEY,
				{
					expiresIn: '24h',
				}
			);

			ServerResponse.json(res, {
				success: true,
				message: 'User Login Successfully',
				body: { info: { ...userData, password: undefined }, token: token },
			});
		} catch (error) {
			ServerResponse.json(res, {
				success: false,
				message: 'Login User Error',
				error,
			});
		}
	};
}
