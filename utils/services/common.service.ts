import { SQLiteSelect } from 'drizzle-orm/sqlite-core';

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  console.log('page', page, pageSize);
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}
