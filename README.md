# mail

[![Build Status](https://travis-ci.org/janis-commerce/mail.svg?branch=master)](https://travis-ci.org/janis-commerce/mail)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/mail/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/mail?branch=master)

A package to handle emails

## Installation

```sh
npm install @janiscommerce/mail
```
## Available methods

The methods that you can use to create the email:
- **`setTo [String|Array]`** (required if body is set): This method sets the recipients email addresses
- **`setTemplateCode [String|Array]`** (required if body is not set): This method sets the template code of the email
- **`setBody [String]`** (required if templateCode is not set): This method sets the body of the email.
- **`setData [Object]`**: This method sets the data to replace variables in recipients, subject and email body.
- **`setSubject [String]`** (required if templateCode is not set): This method sets the subject of the email.
- **`setCC [String|Array]`**: This method sets the CC of the email.
- **`setBCC [String|Array]`**: This method sets the BCC of the email.
- **`setReplyTo [String]`**: This method sets the Reply To of the email.
- **`setEntity [String|Number]`**: This method sets the entity related to the email.
- **`setEntityId [String|Number]`**: This method sets the entity ID related to the email.
- **`setUserCreated [String]`**: This method sets the User ID related to the user that triggered the mail.

## ClientCode injection

The package uses the Janis Mailing Service, so it needs the `clientCode` to be able to use it's API. You have two ways to do so:

- Instanciate the package in a sessioned class using `this.session.getSessionInstance(Mail)` (see [@janiscommerce/api-session](https://www.npmjs.com/package/@janiscommerce/api-session))
- Setting the `clientCode` using the `mail.setClientCode('clientCode')` method

## Errors

The errors are informed with a `MailError`.
This object has a code that can be useful for a correct error handling or debugging.
The codes are the following:

| Code | Description                    |
|------|--------------------------------|
| 1    | Required field missing         |
| 2    | Invalid field type             |
| 3    | Microservice call Error        |

## Examples

### Client injection

#### With clientCode

```js
const Mail = require('@janiscommerce/mail');

const mail = new Mail();

await mail.setTemplateCode('template-code')
	.setClientCode('client-code')
	.send();
```

#### With session

```js
const Mail = require('@janiscommerce/mail');
const API = require('@janiscommerce/api');

class ApiExample extends API {

	async process() {

		const mail = this.session.getSessionInstance(Mail);

		try {
			await mail.setTemplateCode('template-code').send();
		} catch(error) {
			console.log(error);
		}
	}
}

module.exports = ApiExample;

```

### Templated emails

#### Basic usage

```js
const Mail = require('@janiscommerce/mail');

const mail = new Mail();

await mail.setClientCode('client-code')
	.setTemplateCode('template-code')
	.send();
```

#### Complete Usage

```js
const Mail = require('@janiscommerce/mail');

const mail = new Mail();

await mail.setClientCode('client-code')
	.setTemplateCode('template-code')
	.setTo('example@example.com') // Merges with template data
	.setCC('mail@example.com') // Merges with template data
	.setBCC(['mail@example.com']) // Merges with template data
	.setReplyTo(['mail@example.com']) // Merges with template data
	.setEntity('order')
	.setEntityId('5de565c07de99000110dcdef')
	.setUserCreated('6de565c07de99000110dcdef')
	.setData({
		someField: 'someFieldValue',
		otherField: 'otherFieldValue'
	})
	.send();
```

### Raw emails

#### Basic usage

```js
const Mail = require('@janiscommerce/mail');

const mail = new Mail();

await mail.setClientCode('client-code')
	.setBody('client-code')
	.setSubject('subject of the email')
	.setTo('example@example.com')
	.send();
```

#### Complete Usage

```js
const Mail = require('@janiscommerce/mail');

const mail = new Mail();

await mail.setClientCode('client-code')
	.setTo('some-client')
	.setCC('mail@example.com')
	.setBCC(['mail@example.com'])
	.setReplyTo(['mail@example.com'])
	.setSubject('Email Subject')
	.setEntity('order')
	.setEntityId('5de565c07de99000110dcdef')
	.setUserCreated('6de565c07de99000110dcdef')
	.setBody('body of email')
	.setData({
		someField: 'someFieldValue',
		otherField: 'otherFieldValue'
	})
	.send();
```
