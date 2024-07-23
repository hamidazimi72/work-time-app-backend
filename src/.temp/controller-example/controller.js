import { Example as ExampleModel } from '../../models/example.js';
import { Service } from '../../utils/index.js';

export class Example {
	static save = async (req, res, next) => {
		const { enName, faName, version, logo } = req.body;

		try {
			const result = await ExampleModel.create({ enName, faName, version, logo });
			res.send(Service.responseHandler(result));
		} catch (err) {
			res.send(Service.responseHandler(null, err));
		}
	};

	static fetchAll = async (req, res, next) => {
		try {
			const result = await ExampleModel.find();
			res.send(Service.responseHandler(result));
		} catch (err) {
			res.send(Service.responseHandler(null, err));
		}
	};

	static fetchId = async (req, res, next) => {
		const { id } = req.body;

		try {
			const result = await ExampleModel.findById(id);
			res.send(Service.responseHandler(result));
		} catch (err) {
			res.send(Service.responseHandler(null, err));
		}
	};

	static update = async (req, res, next) => {
		const { id, enName, faName, version, logo } = req.body;

		try {
			const result = await ExampleModel.findById(id);
			if (!result) return res.send(Service.responseHandler(result));
		} catch (err) {
			res.send(Service.responseHandler(null, err));
		}

		if (enName) result.enName = enName;
		if (faName) result.faName = faName;
		if (version) result.version = version;
		if (logo) result.logo = logo;

		try {
			await result.save();
			res.send(Service.responseHandler(result));
		} catch (err) {
			res.send(Service.responseHandler(null, err));
		}
	};

	static destroy = async (req, res, next) => {
		const { id } = req.body;

		try {
			const result = await ExampleModel.findByIdAndDelete(id);
			res.send(Service.responseHandler(result));
		} catch (err) {
			res.send(Service.responseHandler(null, err));
		}
	};
}

export default Example;
