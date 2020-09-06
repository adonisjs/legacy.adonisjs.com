---
permalink: guides/mail
group: Digging Deeper
---

# Mail
AdonisJS ships with an official package for sending emails. It internally uses [nodemailer](https://nodemailer.com/about/) to send emails but **removes the boilerplate** for manually constructing transports and **allows trapping emails during tests**, so that they are not sent to the real recipients.

By the end of this guide, you will know:

- How to install and configure the mail package
- How to create and use multiple mailers
- Trapping emails during tests
- Previewing emails on a dummy SMTP server

## Setup
Install the `@adonisjs/mail` package from npm registry using the following command.

[note]
The `@adonisjs/mail` package relies on `@adonisjs/view` package. Make sure the view package is installed and configured correctly.
[/note]

[codegroup]

```sh{}{npm}
npm i @adonisjs/mail@alpha
```

```sh{}{yarn}
yarn add @adonisjs/mail@alpha
```

[/codegroup]

### Invoke Generator
AdonisJS packages can configure themselves by running the post install instructions. Run the following command to setup `@adonisjs/mail` package.

```sh
node ace invoke @adonisjs/mail

#   create    config/mail.ts
#   create    contracts/mail.ts
#   update    .env
#   update    tsconfig.json { types += @adonisjs/mail }
#   update    .adonisrc.json { providers += @adonisjs/mail }
# ✔ create    ace-manifest.json
```

## Supported drivers
The mail module out of the box supports the following drivers.

- **smtp** ( Uses the SMTP protocol )
- **ses** ( Uses AWS SES )
- **mailgun** ( Uses mailgun service )
- **sparkpost** ( Uses sparkpost service )

## Configuration
The configuration for the mail package is stored inside the `config/mail.ts` file. Inside the config file, you can define one or more mailers, along with the default mailer to use.

```ts
import Env from '@ioc:Adonis/Core/Env'
import { MailConfig } from '@ioc:Adonis/Addons/Mail'

const mailConfig: MailConfig = {
  /*
  |--------------------------------------------------------------------------
  | DEFAULT MAILER
  |--------------------------------------------------------------------------
  */
  mailer: 'smtp',

  /*
  |--------------------------------------------------------------------------
  | MAILERS LIST
  |--------------------------------------------------------------------------
  */
  mailers: {
    smtp: {
      driver: 'smtp',
      host: Env.get('SMTP_HOST') as string,
      port: Env.get('SMTP_PORT') as string,
    },

    ses: {
      driver: 'ses',
      apiVersion: '2010-12-01',
      key: Env.get('SES_ACCESS_KEY') as string,
      secret: Env.get('SES_ACCESS_SECRET') as string,
      region: Env.get('SES_REGION') as string,
      sslEnabled: true,
      sendingRate: 10,
      maxConnections: 5,
    },

    mailgun: {
      driver: 'mailgun',
      baseUrl: 'https://api.mailgun.net/v3',
      key: Env.get('MAILGUN_API_KEY') as string,
    },

    sparkpost: {
      driver: 'sparkpost',
      baseUrl: 'https://api.sparkpost.com/api/v1',
      key: Env.get('SPARKPOST_API_KEY') as string,
    },
  },
}

export default mailConfig
```

### Points to note

- You can create multiple mailers using the same underlying driver. For example: A mailer to send promotional emails and another one to send transactional.
- When defining a new mailer inside the config file, it needs to be first registered inside `contracts/mail.ts` file. Otherwise, the typescript compiler will complain.
  ```ts
  declare module '@ioc:Adonis/Addons/Mail' {
    import { MailDrivers } from '@ioc:Adonis/Addons/Mail'

    interface MailersList {
      smtp: MailDrivers['smtp'],
      ses: MailDrivers['ses'],
      mailgun: MailDrivers['mailgun'],
      sparkpost: MailDrivers['sparkpost'],
    }
  }
  ```
- To switch between mailers, you can use `Mail.use('<MAILER NAME>')` method.
- Finally, feel free to remove the configuration for the mailers you are not planning to use.

### Mailgun config
The mailgun configuration block optionally accepts the following options.

| Config option | Mailgun variant | 
|---------------|---------------|
| `oTag` | o:tag |
| `oDeliverytime` | o:deliverytime |
| `oTestMode` | o:testmode |
| `oTracking` | o:tracking |
| `oTrackingClick` | o:tracking-clicks |
| `oTrackingOpens` | o:tracking-opens |
| `oDkim` | o:dkim |
| `headers` | h:<header-name> |

All of the options except `oDkim` can be passed during the `Mail.send` call as well.

```ts
await Mail.use('mailgun').send((message) => {
  message.subject('Welcome Onboard!')
}, {
  oTag: ['signup'],
})
```

### Sparkpost config
The sparkpost configuration block optionally accepts the following options.

| Config option | Sparkpost variant | 
|---------------|---------------|
| `startTime` | start_time |
| `openTracking` | open_tracking |
| `clickTracking` | click_tracking |
| `transactional` | transactional |
| `sandbox` | sandbox |
| `skipSuppression` | skip_suppression |
| `ipPool` | ip_pool |

All of the configuration options can also be defined at runtime during the `Mail.send` call.

```ts
await Mail.use('sparkpost').send((message) => {
  message.subject('Welcome Onboard!')
}, {
  transaction: true,
  openTracking: false,
})
```

## Usage
Once done with the setup, you can import the `Mail` module and send emails using the `Mail.send` method.

```ts
import Mail from '@ioc:Adonis/Addons/Mail'

Mail.send((message) => {
  message
    .from('info@example.com')
    .to('virk@adonisjs.com')
    .subject('Welcome Onboard!')
    .htmlView('emails/welcome', { name: 'Virk' })
})
```

- The `Mail.send` method accepts a callback function.
- Inside the callback, you can configure the mail message by calling the appropriate methods.
- At bare minimum, you must define `from`, `to`, `subject` and the content of the email using the `htmlView` method.

### Defer email sending
Most of the times, you will be sending emails in respond to some action. For example: Send email after user registration or during the password reset flow.

```ts{9-11}
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class UsersController {

  public async store () {
    const user = await User.create({})

    await Mail.send((message) => {
      // ...configure message
    })

    return user
  }

}
```

In the above example, the HTTP request to create the user will have to wait until the email is sent and hence makes your application appear slower.

To change this behavior, you need to make sure that the email is sent in the background and not during the HTTP request and the same can be achieved using the `Mail.sendLater` method.

[note]

The `Mail.sendLater` method uses an in-memory queue to send emails in the background. For critical emails, you may want to use a real queue server, since an in-memory queue will loose all the jobs when server goes down.

[/note]

```ts{6-9}
export default class UsersController {

  public async store () {
    const user = await User.create({})

    // Pushed to in-memory queue
    await Mail.sendLater((message) => {
      // ...configure message
    })

    return user
  }

}
```

## Creating email templates
You can make use of standard edge templates for defining email content. The templates lives inside the same `resources/views` directory. For better organization, you can move them inside a sub-directory called `emails`. For example:

```sh
node ace make:view emails/welcome

# ✔  create    resources/views/emails/welcome.edge
```

Open the newly created template file and paste following contents inside it.

```edge
<h1> Welcome {{ user.fullName }} </h1>
<p>
  <a href="{{ url }}">Click here</a> to verify your email address.
</p>
```

Finally, you can use this view as the content for the email by calling the following method.

```ts
await Mail.sendLater((message) => {
  message.htmlView('emails/welcome', {
    user: { fullName: 'Some Name' },
    url: 'https://your-app.com/verification-url',
  })
})
```

Similarly, you can also define the plain text content, along with the content for the Apple watch.

```ts{}{Plain text}
message.textView('emails/welcome.plain', {})
```

```ts{}{Apple watch}
message.watchView('emails/welcome.watch', {})
```

## Sending attachments
You can send attachments in email using the `message.attach` or `message.embed` methods.

```ts
import Application from '@ioc:Adonis/Core/Application'

await Mail.sendLater((message) => {
  message.attach(Application.publicPath('receipt.png'))
})
```

- The `message.attach` method needs an absolute path to the file.
- `Application.publicPath` returns an absolute path for the `public` directory inside your project root.
- The `public` directory is used just as an example. You can attach files from any directory. 

### CID attachments
There are [multiple ways](https://blog.mailtrap.io/embedding-images-in-html-email-have-the-rules-changed) to render images inside the email body. One of them is sending the image as an attachment and then adding it to the HTML using it's Content-Id (CID).

```ts
await Mail.sendLater((message) => {
  message.embed(
    Application.publicPath('receipt.png'),
    'a-unique-id-for-the-attachment',
  )
})
```

```edge{}{Email template}
<img src="cid:a-unique-id-for-the-attachment" />
```

### Points to note

- You have to use `message.embed` method and not `message.attach`.
- Each embedded image must have a unique id, so that you can later reference it inside the template.
- The `img[src]` needs the unique id, along with the `cid:` prefix.
- Learn more about [CID attachments](https://blog.mailtrap.io/embedding-images-in-html-email-have-the-rules-changed/#CID_attachments_or_embedding_an_image_using_MIME_object).

## Switching mailers at runtime
You can make use of the `Mail.use()` method to switch between the mailers.

[note]
The `use` method accepts the mailer name and not the driver name. Remember, you can create multiple mailers using the same underlying driver.
[/note]

```ts
Mail.use('mailgun').send(() => {})
Mail.use('smtp').send(() => {})
```

## SMTP server previews
Emails are tricky and hence there are dozens of tools/products to help you find issues with your emails. AdonisJS also provides a handy way to test your emails by sending them to a [dummy SMTP server](https://ethereal.email/).

Consider the following example:

```ts
const { url } = await Mail.preview((message) => {
  message
    .to(user.email)
    .from('info@example.com')
    .subject('Welcome Onboard!')
    .htmlView('emails/welcome')
})

console.log(`Preview url: ${url}`)
```

- You just need to replace the `Mail.send` method with the `Mail.preview` method.
- The response contains the URL to view the email on https://ethereal.email.

## Debugging email calls
The mail module emits `adonis:mail:sent` event that you can listen to observe email calls. Let's begin by creating `start/events.ts` file by running the following ace command.

```ts
node ace make:prldfile events
# ✔  create    start/events.ts
```

Open the newly created file and paste the following contents inside it.

```ts{}{start/events.ts}
import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'

Event.on('adonis:mail:sent', Mail.prettyPrint)
```

Now, if you send an email, it will be pretty printed on the terminal.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1594797377/adonisjs.com/adonis-mail-event-pretty-print.png)

The `Mail.prettyPrint` method is just one way to handle the event. You are free to define your own event listener and handle the event. The event listener receives only a single argument of [MailEventData](https://github.com/adonisjs/mail/blob/develop/adonis-typings/mail.ts#L486) type.
