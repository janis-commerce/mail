'use strict';

const MicroserviceCall = require('@janiscommerce/microservice-call');

const MailError = require('./mail-error');
const MailValidator = require('./mail-validator');

const JANIS_MAILING_SERVICE = 'mailing';
const JANIS_MAILING_NAMESPACE = 'email';
const JANIS_MAILING_METHOD = 'create';

class Mail {

	get _mailingService() {
		return JANIS_MAILING_SERVICE;
	}

	get _mailingNamespace() {
		return JANIS_MAILING_NAMESPACE;
	}

	get _mailingMethod() {
		return JANIS_MAILING_METHOD;
	}

	constructor() {
		this._mail = {};
		return this;
	}

	setTo(to) {
		this._mail.to = to;
		return this;
	}

	/**
	 * Adds a cc emails.
	 *
	 * @param {string|array} cc CC emails
	 */
	setCC(cc) {
		this._mail.cc = cc;
		return this;
	}

	/**
	 * Adds a bcc emails.
	 *
	 * @param {string|array} bcc The bcc emails
	 */
	setBCC(bcc) {
		this._mail.bcc = bcc;
		return this;
	}

	/**
	 * Sets the reply to field.
	 *
	 * @param {<type>} replyTo The reply to emails
	 */
	setReplyTo(replyTo) {
		this._mail.replyTo = replyTo;
		return this;
	}

	/**
	 * Sets the template code.
	 *
	 * @param {string} templateCode The template code
	 */
	setTemplateCode(templateCode) {
		this._mail.templateCode = templateCode;
		return this;
	}

	/**
	 * Sets the subject.
	 *
	 * @param {string} subject The subject
	 */
	setSubject(subject) {
		this._mail.subject = subject;
		return this;
	}

	/**
	 * Sets the entity associate to the email.
	 *
	 * @param {string|number} entity The entity
	 */
	setEntity(entity) {
		this._mail.entity = entity;
		return this;
	}

	/**
	 * Sets the entity identifier.
	 *
	 * @param {string|number} entityId The entity identifier
	 */
	setEntityId(entityId) {
		this._mail.entityId = entityId;
		return this;
	}

	/**
	 * Sets the data.
	 *
	 * @param {object} data The data
	 */
	setData(data) {
		this._mail.data = data;
		return this;
	}

	/**
	 * Sets the body.
	 *
	 * @param {object} body The body
	 */
	setBody(body) {
		this._mail.body = body;
		return this;
	}

	/**
	 * Sets the clientCode.
	 *
	 * @param {object} clientCode The clientCode
	 */
	setClientCode(clientCode) {
		this.clientCode = clientCode;
		return this;
	}

	/**
	 * Validate email data
	 */
	_validateMail() {

		const mailValidator = new MailValidator(this);

		mailValidator.validateRequiredFields();

		mailValidator.validateFieldTypes();
	}

	/**
	 * Send the email
	 *
	 * @return {Object} The response of the MicroserviceCall
	 */
	async send() {

		this._validateMail();

		// if(this.session)
		// 	ms = this.session.getSessionInstance(MicroserviceCall);
		// else
		// 	ms = new MicroserviceCall();
		// console.log('microserviceCall:', MicroserviceCall);

		// const ms = this.session ? this.session.getSessionInstance(MicroserviceCall) : new MicroserviceCall();

		const ms = new MicroserviceCall();

		if(this.session)
			ms.session = this.session;

		const headers = {};

		if(this.clientCode)
			headers['janis-client'] = this.clientCode;

		try {

			const response = await ms.post(this._mailingService, this._mailingNamespace, this._mailingMethod, this._mail, headers);

			return {
				id: response.body.id
			};

		} catch(err) {
			throw new MailError(err, MailError.codes.MS_CALL_ERROR);
		}
	}
}

module.exports = Mail;
