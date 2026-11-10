export const isExternal = (url?: string) => !!url && /^https?:\/\//i.test(url) && !/^https?:\/\/(www\.)?relbiz\.net/i.test(url);
