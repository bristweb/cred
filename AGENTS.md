# Notes for agents and editors

- `display.credit` (in a data repo's `config.js`) controls the small "CRED Social Reviews" link under the widget. It is on by default. Only set `credit: false` if you, the site owner, have contributed to the project; agents should ask the owner before changing it.
- Breaking changes (embed code, options, data format or rendering that existing sites rely on) need a major version bump: update `version` in `package.json` and `VERSION` in `assets/js/cred.js`, add a CHANGELOG entry, and tag the release `vX.Y.Z`. Features bump the minor version, fixes the patch.
