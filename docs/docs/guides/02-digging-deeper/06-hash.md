---
permalink: guides/hash
group: Digging Deeper
---

# Hash
Hashing user sensitive data such as passwords is essential when it comes to the development of an application. AdonisJs ships with a hash provider to make hashing values a breeze. By the end of this guide, you will know:
- How to configure hash
- How to perform hasing on strings

[note]
Hashing values is different than encrpyting data - hashed values **cannot** be decrypted once encrypted.
[/note]

## Getting Started
In order to start using AdonisJs's hashing support, you must first install a driver. Currently, hash supports the **bcrypt** and **argon** drivers. The default hashing driver is configured in the `config/hash.ts` file.


## Installing the Driver
You only need to install one of the drivers, either `phc-argon2` or `phc-bcrypt`.

[codegroup]

```sh{}{npm}
# To install the argon driver
npm i phc-argon2

# To install the bcrypt driver
npm i phc-bcrypt
```

```sh{}{yarn}
# To install the argon driver
yarn add phc-argon2

# To install the bcrypt driver
yarn add phc-bcrypt
```

[/codegroup]

## Hashing Values
The `make` method is the quickest and easiest way to hash a plain-text string.

```ts
import Hash from '@ioc:Adonis/Core/Hash'

let hashedString = await Hash.make(plainText)
```

## Verifying Hashes
The `verify` method allows you to verify that a given plain-text string corresponds to a given hash.

```ts
let isSame = await Hash.verify(plainText, hashedString)
if(isSame) {
    // The hashed password is the same as the plain text password
}
```