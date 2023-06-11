export default class LocalStorage
{
  set(key: string, value: string): void
  {
    key = key.toString().toLowerCase().replace(/\s/g, "");
    value = value.toString();
    localStorage.setItem(key, value);
  }

  get(key: string, defaultValue: string = ""): string
  {
    key = key.toString().toLowerCase().replace(/\s/g, "");
    return localStorage.getItem(key) ?? defaultValue;
  }

  check(key: string, value: string): boolean
  {
    key = key.toString().toLowerCase().replace(/\s/g, "");
    value = value.toString();
    return localStorage.getItem(key) == value;
  }
}
