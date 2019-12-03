'use strict';

const assert = require('assert');

const MailError = require('../lib/mail-error');

describe('Mail  Error', () => {

	it('Should accept a message error and a code', () => {
		const error = new MailError('Some error', MailError.codes.INVALID_REQUEST_DATA);

		assert.strictEqual(error.message, 'Some error');
		assert.strictEqual(error.code, MailError.codes.INVALID_REQUEST_DATA);
		assert.strictEqual(error.name, 'MailError');
	});

	it('Should accept an error instance and a code', () => {

		const previousError = new Error('Some error');

		const error = new MailError(previousError, MailError.codes.INVALID_REQUEST_DATA);

		assert.strictEqual(error.message, 'Some error');
		assert.strictEqual(error.code, MailError.codes.INVALID_REQUEST_DATA);
		assert.strictEqual(error.name, 'MailError');
		assert.strictEqual(error.previousError, previousError);
	});
});
