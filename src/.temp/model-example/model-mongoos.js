const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const themeSchema = new Schema({
	name: {
		type: String,
		required: [true, 'درج نام انگلیسی الزامی است'],
		validate: {
			validator: (value) => /^[a-zA-Z]{1,}/.test(value),
			message: (props) => `نام انگلیسی معتبر نیست`,
		},
	},
	status: {
		type: String,
		required: false,
		default: null,
	},
});

const Example = mongoose.model('test', themeSchema);

export { Example };
export default Example;
