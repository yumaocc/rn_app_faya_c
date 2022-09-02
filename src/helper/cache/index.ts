import * as config from './config';
import * as user from './user';

export const cache = {
  config,
  user,
};

export type Cache = typeof cache;
