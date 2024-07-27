import path from 'path';
import url from 'url';

export const __dirname_db = path.dirname(url.fileURLToPath(import.meta.url));
export const __filename_db_user = path.resolve(__dirname_db, 'user.json');
export const __filename_db_worktime = path.resolve(__dirname_db, 'worktime.json');
