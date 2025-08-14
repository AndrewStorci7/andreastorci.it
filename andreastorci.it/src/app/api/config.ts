/**
 * FileName for user data
 */
export const users = String(process.env.FPATH_DATA_USERS);

/**
 * FileName for user data
 */
export const logs = String(process.env.FPATH_DATA_LOGS);

/**
 * FileName for personal data in Italian
 */
export const it = String(process.env.FPATH_DATA_PD_IT);

/**
 * FileName for personal data in English
 */
export const en = String(process.env.FPATH_DATA_PD_EN);

/**
 * FileName for personal data in Spanish
 */
export const es = String(process.env.FPATH_DATA_PD_ES);

/**
 * FilePath for other data
 */
export const fpath = process.env.FPATH_DATAS || process.cwd() + '/public/data';