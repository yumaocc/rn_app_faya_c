export function getEnv(): Environment {
  if (__DEV__) {
    return 'development';
    // return 'production';
  }
  return 'production';
}
