# Growth Zone Model Logbooks PWA

## Overview

### Feature progress
- [x] User created "personal" logbooks
- [ ] Teacher created "managed" logbooks
  - [ ] Fetch recent lessons from RSS* feed
  - [ ] "Add feedback" notifications (e.g. [Capacitor](https://capacitorjs.com/docs/apis/push-notifications) [(👀)](https://github.com/ionic-team/capacitor/discussions/2659))
  - [ ] Submission of student results
- [ ] Backup and sync with [remoteStorage,js](https://remotestorage.io/#developer-library)
- [x] Analysis of a single entry
- [ ] Analysis of long term progress ([PID Analysis](https://en.wikipedia.org/wiki/PID_controller))
- [x] Question prompts and suggestions on entry form
- [ ] Longer term checkup prompts?

[See project boards for recent progress](https://github.com/kauhat/gzm-logbooks-frontend/projects).

### Resources

- [Mathematical Resilience](http://mathematicalresilience.org/publications.htm)

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For a detailed explanation of the project structure and building, check out the [Nuxt.js docs](https://nuxtjs.org).
