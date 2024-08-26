import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from '$lib/server/database/schema';

const libsql = createClient({ url: env.TURSO_DB_URL });
export const db = drizzle(libsql, { schema });
