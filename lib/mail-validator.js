'use strict';

const MailError = require('./mail-error');

class MailValidator {

	constructor({ _mail, clientCode, session }) {
		this.mail = _mail;
		this.clientCode = clientCode;
		this.session = session;
	}

	validateRequiredFields() {

		if(typeof this.mail.templateCode === 'undefined' && typeof this.mail.body === 'undefined')
			throw new MailError('Empty field: templateCode or body property is required', MailError.codes.REQUIRED_FIELD_MISSING);

		if(typeof this.mail.templateCode === 'undefined' && typeof this.mail.to === 'undefined')
			throw new MailError('Empty field: to property is required when templateCode is not setted', MailError.codes.REQUIRED_FIELD_MISSING);

		if(typeof this.mail.templateCode === 'undefined' && typeof this.mail.subject === 'undefined')
			throw new MailError('Empty field: subject property is required when templateCode is not setted', MailError.codes.REQUIRED_FIELD_MISSING);

		if(typeof this.clientCode === 'undefined' && typeof this.session === 'undefined')
			throw new MailError('Empty field: clientCode or SessionInstance property is required to send a email', MailError.codes.REQUIRED_FIELD_MISSING);
	}

	validateFieldTypes() {

		if(typeof this.mail.templateCode !== 'undefined' && typeof this.mail.templateCode !== 'string' && typeof this.mail.templateCode !== 'number')
			throw new MailError('Invalid mail: templateCode property must be a string or number', MailError.codes.INVALID_FIELD_TYPE);

		// Should be a string
		if(typeof this.clientCode !== 'undefined' && typeof this.clientCode !== 'string')
			throw new MailError('Invalid mail: clientCode property must be a string', MailError.codes.INVALID_FIELD_TYPE);

		if(typeof this.mail.templateCode === 'undefined' && !Array.isArray(this.mail.to) && typeof this.mail.to !== 'string')
			throw new MailError('Invalid mail: to property must be an array or string', MailError.codes.INVALID_FIELD_TYPE);

		// Should be an object (not array)
		if(typeof this.mail.data !== 'undefined' && typeof this.mail.data !== 'object')
			throw new MailError('Invalid mail: data property should be a object', MailError.codes.INVALID_FIELD_TYPE);

		// Should be a string
		if(typeof this.mail.subject !== 'undefined' && typeof this.mail.subject !== 'string' && typeof this.mail.subject !== 'number')
			throw new MailError('Invalid mail: subject property should be a string or number', MailError.codes.INVALID_FIELD_TYPE);

		// Should be an array or string
		if(typeof this.mail.cc !== 'undefined' && (!Array.isArray(this.mail.cc) && typeof this.mail.cc !== 'string'))
			throw new MailError('Invalid mail: cc property must be an array or string', MailError.codes.INVALID_FIELD_TYPE);

		// Should be an array or string
		if(typeof this.mail.bcc !== 'undefined' && (!Array.isArray(this.mail.bcc) && typeof this.mail.bcc !== 'string'))
			throw new MailError('Invalid mail: bcc property must be an array or string', MailError.codes.INVALID_FIELD_TYPE);

		// Should be an array or string
		if(typeof this.mail.replyTo !== 'undefined' && (!Array.isArray(this.mail.replyTo) && typeof this.mail.replyTo !== 'string'))
			throw new MailError('Invalid mail: replyTo property must be an array or string', MailError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		if(typeof this.mail.entity !== 'undefined' && (typeof this.mail.entity !== 'string' && typeof this.mail.entity !== 'number'))
			throw new MailError('Invalid mail: entity property must be an string or number', MailError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		if(typeof this.mail.entityId !== 'undefined' && (typeof this.mail.entityId !== 'string' && typeof this.mail.entityId !== 'number'))
			throw new MailError('Invalid mail: entityId property must be an string or number', MailError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		if(typeof this.mail.body !== 'undefined' && typeof this.mail.body !== 'string')
			throw new MailError('Invalid mail: body property must be a string', MailError.codes.INVALID_FIELD_TYPE);
	}
}

module.exports = MailValidator;
