"use server";
import { parseSchemaAndFormat } from '././parseSchemaAndFormat';

export async function getSchema(data: FormData) {
  'use client'
  const endpoint = data.get('endpoint-url')?.valueOf();
  if(typeof endpoint !== 'string' || endpoint.length === 0) {
    throw new Error('Invalid endpoint');
  }
  const schema = await parseSchemaAndFormat(endpoint);
  // console.log('this is the schema', JSON.stringify(schema));
  let err = false;
  if (schema.fields.length === 0 || Object.keys(schema.types).length === 0) {
    err = true;
  }
  return {schema, err};
}