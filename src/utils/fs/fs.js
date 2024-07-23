import fs from 'fs';

export class FS {
	//____________________** WRITE **____________________ //
	static writeFileSync = (filePath = '', data = '', options = {}) => {
		const result = { err: null, data: null };
		try {
			fs.writeFileSync(filePath, data, options);
		} catch (err) {
			result.err = err;
		}
		return result;
	};

	static writeFilePromise = (filePath = '', data = '', options = {}) => {
		return fs.promises
			.writeFile(filePath, data, options)
			.then(() => ({ err: null, data: null }))
			.catch((err) => ({ err, data: null }));
	};

	static writeFileCB = (filePath = '', data = '', options = {}, cb = ({ err, data }) => {}) => {
		fs.writeFile(filePath, data, options, (err) => {
			if (typeof cb === 'function') cb({ err, data: null });
		});
	};

	//____________________** READ **____________________ //
	static readFileSync = (filePath = '', options = { encoding: 'utf-8' }) => {
		const result = { err: null, data: null };
		try {
			const data = fs.readFileSync(filePath, options);
			result.data = data;
		} catch (err) {
			result.err = err;
		}
		return result;
	};

	static readFilePromise = (filePath = '', options = { encoding: 'utf-8' }) => {
		return fs.promises
			.readFile(filePath, options)
			.then((data) => ({ err: null, data }))
			.catch((err) => ({ err, data: null }));
	};

	static readFileCB = (filePath = '', options = { encoding: 'utf-8' }, cb = ({ err, data }) => {}) => {
		fs.readFile(filePath, options, (err, data) => {
			if (typeof cb === 'function') cb({ err, data });
		});
	};

	//____________________** APPEND **____________________ //
	static appendFileSync = (filePath = '', data = '', options = {}) => {
		const result = { err: null, data: null };
		try {
			fs.appendFileSync(filePath, data, options);
		} catch (err) {
			result.err = err;
		}
		return result;
	};

	static appendFilePromise = (filePath = '', data = '', options = {}) => {
		return fs.promises
			.appendFile(filePath, data, options)
			.then(() => ({ err: null, data: null }))
			.catch((err) => ({ err, data: null }));
	};

	static appendFileCB = (filePath = '', data = '', options = {}, cb = ({ err, data }) => {}) => {
		fs.appendFile(filePath, data, options, (err) => {
			if (typeof cb === 'function') cb({ err, data: null });
		});
	};

	//____________________** COPY **____________________ //
	static copyFileSync = (filePath = '', copyPath = '') => {
		const result = { err: null, data: null };
		try {
			fs.copyFileSync(filePath, copyPath);
		} catch (err) {
			result.err = err;
		}
		return result;
	};

	static copyFilePromise = (filePath = '', copyPath = '') => {
		return fs.promises
			.copyFile(filePath, copyPath)
			.then(() => ({ err: null, data: null }))
			.catch((err) => ({ err, data: null }));
	};

	static copyFileCB = (filePath = '', data = '', cb = ({ err, data }) => {}) => {
		fs.copyFile(filePath, data, (err) => {
			if (typeof cb === 'function') cb({ err, data: null });
		});
	};

	//____________________** UNLINK **____________________ //
	static unlinkFileSync = (filePath = '') => {
		const result = { err: null, data: null };
		try {
			fs.unlinkSync(filePath);
		} catch (err) {
			result.err = err;
		}
		return result;
	};

	static unlinkFilePromise = (filePath = '') => {
		return fs.promises
			.unlink(filePath)
			.then(() => ({ err: null, data: null }))
			.catch((err) => ({ err, data: null }));
	};

	static unlinkFileCB = (filePath = '', cb = ({ err, data }) => {}) => {
		fs.unlink(filePath, (err) => {
			if (typeof cb === 'function') cb({ err, data: null });
		});
	};
}
