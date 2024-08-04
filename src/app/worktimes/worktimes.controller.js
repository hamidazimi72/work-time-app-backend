import { Op } from 'sequelize';

import { ServerResponse, Validation } from '../../utils/index.js';

import { Worktimes_Model } from './worktimes.model.js';

export class Worktimes_Controller {
	//---------------* SEARCH *---------------//
	static search = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { arrivalDateFrom, arrivalDateTo } = query;

		const access = tokenData?.id;
		const validParams = true;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Worktimes = await Worktimes_Model.findAll({
				where: {
					userId: tokenData?.id,
					...((arrivalDateFrom || arrivalDateTo) && {
						arrivalDate: {
							...(arrivalDateFrom && { [Op.gte]: new Date(arrivalDateFrom) }),
							...(arrivalDateTo && { [Op.lte]: new Date(arrivalDateTo) }),
						},
					}),
				},
			});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Worktimes Successfully',
				body: { info: Worktimes || [] },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Worktimes',
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

			const Worktime = await Worktimes_Model.findOne({ where: { id: itemId, userId: tokenData?.id } });

			const itemData = Worktime?.dataValues;

			if (!itemData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Worktime Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Worktime Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Worktime',
				error,
			});
		}
	};

	//---------------* SAVE *---------------//
	static save = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { arrivalDate, departureDate, isVacation } = body;

		const access = tokenData?.id;
		const validParams = arrivalDate && departureDate && isVacation !== undefined;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Worktime = await Worktimes_Model.create({
				arrivalDate: new Date(arrivalDate).toISOString(),
				departureDate: new Date(departureDate).toISOString(),
				isVacation: !isVacation || isVacation === 'false' ? false : true,
				userId: tokenData?.id,
			});

			const itemData = Worktime.dataValues;

			return ServerResponse.json(res, {
				success: true,
				message: 'Worktime Created Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Creating Worktime Error',
				error,
			});
		}
	};

	//---------------* UPDATE *---------------//
	static update = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const itemId = params?.id;
		const { arrivalDate, departureDate, isVacation } = body;

		const access = tokenData?.id;
		const validParams = arrivalDate && departureDate && isVacation !== undefined;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Worktime = await Worktimes_Model.findOne({ where: { id: itemId, userId: tokenData?.id } });

			const itemData = Worktime?.dataValues;

			if (!itemData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Worktime Not Found',
				});

			if (arrivalDate) Worktime.setDataValue('arrivalDate', new Date(arrivalDate).toISOString());
			if (departureDate) Worktime.setDataValue('departureDate', new Date(departureDate).toISOString());
			if (isVacation !== undefined)
				Worktime.setDataValue('isVacation', isVacation === 'false' ? false : Boolean(isVacation));

			await Worktime.save();

			ServerResponse.json(res, {
				success: true,
				message: 'Worktime Update Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Update Worktime Error',
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

			const deletedId = await Worktimes_Model.destroy({
				where: {
					id: itemId,
					userId: tokenData?.id,
				},
			});

			if (!deletedId)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Worktime Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Delete Worktime Successfully',
				body: { info: { id: itemId } },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Delete Worktime',
				error,
			});
		}
	};
}
