import _ from 'underscore'

export function sanitizeMongo( dirtyData: string | undefined): string;
export function sanitizeMongo( dirtyData: { [key: string]: any } | undefined): { [key: string]: any };
export function sanitizeMongo( dirtyData: string | { [key: string]: any } | undefined) {
  if (dirtyData instanceof Object) {
    for (const key in dirtyData) {
      if (/^\$/.test(key)) {
        delete dirtyData[key];
      } else {
        sanitizeMongo(dirtyData[key]);
      }
    }
  } else if (_.isString(dirtyData)) {
		dirtyData = dirtyData.replace(/[${}]/ig, '')
	}
  return dirtyData;
}