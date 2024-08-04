import { Op } from 'sequelize';

import { ServerResponse, Validation } from '../../utils/index.js';

import { Costs_Model } from './costs.model.js';

export class Costs_Controller {
	//---------------* SEARCH *---------------//
	static search = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { dateFrom } = query;

		const access = tokenData?.id;
		const validParams = true;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Costs = await Costs_Model.findAll({
				where: {
					userId: tokenData?.id,
					...(dateFrom && {
						date: {
							...(dateFrom && { [Op.gte]: new Date(dateFrom) }),
						},
					}),
				},
			});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Costs Successfully',
				body: { info: Costs || [] },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Costs',
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

			const Cost = await Costs_Model.findOne({ where: { id: itemId, userId: tokenData?.id } });

			const itemData = Cost?.dataValues;

			if (!itemData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Cost Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Get Cost Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Get Cost',
				error,
			});
		}
	};

	//---------------* SAVE *---------------//
	static save = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const { date, category, price, description } = body;

		const access = tokenData?.id;
		const validParams = category && date && price;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Cost = await Costs_Model.create({
				date: new Date(date).toISOString(),
				category: category,
				price: price,
				description: description || null,
				userId: tokenData?.id,
			});

			const itemData = Cost.dataValues;

			return ServerResponse.json(res, {
				success: true,
				message: 'Cost Created Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Creating Cost Error',
				error,
			});
		}
	};

	//---------------* UPDATE *---------------//
	static update = async (req, res, next) => {
		const { tokenData, query, params, body } = req || {};
		const itemId = params?.id;
		const { date, category, price, description } = body;

		const access = tokenData?.id;
		const validParams = date && category && price;

		try {
			if (!ServerResponse.checkValidation(res, { access, validParams })) return;

			const Cost = await Costs_Model.findOne({ where: { id: itemId, userId: tokenData?.id } });

			const itemData = Cost?.dataValues;

			if (!itemData)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Cost Not Found',
				});

			if (date) Cost.setDataValue('date', new Date(date).toISOString());
			if (category) Cost.setDataValue('category', category);
			if (price) Cost.setDataValue('price', price);
			if (description !== undefined) Cost.setDataValue('description', description || null);

			await Cost.save();

			ServerResponse.json(res, {
				success: true,
				message: 'Cost Update Successfully',
				body: { info: itemData },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Update Cost Error',
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

			const deletedId = await Costs_Model.destroy({
				where: {
					id: itemId,
					userId: tokenData?.id,
				},
			});

			if (!deletedId)
				return ServerResponse.json(res, {
					statusCode: 404,
					message: 'Cost Not Found',
				});

			ServerResponse.json(res, {
				success: true,
				message: 'Delete Cost Successfully',
				body: { info: { id: itemId } },
			});
		} catch (error) {
			return ServerResponse.json(res, {
				success: false,
				message: 'Fail To Delete Cost',
				error,
			});
		}
	};
}
