// Writes the JSON Schemas (editor hints, $schema in data files) from the Zod schemas in package/schemas/schemas.mjs.
// Maintainers run it after changing schemas.mjs: npm run schemas (it also regenerates the config typings).
import { writeFileSync } from 'node:fs';
import { z } from 'zod';
import { configSchema, reviewsSchema } from '../schemas/schemas.mjs';

const dir = new URL('../schemas/', import.meta.url);
for (const [name, schema] of [['config', configSchema], ['reviews', reviewsSchema]]) {
  const json = z.toJSONSchema(schema, { target: 'draft-7', unrepresentable: 'throw' });
  const out = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `https://example.com/reviews-widget/schemas/${name}.schema.json`,
    $comment: 'GENERATED from package/schemas/schemas.mjs by npm run schemas. Do not edit.',
    ...json,
  };
  delete out.$schema; // keep key order: $schema first
  writeFileSync(new URL(`${name}.schema.json`, dir), JSON.stringify({ $schema: 'http://json-schema.org/draft-07/schema#', ...out }, null, 2) + '\n');
  console.log(`wrote package/schemas/${name}.schema.json`);
}
