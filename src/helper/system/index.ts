export function getVideoNameByPath(videPath: string) {
  const shortName = videPath.split('/').pop();
  const extName = shortName.split('.').pop();
  if (!extName) {
    return 'upload.mp4';
  }
  return shortName;
}
