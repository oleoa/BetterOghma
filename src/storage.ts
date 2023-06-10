type NIL = null | undefined;

type Stringable =
  | {
      [Symbol.toStringTag]: string;
    }
  | string;

const whiteSpaces = new RegExp(/\s/g);

const rmWhiteSpaces = (str: Stringable): string =>
  str.toString().toLowerCase().replace(whiteSpaces, '');

export function setItem(key: Stringable, value: Stringable | NIL) {
  if (value == undefined) {
    return;
  }

  const k = rmWhiteSpaces(key);
  const v = rmWhiteSpaces(value);
  localStorage.setItem(k, v);
}

export function getItem(
  key: Stringable,
  defaultValue: string | NIL
): string | NIL {
  const k = rmWhiteSpaces(key);
  return localStorage.getItem(k) ?? defaultValue;
}

export function checkItem(key: Stringable, value: Stringable | NIL): boolean {
  if (value == undefined) {
    return false;
  }

  const k = rmWhiteSpaces(key);
  const v = rmWhiteSpaces(value);
  return localStorage.getItem(k) === v;
}
