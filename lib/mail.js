'use strict';

const MicroserviceCall = require('@janiscommerce/microservice-call');

const MailError = require('./mail-error');
const MailValidator = require('./mail-validator');

const JANIS_MAILING_SERVICE = 'mailing';
const JANIS_MAILING_NAMESPACE = 'email';
const JANIS_MAILING_METHOD = 'create';

module.exports = class Mail {

	get mailingService() {
		return JANIS_MAILING_SERVICE;
	}

	get mailingNamespace() {
		return JANIS_MAILING_NAMESPACE;
	}

	get mailingMethod() {
		return JANIS_MAILING_METHOD;
	}

	constructor() {
		this._mail = {};
	}

	setTo(to) {
		this._mail.to = typeof to === 'string' ? [to] : to;
		return this;
	}

	/**
	 * Adds a cc emails.
	 *
	 * @param {string|array} cc CC emails
	 */
	setCC(cc) {
		this._mail.cc = typeof cc === 'string' ? [cc] : cc;
		return this;
	}

	/**
	 * Adds a bcc emails.
	 *
	 * @param {string|array} bcc The bcc emails
	 */
	setBCC(bcc) {
		this._mail.bcc = typeof bcc === 'string' ? [bcc] : bcc;
		return this;
	}

	/**
	 * Sets the reply to field.
	 *
	 * @param {string} replyTo The reply to emails
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
	 * Sets the user that triggered this email.
	 *
	 * @param {object} clientCode The clientCode
	 */
	setUserCreated(userCreated) {
		this._mail.userCreated = userCreated;
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

		if(this.session && this.session.userId && !this._mail.userCreated)
			this._mail.userCreated = this.session.userId;

		this._validateMail();

		const ms = this.session ? this.session.getSessionInstance(MicroserviceCall) : new MicroserviceCall();

		const headers = {};

		if(this.clientCode)
			headers['janis-client'] = this.clientCode;

		try {

			const response = await ms.call(this.mailingService, this.mailingNamespace, this.mailingMethod, this._mail, headers);

			return {
				id: response.body.id
			};

		} catch(err) {
			throw new MailError(err, MailError.codes.MS_CALL_ERROR);
		}
	}
};
