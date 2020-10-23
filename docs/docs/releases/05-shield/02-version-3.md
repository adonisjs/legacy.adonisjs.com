---
permalink: releases/shield/version-4
group: Shield
---

# Shield `4.0`
The release notes contains an aggregated list of chances made between `@adonisjs/shield@3.0` and `@adonisjs/shield@4.0`. You can also check [individual releases](https://github.com/adonisjs/shield/releases) on Github.

## Changes

- **remove**: The underlying package `helmet-csp` [has removed](https://github.com/helmetjs/helmet/wiki/Helmet-4-upgrade-guide#removal-of-browser-sniffing-and-related-features) following CSP config options and must be removed from your config file too. [5fad2311](https://github.com/adonisjs/shield/commit/5fad2311db15ef6bffb696cb0217da7b7edf80e5)

  ```diff{}{config/shield.ts}
  - loose: false
  - setAllHeaders: true
  - disableAndroid: true
  ```
