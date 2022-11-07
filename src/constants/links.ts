import {getEnv} from './env';

export function getH5Domain() {
  const env = getEnv();
  switch (env) {
    case 'development':
      return 'https://m.faya.life';
    case 'production':
    default:
      return 'http://demo.m.faya.life';
  }
}

export function feedbackUrl(token?: string) {
  return `${getH5Domain()}/${token ? `?token=${token}` : ''}#/feedback`;
}
