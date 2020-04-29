---
permalink: guides/security/introduction
group: Application Security
---

# Introduction
Keeping the security at the forefront, AdonisJS ships with a bunch of tools to make sure that your applications are secure from common vulnerabilities.

Along with all the tooling, we regularly audit the dependencies used by the framework core and the first party plugins.

## Free from prototype poisoning
The `JSON.parse` method is vulnerable to the [prototype poisoning](https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96) and can potentially force your applications to mis-behave.

The JSON objects accepted over the HTTP requests by your AdonisJS applications are carefully parsed to protect your code from prototype poisoning.

## Audit reports
