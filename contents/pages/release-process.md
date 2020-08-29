---
permalink: release-process
title: Release Process
group: pages
meta:
  excerpt: Starting with version 5.0, we decided to have an official release process for the framework. AdonisJS will follow a 6 week release cycle and a strong commitment to <a href="https://semver.org" target="_blank" rel="noreferrer">Semantic Versioning</a>.
---

## How is AdonisJS structured?

 AdonisJS is a collection of several first party packages built around the [core of the framework](https://github.com/adonisjs/adonis-framework). Whenever, you hear us mentioning the AdonisJS version, just assume that we are talking about the version of the framework core.

Every other package like `@adonisjs/lucid`, or `@adonisjs/mail` have their own independent versions and they are free to have their own release cycle.

## Goals

Following is the list of goals we want to achieve with our release process.

- Add new features in a way that doesn't break existing apps.
- Ship security and bug fixes every week and bump the patch version of the framework
- Make a minor release about every six weeks. This is the time when we ship new feature, without disturbing existing features or APIs.
- Plan breaking changes ahead of time and deprecate them before they get removed.
- Let every deprecated API live in the codebase until the next major release. This gives enough time to the teams to make changes to their code.

## Shipping Breaking Changes

As per the semver, a package should only have a major release when there is a breaking change and vice-versa.

However, with AdonisJS, we follow a slightly different approach of not releasing breaking changes right away, but instead following the depreciation policy.

- Everytime there is a breaking change, we will first depereciate the old API and implement the breaking change behavior as a new API.
- Everyone using AdonisJS will receive depreciation warnings for the older API and they can apply fixes at their own convience.
- Once, we are confident about the stability of the newer API, we will rollout a major release just removing the depreciated code.

## Shipping New Features

We follow a 6 weeks release cycle for shipping new features. If you are interested in using the unreleased and undocumented features, then you can install the `@next` version of the desired package from npm registry.
