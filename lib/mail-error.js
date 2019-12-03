'use strict';

class MailError extends Error {

	static get codes() {

		return {
			REQUIRED_FIELD_MISSING: 1,
			INVALID_FIELD_TYPE: 2,
			NO_SERVICE_NAME: 3,
			MS_CALL_ERROR: 4
		};

	}

	constructor(err, code) {

		const message = err.message || err;

		super(message);
		this.message = message;
		this.code = code;
		this.name = 'MailError';

		if(err instanceof Error)
			this.previousError = err;
	}
}

module.exports = MailError;
