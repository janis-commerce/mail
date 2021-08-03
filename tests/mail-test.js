'use strict';

const MicroserviceCall = require('@janiscommerce/microservice-call');
const assert = require('assert');

const sinon = require('sinon');

const { Mail, MailError } = require('../lib');

const JANIS_MAILING_SERVICE = 'mailing';
const JANIS_MAILING_NAMESPACE = 'email';
const JANIS_MAILING_METHOD = 'create';
let headers = {};

describe('Mail', () => {

	beforeEach(() => {
		sinon.stub(MicroserviceCall.prototype, 'call');
	});

	afterEach(() => {
		sinon.restore();
	});

	const prepareErrorData = (code, message) => {
		return {
			name: 'MailError',
			message,
			code
		};
	};

	const session = {
		userId: '5d1fc1eeb5b68406e0487a06',
		userIsDev: true,
		clientId: '5d1fc1eeb5b68406e0487a07',
		clientCode: 'fizzmodarg',
		profileId: '5d1fc1eeb5b68406e0487a08',
		permissions: [],
		getSessionInstance: TheClass => {
			const instance = new TheClass();
			instance.session = session;
			return instance;
		}
	};

	describe('Send', () => {

		describe('Mail structure required validations', () => {

			it('Should throw when the values templateCode and body are missing', async () => {

				const mail = new Mail();

				await assert.rejects(mail.send(), prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: templateCode or body property is required'
				));
			});

			it('Should throw when the value to is missing and body is set', async () => {

				const mail = new Mail();

				await assert.rejects(mail.setBody('string').send(), prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: to property is required when templateCode is not set'
				));
			});

			it('Should throw when the value clientCode is missing and the session is not set', async () => {

				const mail = new Mail();

				await assert.rejects(mail.setBody('string')
					.setTo('example@example.com')
					.setSubject('crazy subject')
					.send(),
				prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: clientCode or SessionInstance property is required to send a email'
				));
			});

			it('Should throw when the value subject is missing and body is set', async () => {

				const mail = new Mail();

				await assert.rejects(mail.setBody('string')
					.setTo('example@example.com')
					.send(),
				prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: subject property is required when templateCode is not set'
				));
			});
		});

		describe('Mail structure field types', () => {

			it('Should throw when the value \'to\' are not a string or array', async () => {

				const mail = new Mail();

				const mailData = mail.setTo({ wrongField: 'string' })
					.setBody('body string')
					.setClientCode('clientCode')
					.setSubject('crazy subject')
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: to property must be an array or string'));
			});

			it('Should throw when the value \'templateCode\' are not a string or array', async () => {

				const mail = new Mail();

				const mailData = mail.setTemplateCode({ templateCode: 'template-code' })
					.setClientCode('clientCode')
					.send();

				await assert.rejects(mailData, prepareErrorData(
					MailError.codes.INVALID_FIELD_TYPE,
					'Invalid mail: templateCode property must be a string or number'
				));
			});

			it('Should throw when the value \'cc\' are not a string or array', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setCC({ CC: 'cc addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: cc property must be an array or string'));
			});

			it('Should throw when the value \'bcc\' are not a string or array', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setBCC({ BCC: 'bcc addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: bcc property must be an array or string'));
			});

			it('Should throw when the value \'replyTo\' are not a string or array', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setReplyTo({ replyTo: 'replyTo addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: replyTo property must be an array or string'));
			});

			it('Should throw when the value \'entity\' are not a string or number', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setEntity({ entity: 'entity addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: entity property must be an string or number'));
			});

			it('Should throw when the value \'entityId\' are not a string or number', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setEntityId({ entityId: 'entityId addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(
					MailError.codes.INVALID_FIELD_TYPE,
					'Invalid mail: entityId property must be an string or number'
				));
			});

			it('Should throw when the value \'subject\' are not a string or number', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setSubject({ subject: 'subject addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(
					MailError.codes.INVALID_FIELD_TYPE,
					'Invalid mail: subject property should be a string or number'
				));
			});

			it('Should throw when the value \'data\' are not a object', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setData('data in string')
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: data property should be a object'));
			});

			it('Should throw when the value of \'clientCode\' is not a string', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setEntity('addresses')
					.setClientCode({ entity: 'entity addresses' })
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: clientCode property must be a string'));
			});

			it('Should throw when the value of \'body\' is not a string', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setBody({ entity: 'entity addresses' })
					.setClientCode('clientCode')
					.setSubject('crazy subject')
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: body property must be a string'));
			});

			it('Should throw when the value of \'userCreated\' is not a string', async () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setEntity('addresses')
					.setClientCode('clientCode')
					.setUserCreated({ notValid: 'userId' })
					.send();

				await assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: userCreated property must be a string'));
			});
		});

		describe('Send email through the microserviceCall package', () => {

			it('Should throw when the MicroserviceCall throws', async () => {

				const microserviceCallError = {
					name: 'MailError',
					code: MailError.codes.MS_CALL_ERROR
				};

				MicroserviceCall.prototype.call.resolves(microserviceCallError);

				const mail = session.getSessionInstance(Mail);

				await assert.rejects(() => mail
					.setTo('example@example.com')
					.setTemplateCode('template-code')
					.send(), microserviceCallError);

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						to: ['example@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					headers
				);
			});

			it('Should send the email with a templateCode', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = session.getSessionInstance(Mail);

				const mailData = await mail.setTemplateCode('template-code')
					.send();

				assert.deepStrictEqual(mailData, { id: '5de565c07de99000110dcdef' });

				sinon.assert.calledOnceWithExactly(MicroserviceCall.prototype.call,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					headers
				);
			});

			it('Should send the email with a body', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = session.getSessionInstance(Mail);

				const mailData = await mail.setBody('body string to send')
					.setTo('example@example.com')
					.setSubject('crazy subject')
					.send();

				assert.deepStrictEqual(mailData, { id: '5de565c07de99000110dcdef' });

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						body: 'body string to send',
						to: ['example@example.com'],
						subject: 'crazy subject',
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					headers
				);
			});

			it('Should send the email with a clientCode', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = new Mail();
				const mailData = await mail.setTemplateCode('template-code')
					.setClientCode('clientCode')
					.send();

				assert.deepStrictEqual(mailData, { id: '5de565c07de99000110dcdef' });

				headers = { 'janis-client': 'clientCode' };

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{ templateCode: 'template-code' },
					headers
				);
			});

			it('Should send the email with a custom userCreated', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = new Mail();
				const mailData = await mail.setTemplateCode('template-code')
					.setClientCode('clientCode')
					.setUserCreated('5d1fc1eeb5b68406e0487a07')
					.send();

				assert.deepStrictEqual(mailData, { id: '5de565c07de99000110dcdef' });

				headers = { 'janis-client': 'clientCode' };

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						userCreated: '5d1fc1eeb5b68406e0487a07'
					},
					headers
				);
			});

			it('Should not override custom userCreated with the one in the session', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = session.getSessionInstance(Mail);

				const mailData = await mail.setTemplateCode('template-code')
					.setUserCreated('5d1fc1eeb5b68406e0487a07')
					.send();

				assert.deepStrictEqual(mailData, { id: '5de565c07de99000110dcdef' });

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						userCreated: '5d1fc1eeb5b68406e0487a07'
					},
					{}
				);
			});

			it('Should send \'to\' property always as an array', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = session.getSessionInstance(Mail);

				await mail.setTemplateCode('template-code')
					.setTo('example@example.com')
					.send();

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call.getCall(0),
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						to: ['example@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					{}
				);

				await mail.setTemplateCode('template-code')
					.setTo(['example2@example.com'])
					.send();

				sinon.assert.calledTwice(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call.getCall(1),
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						to: ['example2@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					{}
				);
			});

			it('Should send \'cc\' property always as an array', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = session.getSessionInstance(Mail);

				await mail.setTemplateCode('template-code')
					.setCC('example@example.com')
					.send();

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call.getCall(0),
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						cc: ['example@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					{}
				);

				await mail.setTemplateCode('template-code')
					.setCC(['example2@example.com'])
					.send();

				sinon.assert.calledTwice(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call.getCall(1),
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						cc: ['example2@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					{}
				);
			});

			it('Should send \'bcc\' property always as an array', async () => {

				MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = session.getSessionInstance(Mail);

				await mail.setTemplateCode('template-code')
					.setBCC('example@example.com')
					.send();

				sinon.assert.calledOnce(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call.getCall(0),
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						bcc: ['example@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					{}
				);

				await mail.setTemplateCode('template-code')
					.setBCC(['example2@example.com'])
					.send();

				sinon.assert.calledTwice(MicroserviceCall.prototype.call);
				sinon.assert.calledWithExactly(MicroserviceCall.prototype.call.getCall(1),
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{
						templateCode: 'template-code',
						bcc: ['example2@example.com'],
						userCreated: '5d1fc1eeb5b68406e0487a06'
					},
					{}
				);
			});
		});
	});

});
