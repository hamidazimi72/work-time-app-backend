import { Op } from 'sequelize';

import { ServerResponse, Validation } from '../../utils/index.js';

import { Tasks_Model } from './tasks.model.js';

export class Tasks_Controller {
	//---------------* SEARCH *---------------//
	static search = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { dateFrom, dateTo, isComplete } = query;

		const access = tokenData?.id;
		const validParams = true;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Tasks = await Tasks_Model.findAll({
				where: {
					userId: tokenData?.id,
					...((dateFrom || dateTo) && {
						date: {
							...(dateFrom && { [Op.gte]: new Date(dateFrom) }),
							...(dateTo && { [Op.lte]: new Date(dateTo) }),
						},
					}),
					...(isComplete !== undefined && { isComplete: isComplete === 'true' ? true : false }),
				},
			});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Tasks Successfully',
				body: { info: Tasks || [] },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Tasks',
				error: error,
			});
		}
	};

	//---------------* GET *---------------//
	static get = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const itemId = params?.id;

		const access = tokenData?.id;
		const validParams = itemId;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Task = await Tasks_Model.findOne({ where: { id: itemId, userId: tokenData?.id } });

			const itemData = Task?.dataValues;

			if (!itemData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Task Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Task Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Task',
				error,
			});
		}
	};

	//---------------* SAVE *---------------//
	static save = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { title, date, isComplete } = body;

		const access = tokenData?.id;
		const validParams = title && date && isComplete !== undefined;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Task = await Tasks_Model.create({
				title: title,
				date: new Date(date).toISOString(),
				isComplete: !isComplete || isComplete === 'false' ? false : true,
				userId: tokenData?.id,
			});

			const itemData = Task.dataValues;

			return ServerResponse.json(res, {
				success: true,
				message: 'Task Created Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Creating Task Error',
				error,
			});
		}
	};

	//---------------* UPDATE *---------------//
	static update = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const itemId = params?.id;
		const { title, date, isComplete } = body;

		const access = tokenData?.id;
		const validParams = title && date && isComplete !== undefined;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Task = await Tasks_Model.findOne({ where: { id: itemId, userId: tokenData?.id } });

			const itemData = Task?.dataValues;

			if (!itemData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Task Not Found',
				});

			if (title) Task.setDataValue('title', title);
			if (date) Task.setDataValue('date', new Date(date).toISOString());
			if (isComplete !== undefined)
				Task.setDataValue('isComplete', isComplete === 'false' ? false : Boolean(isComplete));

			await Task.save();

			ServerResponse.json(res, {
				success: true,
				message: 'Task Update Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Update Task Error',
				error: error,
			});
		}
	};

	//---------------* DELETE *---------------//
	static delete = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const itemId = params?.id;

		const access = tokenData?.id;
		const validParams = itemId;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const deletedId = await Tasks_Model.destroy({
				where: {
					id: itemId,
					userId: tokenData?.id,
				},
			});

			if (!deletedId)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Task Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Delete Task Successfully',
				body: { info: { id: itemId } },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Delete Task',
				error,
			});
		}
	};
}
