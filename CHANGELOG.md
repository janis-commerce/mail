# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2021-08-03
### Added
- GitHub Actions for CI/CD workflows

### Changed
- Updated dependencies
- Using `janis/microservice-call@^4.3.1` to obtain credentials from AWS Secrets Manager.

### Removed
- Travis integration

## [2.0.0] - 2020-04-06
### Added
- `setUserCreated` setter
- Now injected session is used to set `userCreated` automatically

### Changed
- `replyTo` can now be only a string (**BREAKING CHANGE**)
- Mailing APIs now receive always arrays for `to`, `cc` and `bcc` properties.

### Fixed
- Package tests were improved. Now it's much more reliable :wink:

## [1.1.0] - 2020-01-31
### Added
- New methods: `setClientCode` and `setBody`
- Inject session if exists

## [1.0.0] - 2020-01-21
### Added
- New package to send emails
