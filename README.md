# mail

[![Build Status](https://travis-ci.org/janis-commerce/mail.svg?branch=master)](https://travis-ci.org/janis-commerce/mail)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/mail/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/mail?branch=master)

A package to handle emails

## Installation
```sh
npm install @janiscommerce/mail
```

### Mail structure
The `Mail [Object]` parameter have the following structure:
- **`to [String|Array]`** (required): The emails addresses to send the email
- **`templateCode [String|Array]`** (required): The code of the template
- **`data [Object]`** (optional): This property is a JSON that includes all the data that can use in the template email.
- **`subject [String]`** (optional): This is the subject of the email string.
- **`cc [String|Array]`** (optional): The emails addresses to send the email in the cc field.
- **`bcc [String|Array]`** (optional): The emails addresses to send the email in the bcc field.
- **`replyTo [String|Array]`** (optional): The emails addresses to send the replyTo of the email.
- **`entity [String|Number]`** (optional): The entity to associated to the email.
- **`entity_id [String|Number]`** (optional): The entity Id to associated to the email.

### Mail example
```js
{
  to: 'info@janis.im',
  templateCode: 'template-code-name',
  cc: 'log',
  bcc: 'mail@example.com',
  replyTo: ['mail@example.com'],
  subject: 'email subject',
  entity: 'order',
  entityId: '0acefd5e-cb90-4531-b27a-e4d236f07539',
  data: {
    name: 'exampleName',
    lastName: 'exampleLastName'
   }
}
```

## Usage
```js
const Mail = require('@janiscommerce/mail');

Mail.setTo('some-client')
  .setCC('mail@example.com')
  .setBCC(['mail@example.com'])
  .setReplyTo(['mail@example.com'])
  .setSubject('Email Subject')
  .setEntity('order')
  .setEntityId('5de565c07de99000110dcdef')
  .setData({
  		someField: 'someFieldValue',
  		otherField: 'otherFieldValue'
  })
  .setTemplateCode('template-code')
  .send();
```

## Errors

The errors are informed with a `MailError`.
This object has a code that can be useful for a correct error handling.
The codes are the following:

| Code | Description                    |
|------|--------------------------------|
| 1    | Requiered field missing        |
| 2    | Invalid field type             |
| 3    | No Service Name Setted         |
| 4    | Microservice call Error        |
