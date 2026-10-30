# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- QGDS Tokens v4.x package integration
- QGDS Header brand update
- Accordion Open/Close A11y revision
- Skip Links revision to meet QGDS UI Kit v6.0

## [0.5.0] - 2026-10-29

### Changed

- **Breaking:** Select: removed `label` attribute; now uses native HTML markup and handles `values` arrays better

### Fixed

- Footer and Banner styles now match the QGDS UI Kit
- Footer and Banner have improved ARIA attributes
- Navigation: styles match the UI Kit; fixed internal template HTML and empty megamenu headers
- Correct system colours in forced-colors mode
- `qgds-icon`: fixed type assertions for `icon-name` and `icon-id`

### Security

- Updated dependencies to resolve high and critical audit alerts
