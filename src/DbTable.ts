export class DbTable<T extends object> {
  private prototype: T;

  constructor(prototype: T) {
    this.prototype = prototype;
  }

  fields(): { [K in keyof T]: string } {
    const fieldNames = {} as { [K in keyof T]: string };
    for (const key in this.prototype) {
      if (this.prototype.hasOwnProperty(key)) {
        fieldNames[key] = key;
      }
    }
    return fieldNames;
  }
}
