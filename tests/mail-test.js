'use strict';

const MicroserviceCall = require('@janiscommerce/microservice-call');
const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const { Mail, MailError } = require('../lib');

const JANIS_MAILING_SERVICE = 'mailing';
const JANIS_MAILING_NAMESPACE = 'email';
const JANIS_MAILING_METHOD = 'create';
let headers = {};

describe('Mail', () => {

	afterEach(() => {
		sandbox.restore();
	});

	const prepareErrorData = (code, message) => {
		return {
			name: 'MailError',
			message,
			code
		};
	};

	const session = {
		authenticationData: {
			userId: '5d1fc1eeb5b68406e0487a06',
			userIsDev: true,
			clientId: '5d1fc1eeb5b68406e0487a07',
			clientCode: 'fizzmodarg',
			profileId: '5d1fc1eeb5b68406e0487a08',
			permissions: []
		}
	};


	describe('Send', () => {

		describe('Mail structure required validations', () => {

			it('Should throw when the values templateCode and body are missing', () => {

				const mail = new Mail();

				assert.rejects(mail.send(), prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: templateCode or body property is required'
				));
			});

			it('Should throw when the value to is missing and body is set', () => {

				const mail = new Mail();

				assert.rejects(mail.setBody('string').send(), prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: to property is required when templateCode is not set'
				));
			});

			it('Should throw when the value clientCode is missing and the session is not set', () => {

				const mail = new Mail();

				assert.rejects(mail.setBody('string')
					.setTo('info@fizzmod.com')
					.setSubject('crazy subject')
					.send(),
				prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: clientCode or SessionInstance property is required to send a email'
				));
			});

			it('Should throw when the value subject is missing and body is set', () => {

				const mail = new Mail();

				assert.rejects(mail.setBody('string')
					.setTo('info@fizzmod.com')
					.send(),
				prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: subject property is required when templateCode is not set'
				));
			});
		});

		describe('Mail structure field types', () => {

			it('Should throw when the value \'to\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo({ wrongFiel: 'string' })
					.setBody('body string')
					.setClientCode('clientCode')
					.setSubject('crazy subject')
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: to property must be an array or string'));
			});

			it('Should throw when the value \'templateCode\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTemplateCode({ templateCode: 'template-code' })
					.setClientCode('clientCode')
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: templateCode property must be a string or number'));
			});

			it('Should throw when the value \'cc\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setCC({ CC: 'cc addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: cc property must be an array or string'));
			});

			it('Should throw when the value \'bcc\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setBCC({ BCC: 'bcc addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: bcc property must be an array or string'));
			});

			it('Should throw when the value \'replyTo\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setReplyTo({ replyTo: 'replyTo addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: replyTo property must be an array or string'));
			});

			it('Should throw when the value \'entity\' are not a string or number', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setEntity({ entity: 'entity addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: entity property must be an string or number'));
			});

			it('Should throw when the value \'entityId\' are not a string or number', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setEntityId({ entityId: 'entityId addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: entityId property must be an string or number'));
			});

			it('Should throw when the value \'subject\' are not a string or number', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setSubject({ subject: 'subject addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: subject property should be a string or number'));
			});

			it('Should throw when the value \'data\' are not a object', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setClientCode('client-code')
					.setData('data in string')
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: data property should be a object'));
			});

			it('Should throw when the value of \'clientCode\' is not a string', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setEntity({ entity: 'entity addresses' })
					.setClientCode({ entity: 'entity addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: clientCode property must be a string'));
			});

			it('Should throw when the value of \'body\' is not a string', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setBody({ entity: 'entity addresses' })
					.setClientCode('clientCode')
					.setSubject('crazy subject')
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: body property must be a string'));
			});
		});

		describe('Send email through the microserviceCall package', () => {

			it('Should throw when the MicroserviceCall throws', async () => {

				const microserviceCallError = {
					name: 'MailError',
					code: MailError.codes.MS_CALL_ERROR
				};

				sandbox.stub(MicroserviceCall.prototype, 'post').resolves(microserviceCallError);

				const mail = new Mail();
				mail.session = session;

				await assert.rejects(() => mail
					.setTo('info@fizzmod.com')
					.setTemplateCode('template-code')
					.send(), microserviceCallError);

				sandbox.assert.calledOnce(MicroserviceCall.prototype.post);
				sandbox.assert.calledWithExactly(MicroserviceCall.prototype.post,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{ templateCode: 'template-code', to: 'info@fizzmod.com' },
					headers
				);
			});

			it('Should send the email with a templateCode', async () => {

				sandbox.stub(MicroserviceCall.prototype, 'post').resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = new Mail();
				mail.session = session;
				const mailData = mail.setTemplateCode('template-code')
					.send();


				assert.deepStrictEqual(await mailData, { id: '5de565c07de99000110dcdef' });

				sandbox.assert.calledOnce(MicroserviceCall.prototype.post);
				sandbox.assert.calledWithExactly(MicroserviceCall.prototype.post,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{ templateCode: 'template-code' },
					headers
				);
			});

			it('Should send the email with a body', async () => {

				sandbox.stub(MicroserviceCall.prototype, 'post').resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = new Mail();
				mail.session = session;
				const mailData = mail.setBody('body string to send')
					.setTo('info@fizzmod.com')
					.setSubject('crazy subject')
					.send();

				assert.deepStrictEqual(await mailData, { id: '5de565c07de99000110dcdef' });

				sandbox.assert.calledOnce(MicroserviceCall.prototype.post);
				sandbox.assert.calledWithExactly(MicroserviceCall.prototype.post,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{ body: 'body string to send', to: 'info@fizzmod.com', subject: 'crazy subject' },
					headers
				);
			});

			it('Should send the email with a clientCode', async () => {

				sandbox.stub(MicroserviceCall.prototype, 'post').resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = new Mail();
				const mailData = mail.setTemplateCode('template-code')
					.setClientCode('clientCode')
					.send();

				assert.deepStrictEqual(await mailData, { id: '5de565c07de99000110dcdef' });

				headers = { 'janis-client': 'clientCode' };

				sandbox.assert.calledOnce(MicroserviceCall.prototype.post);
				sandbox.assert.calledWithExactly(MicroserviceCall.prototype.post,
					JANIS_MAILING_SERVICE,
					JANIS_MAILING_NAMESPACE,
					JANIS_MAILING_METHOD,
					{ templateCode: 'template-code' },
					headers
				);
			});
		});
	});

});
