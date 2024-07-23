import { ServerResponse, Validation } from '../../utils/index.js';

export class User {
	static search = async (req, res, next) => {
		//
		const [startIndex, endIndex] = [req?.query?.startIndex, req?.query?.endIndex];

		const formValidation = {
			startIndex: {
				value: startIndex,
				slots: [
					{ validation: Validation.regex.singleNumber, message: 'startIndex Not Valid' },
					{ validation: +startIndex >= 0, message: 'startIndex must be possitive' },
				],
				options: { optional: true },
			},
			endIndex: {
				value: endIndex,
				slots: [
					{ validation: Validation.regex.singleNumber, message: 'endIndex Not Valid' },
					{ validation: +endIndex >= 0, message: 'endIndex must be possitive' },
					{ validation: +endIndex >= +startIndex, message: 'endIndex must be bigger than startIndex' },
				],
				options: { optional: startIndex === null || startIndex === undefined },
			},
		};

		const validationResult = Validation.formValidation(formValidation);

		if (validationResult.isValid)
			return ServerResponse.json(res, {
				success: true,
				message: 'success',
				body: [],
				total: 0,
			});
		else
			return ServerResponse.json(res, {
				success: false,
				message: validationResult?.invalidSlot?.message,
			});
	};

	static get = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: { id: -1 } });
	};

	static save = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: { id: -1 } });
	};

	static edit = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: null });
	};

	static delete = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: null });
	};
}
