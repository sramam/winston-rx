# winston-rx

<!-- badge -->
[![npm license](https://img.shields.io/npm/l/winston-rx.svg)](https://www.npmjs.com/package/winston-rx)
[![travis status](https://img.shields.io/travis/sramam/winston-rx.svg)](https://travis-ci.org/sramam/winston-rx)
[![Build status](https://ci.appveyor.com/api/projects/status/90am2usst4qeutgi?svg=true)](https://ci.appveyor.com/project/sramam/winston-rx)
[![Coverage Status](https://coveralls.io/repos/github/sramam/winston-rx/badge.svg?branch=master)](https://coveralls.io/github/sramam/winston-rx?branch=master)
[![David](https://david-dm.org/sramam/winston-rx/status.svg)](https://david-dm.org/sramam/winston-rx)
[![David](https://david-dm.org/sramam/winston-rx/dev-status.svg)](https://david-dm.org/sramam/winston-rx?type=dev)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM](https://nodei.co/npm/winston-rx.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/winston-rx/)
<!-- endbadge -->

A simple POC [winston](https://github.com/winstonjs/winston) clone, which leverages rxjs fully, while providing a simple data-configuration
ability.

This is fully functional, with a reasonable test suite, but it's still
an early version. You have been warned.

This is currently not published to npm. Please use a git-url to install.

## Usage

### Installation

```bash
npm install https://github.com/sramam/winston-rx
```

### Console logger

```typescript
import {
  init,
  TimeFormat,
 } from '..';

const cfg = {
  loggers: {
    default: {
      name: 'default'
    }
  },
  transports: {
    default: {
      type: 'console',
      level: 'info',
      timeFormat: <TimeFormat>'none',
      loggers: ['default']
    }
  }
}
const instances = init(cfg);
const log = instances.loggers['default'].log;
log.info(`Just an info message`)
log.error(`this is a mock error for testing`)
log.silly(`It' silly how much information one can log`, { extra: 'data' })

```

### File logger

winston-rx uses a notion of sensible defaults for minimal config. The file logger is integrated with the [rotating-file-stream](https://www.npmjs.com/package/rotating-file-stream)

```typescript
import {
  init,
  TimeFormat,
 } from '..';

const fname = './path/to/log_file.json';

const cfg = {
  loggers: {
    default: {
      name: 'default',
    },
    app: {
      name: 'app'
    }
  },
  transports: {
    default: {
      type: 'file',
      fname,
      size: '200B',
      level: 'warn',
      timeFormat: <TimeFormat>'none',
      formatter: 'json',
      loggers: ['default', 'app']
    }
  }
}
const instances = init(cfg);
const log = instances.loggers['default'].log;
const app = instances.loggers['app'].log;
log.error(`this is a mock error for testing`)
app.error(`mock error from app`)
// these will not be logged
log.info(`Just an info message`)
log.silly(`It' silly how much information one can log`, { extra: 'data' })

```

### Timeformats

The code above has been picked from the test cases, which are trouble-some when timestamps are involved. Hence the timeFormat config is set to 'none'.

The following TimeFormats are supported:

```typescript
export type TimeFormat =
  'none' |
  'locale-date' |
  'locale-time' |
  'utc' |
  'ms' |
  'iso';
```

See [time-format test cases](./src/test/timeFormat.ts) for more details.

## Development Tooling

- [Development tooling](./docs/DevTools.md)
- [Changelog](./CHANGELOG.md)

## License

[Apache-2.0](./LICENSE.md)

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

## Support

Bugs, PRs, comments, suggestions welcomed!
