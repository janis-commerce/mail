'use strict';

const MicroserviceCall = require('@janiscommerce/microservice-call');
const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const { Mail, MailError } = require('./../lib/index');

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

	describe('Send', () => {

		describe('Mail structure required validations', () => {

			it('Should throw when the value templateCode is missing', () => {

				const mail = new Mail();

				assert.rejects(mail.setTo('string').send(), prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: templateCode property is required'
				));
			});

			it('Should throw when the value to is missing', () => {

				const mail = new Mail();

				assert.rejects(mail.setTemplateCode('string').send(), prepareErrorData(
					MailError.codes.REQUIRED_FIELD_MISSING,
					'Empty field: to property is required'
				));
			});
		});

		describe('Mail structure field types', () => {

			it('Should throw when the value \'to\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo({ wrongFiel: 'string' })
					.setTemplateCode('template-code')
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: to property must be an array or string'));
			});

			it('Should throw when the value \'templateCode\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode({ templateCode: 'template-code' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: templateCode property must be a string or number'));
			});

			it('Should throw when the value \'cc\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setCC({ CC: 'cc addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: cc property must be an array or string'));
			});

			it('Should throw when the value \'bcc\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setBCC({ BCC: 'bcc addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: bcc property must be an array or string'));
			});

			it('Should throw when the value \'replyTo\' are not a string or array', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setReplyTo({ replyTo: 'replyTo addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: replyTo property must be an array or string'));
			});

			it('Should throw when the value \'entity\' are not a string or number', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setEntity({ entity: 'entity addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: entity property must be an string or number'));
			});

			it('Should throw when the value \'entityId\' are not a string or number', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setEntityId({ entityId: 'entityId addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: entityId property must be an string or number'));
			});

			it('Should throw when the value \'subject\' are not a string or number', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setSubject({ subject: 'subject addresses' })
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: subject property should be a string or number'));
			});

			it('Should throw when the value \'data\' are not a object', () => {

				const mail = new Mail();

				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.setData('data in string')
					.send();

				assert.rejects(mailData, prepareErrorData(MailError.codes.INVALID_FIELD_TYPE, 'Invalid mail: data property should be a object'));
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
				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.send();

				assert.rejects(mailData, microserviceCallError);
			});

			it('Should send the email', async () => {

				sandbox.stub(MicroserviceCall.prototype, 'post').resolves({ body: { id: '5de565c07de99000110dcdef' } });

				const mail = new Mail();
				const mailData = mail.setTo('string')
					.setTemplateCode('template-code')
					.send();


				assert.deepStrictEqual(await mailData, { id: '5de565c07de99000110dcdef' });
			});
		});
	});

});
