// package/ can be updated independently of the root tooling manifest. The served script owns the widget version.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export const widgetVersion = (script = new URL('../assets/js/cred.js', import.meta.url)) => {
  const version = readFileSync(script, 'utf8').match(/\bconst VERSION = '(\d+\.\d+\.\d+)';/)?.[1];
  if (!version) throw new Error('cred.js must declare const VERSION as a full semantic version');
  return version;
};
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(widgetVersion());
