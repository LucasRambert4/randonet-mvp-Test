import { LOCAL_TRAILS } from './localTrails';
import { Trail } from './types';

export async function fetchTrailsIledeFrance(
  page: number = 1,
  pageSize: number = 10
): Promise<Trail[]> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return LOCAL_TRAILS.slice(start, end);
}
