---
permalink: guides/http/web-security
category: Handling HTTP Requests
group: Basics
---

# Web Security

AdonisJS provides a handful of tools to protect your application from common web attacks. This guide is an overview of the baked in security features, how to use them, and includes advice on how to further secure an AdonisJS powered application.

## Setup
The Shield provider does not come installed with the default Adonis web application installation. Follow the steps below to set it up.

[note]
The `@alpha` tag is required during the preview release.
[/note]

[codegroup]
```sh{}{npm}
npm i @adonisjs/shield@alpha
```

```sh{}{yarn}
yarn add @adonisjs/shield@alpha
```
[/codegroup]

After the package installation, you must configure Shield using the `node ace invoke @adonisjs/shield`. This command will update the `.adonisjs.rc` file to register the Shield provider and create the default configuration in the `config/shield.ts` file.

[note]
Shield provider relies on [Sessions](/guides/http/sessions), so make sure they are set up correctly.
[/note]

## Csrf Protection

AdonisJS makes it easy to protect your application from [cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) attacks. CSRF is a malicious exploit that tricks a web browser into executing an unwanted action in an application a user is logged into.

AdonisJS automatically generates a CSRF token for each request made to the application. This token is used to verify that the authenticated user is the one actually making the request to the application.

### CSRF Tokens & the Frontend
The CSRF token generated for the current request is stored on the `request` object and can be accessed using `request.csrfToken`. When making a `POST`, `PUT`, `PATCH` or `DELETE` request to the application, this token is verified by the shield middleware.

When you define a new form in your application, you should include a hidden field with the name `_csrf` field. When this form is submitted, this value is submitted and the CSRF middleware automatically verifies that this token matches the secret stored in the session. You may use the `csrfField()` Edge helper method to generate the token field.

```html
<form method="POST" action="/auth/register">
    {{ csrfField() }}
    ...
</form>
```

Sometimes, when making AJAX requests, it is convenient to attach the CSRF token automatically on every request being made to the application. By default, if the `csrf.enableXsrfCookie` property in your `config/shield.ts` file is set to true, AdonisJS would set an encrypted version of the CSRF token in a cookie called `XSRF-TOKEN`. Some HTTP Libraries such as Axios would automatically fetch this cookie, and on all outgoing requests attach this cookie as a header called `X-XSRF-TOKEN`.

If your HTTP library does not do this by default, you would have to manually configure this behaviour. AdonisJS provides another view helper called `csrfMeta`. You can use this to create a `csrf-token` meta tag on your page.

```html
<!DOCTYPE html>
<html>
  <head>
    {{ csrfMeta() }}
  </head>
  <body>
</html>
```

With this meta set, you can fetch its value using JavaScript and attach it to any outgoing requests.

```js
const token = document.head.querySelector('meta[name="csrf-token"]')
```

### Excluding routes from CSRF protection
Sometimes you may wish to exclude some routes from CSRF protection. You can do this by defining a list of URIs in the `csrf.exceptRoutes` array in the `config/shield.ts` file. 

```ts
  exceptRoutes: ['/users/:user', '/webhooks/*']
```

## XSS Protection
Cross-site scripting (XSS) attacks enable attackers to inject client-side scripts into web pages viewed by other users. By default, protection against such attacks is enabled. You can change this behaviour by updating the `xss.enabled` property in the `config/shield.ts` file.

```ts
export const xss: ShieldConfig['xss'] = {
  enabled: true,
  enableOnOldIE: true,
  mode: 'block',
}
```


## Content Security Policy
The `Content-Security-Policy` HTTP response header helps you reduce XSS risks on modern browsers by declaring, which dynamic resources are allowed to load. This header value is made up of one or more directives, which define the policies for fetching specific resource types. This behaviour is disabled by default for a seamless onboarding experience.

```ts
export const csp: ShieldConfig['csp'] = {
  enabled: true
}
```

All directives should be defined in `camelCase`. Here's an example directive that defines valid sources of stylesheets or CSS:

```ts
export const csp: ShieldConfig['csp'] = {
  enabled: true,
  directives: {
    styleSrc: ['self', '@nonce', 'cdnjs.cloudfare.com']
  }
}
```

## HTTP Strict Transport Security
The HSTS response header instructs the browser that it should only be accessed using the secure HTTPS protocol. This header is enabled by default. You can also control how long the browser should remember that your site should only be accessed over HTTPS.

```ts
export const hsts: ShieldConfig['hsts'] = {
  enabled: true,
  maxAge: '180 days',
}
```

## No Sniff
The majority of modern browsers attempts to detect the `Content-Type` of a request by sniffing its content, meaning a file ending in .txt could be executed as JavaScript if it contains JavaScript code. As a security measure, this behaviour is disabled by default by shield. To enable it, modify the `contentTypeSniffing.enabled` property in the `config/shield.ts` file.

```ts
export const contentTypeSniffing: ShieldConfig['contentTypeSniffing'] = {
  enabled: false,
}
```

## No open
IE users can execute webpages in the context of your website, which is a serious security risk. To stop IE from executing unknown scripts in the context of your website, ensure `noOpen.enabled` is set to true (sets the header `X-Download-Options: noopen`). By default, this security measure is not enabled in Shield because not many websites are running IE8 these days.

```ts
export const noOpen: ShieldConfig['noOpen'] = {
  enabled: false,
}
```

## XFrame
The `xFrame` configuration can help you configure external page embed settings for your website. This can help protect your site against [clickjacking](https://en.wikipedia.org/wiki/Clickjacking). The available actions are `DENY`, which does not allow any embeds from any sites, `SAMEORIGIN` which allows embeds only if the page being embedded is from the same origin, and `ALLOW-FROM` which can be used to permit embeds from a specific domain.

```ts
export const xFrame: ShieldConfig['xFrame'] = {
  enabled: true,
  action: 'DENY',
}
```

## DNS Prefetch
The `X-DNS-Prefetch-Control` response header controls DNS prefetching. This is a feature by which browsers perform domain name resolution on links referenced by the document before the user actually gets to clicking on them. This reduces latency when a user clicks on a link. By default this header is always sent alongside the response. To explicitly define the value of the `X-DNS-Prefetch-Control` header, modify the `allow` option. When `dnsPrefetch.allow` is `true`, the header value would be set to `on`, and when `dnsPrefetch.allow` is `false`, the header value would be set to `off`. 

```ts
export const dnsPrefetch: ShieldConfig['dnsPrefetch'] = {
  enabled: true,
  allow: true
}
```
