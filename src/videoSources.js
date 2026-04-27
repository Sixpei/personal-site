export function buildVideoSources(src) {
  if (typeof src !== 'string' || !src.toLowerCase().endsWith('.mp4')) {
    return [{ src, type: 'video/mp4' }];
  }

  return [
    { src: src.replace(/\.mp4$/i, '.webm'), type: 'video/webm' },
    { src, type: 'video/mp4' },
  ];
}
