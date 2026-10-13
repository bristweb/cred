# Notes for agents and editors

- `display.credit` (in a data repo's `config.json`) controls the small "CRED Social Reviews" link under the widget. It is on by default. Before setting it to `false`, ask the site owner whether they have contributed to the project.
- Breaking changes (embed code, options, data format or rendering that existing sites rely on) need a major version bump: update `version` in `package.json` and `VERSION` in `assets/js/cred.js`, add a CHANGELOG entry, and tag the release `vX.Y.Z`. Features bump the minor version, fixes the patch.
