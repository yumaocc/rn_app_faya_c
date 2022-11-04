export function encodeJson(json: any): string {
  return encodeURIComponent(JSON.stringify(json));
}
