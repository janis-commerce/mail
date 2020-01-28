
# mail

[![Build Status](https://travis-ci.org/janis-commerce/mail.svg?branch=master)](https://travis-ci.org/janis-commerce/mail)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/mail/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/mail?branch=master)

A package to handle emails

## Installation
```sh
npm install @janiscommerce/mail
```
## Available methods
The methods that yo can use to create the email:
- **`setTo [String|Array]`** (required required If body is setted): This method is use to set the emails addresses to send the email
- **`setTemplateCode [String|Array]`** (required If body is not setted): This method is use to set the template code of the email
- **`setBody [String]`** (required required If templateCode is not setted): This method is use to set the body of the email.
- **`setData [Object]`** (optional): This method is use to set the data to the email.
- **`setSubject [String]`** (optional): This method is use to set the  subject of the email.
- **`setCC [String|Array]`** (optional): This method is use to set the cc of the email.
- **`setBCC [String|Array]`** (optional): This method is use to set the bcc of the email.
- **`setReplyTo [String|Array]`** (optional): This method is use to set the reply to of the email.
- **`setEntity [String|Number]`** (optional): This method is use to set the entity of the email.
- **`setEntityId [String|Number]`** (optional): This method is use to set the entity id of the email.

## Usage
### Basic usage with template code with and without a clientCode
#### With clientCode
```js
const Mail = require('@janiscommerce/mail');

Mail.setTemplateCode('template-code')
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
      await mail.setTemplateCode('string email')
        .send();
    } catch(error) {
        console.log(error);
    }
  }
}

module.exports = ApiExample;

```

### Basic usage with body
```js
const Mail = require('@janiscommerce/mail');

Mail.setBody('client-code').send();
```

### Complete Usage

```js
const Mail = require('@janiscommerce/mail');

Mail.setTo('some-client')
  .setCC('mail@example.com')
  .setBCC(['mail@example.com'])
  .setReplyTo(['mail@example.com'])
  .setSubject('Email Subject')
  .setEntity('order')
  .setEntityId('5de565c07de99000110dcdef')
  .setBody('body of email')
  .setData({
      someField: 'someFieldValue',
      otherField: 'otherFieldValue'
  })
  .setTemplateCode('template-code')
  .setClientCode('client-code')
  .send();
```
## Mail structure
The `Mail [Object]` parameter have the following structure:
- **`to [String|Array]`** (required): The emails addresses to send the email
- **`templateCode [String|Array]`** (required): The code of the template
- **`data [Object]`** (optional): This property is a JSON that includes all the data that can use in the template email.
- **`subject [String]`** (optional): This is the subject of the email string.
- **`cc [String|Array]`** (optional): The emails addresses to send the email in the cc field.
- **`bcc [String|Array]`** (optional): The emails addresses to send the email in the bcc field.
- **`replyTo [String|Array]`** (optional): The emails addresses to send the replyTo of the email.
- **`entity [String|Number]`** (optional): The entity to associated to the email.
- **`entityId [String|Number]`** (optional): The entity Id to associated to the email.
- **`body [String]`** (optional): The body to use for the email.

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


## ClientCode injection
The package needs the clientCode to be able to send the emails and save them in the corresponding client's database, since it uses Janis Mailing microservice.
You can instanciate the Package in a service by doing `this.session.getSessionInstance(Mail)`, or even when generating the email, add the `clientCode` using the `.setClientCode('clientCode')` method, and it will be sent with the apiKeys of the service with which you are using the package.

## Errors

The errors are informed with a `MailError`.
This object has a code that can be useful for a correct error handling.
The codes are the following:

| Code | Description                    |
|------|--------------------------------|
| 1    | Requiered field missing        |
| 2    | Invalid field type             |
| 3    | Microservice call Error        |
