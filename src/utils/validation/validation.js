export class Validation {
	static isValidSlots = (
		value,
		slots = [{ validation: /^$/, message: '' }],
		options = { optional: false, regexNames: [] }
	) => {
		const result = { isValid: true, invalidSlotIndex: null, invalidSlot: null, regexError: null };

		if (options?.optional && (value === '' || value === null || value === undefined)) return result;

		if (options?.regexNames instanceof Array) {
			options.regexNames.map((regexName) => {
				if (this.regex[regexName] && result.isValid) {
					const isValidOption = this.regex[regexName].test(value || '');

					if (!isValidOption) {
						result.isValid = false;
						result.regexError = regexName;
					}
				}

				if (!result.isValid) return result;
			});
		}

		if (!(slots instanceof Array)) return result;

		const invalidSlotIndex = slots.findIndex((slot) => {
			let isValidSlot = false;

			if ('validation' in slot) {
				if (slot.validation instanceof RegExp) isValidSlot = slot.validation.test(value || '');
				else if (slot.validation instanceof Function) isValidSlot = Boolean(slot.validation(value));
				else isValidSlot = Boolean(slot.validation);

				if (!isValidSlot) return true;
			}

			return !isValidSlot;
		});

		if (invalidSlotIndex > -1) {
			result.isValid = false;
			result.invalidSlotIndex = invalidSlotIndex;
			result.invalidSlot = slots[invalidSlotIndex];
		}

		return result;
	};

	static formValidation = (args = {}) => {
		let result = {
			invalidItem: null,
			invalidItemName: null,
			isValid: true,
			invalidSlotIndex: null,
			invalidSlot: null,
			regexError: null,
		};

		if (!(args instanceof Object)) return result;

		Object.entries(args).map(([argName, argValue]) => {
			if (!result?.isValid) return;

			const argValidation = this.isValidSlots(argValue?.value, argValue?.slots || [], argValue?.options || {});

			if (!argValidation?.isValid) {
				result = { ...argValidation };
				result.invalidItem = argValue;
				result.invalidItemName = argName;
			}
		});

		return result;
	};

	static regex = {
		userId: /^\d{1,20}$/,
		username: /^.{3,}$/,
		password: /^.{3,}$/,
		singleNumber: /^\d{1,}$/,
		floatNumber: /^[0-9]{1,}[.]{0,1}[0-9]{0,}$/,
	};
}
