const url = new URL(window.location.href);

export const segments = url.pathname.split('/');

export const page = segments.at(-1);
