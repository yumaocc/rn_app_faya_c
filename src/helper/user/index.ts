import {isNil} from 'lodash';

export function userIsAgent(userLevel: number) {
  if (isNil(userLevel)) {
    return false;
  }
  return userLevel > 0;
}
