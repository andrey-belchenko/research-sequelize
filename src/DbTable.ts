import * as sqlFormatter from "sql-formatter";

export type DbSetFields<TSetProto extends object> = {
  [K in keyof TSetProto]: string;
};

export type DbSourceFields<TSourceEntries extends DbSourceEntries<object>> = {
  [K in keyof TSourceEntries]: DbSetFields<
    TSourceEntries[K] extends DbSet<infer TSetProto> ? TSetProto : never
  >;
};
// ValueContainer<infer U> ? U : never
// extends ValueContainer<infer U> ? U : never
export type DbSourceEntries<TSetProto extends object> = {
  [key: string]: DbSet<TSetProto>;
};

export abstract class DbSet<TSetProto extends object> {
  private proto: TSetProto;
  constructor(proto: TSetProto) {
    this.proto = proto;
  }

  fields(): DbSetFields<TSetProto> {
    const fieldNames = {} as DbSetFields<TSetProto>;
    for (const key in this.proto) {
      if (this.proto.hasOwnProperty(key)) {
        fieldNames[key] = key;
      }
    }
    return fieldNames;
  }

  abstract expression(): string;
  abstract querySql(): string;
}

export class DbTable<TSetProto extends object> extends DbSet<TSetProto> {
  private name: string;

  constructor(name: string, proto: TSetProto) {
    super(proto);
    this.name = name;
  }
  expression() {
    return this.name;
  }

  querySql(): string {
    return `select * from  ${this.name}`;
  }
}

export class DbSource<TSourceEntries extends DbSourceEntries<object>> {
  private entries: TSourceEntries;
  constructor(entries: TSourceEntries) {
    this.entries = entries;
  }
  fields(): DbSourceFields<TSourceEntries> {
    let result: any = {};
    for (let name in this.entries) {
      result[name] = this.entries[name].fields();
    }
    return result as DbSourceFields<TSourceEntries>;
  }

  join<TJoinedEntry extends DbSourceEntries<object>>(
    entry: TJoinedEntry
  ): DbSource<TSourceEntries & TJoinedEntry> {
    let entries = {
      ...this.entries,
      ...entry,
    };
    return new DbSource(entries) as DbSource<TSourceEntries & TJoinedEntry>;
  }

  sql() {
    let items = [];
    for (let name in this.entries) {
      items.push(`${this.entries[name].expression()} as ${name}`);
    }
    return items.join("\n");
  }
}

export class DbQuery<
  TSourceEntries extends DbSourceEntries<object>,
  TSelectResult extends object
> extends DbSet<TSelectResult> {
  private from: DbSource<TSourceEntries>;
  private selectOptions: object;
  constructor(
    from: DbSource<TSourceEntries>,
    select: (src: DbSourceFields<TSourceEntries>) => TSelectResult
  ) {
    const selectOptions = select(from.fields());
    super(selectOptions);
    this.selectOptions = selectOptions;
    this.from = from;
  }

  querySql(): string {
    const selectFields = Object.entries(this.selectOptions).map(
      ([key, value]) => `${value} as ${key}`
    );
    const sql = `select ${selectFields.join(",")} from ${this.from.sql()}`;

    return sqlFormatter.format(sql, { language: "postgresql" });
  }

  expression() {
    return `(${this.querySql()})`;
  }
}

export class ValueContainer<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
  // some other logic
}

export function wrapValues<T extends object>(
  proto: T
): { [K in keyof T]: ValueContainer<T[K]> } {
  const result: any = {};
  for (let name in proto) {
    const value = proto[name];
    result[name] = new ValueContainer(value);
  }
  return result;
}

export function unwrapValues<T extends Record<string, ValueContainer<any>>>(
  wrappedValues: T
): { [K in keyof T]: T[K] extends ValueContainer<infer U> ? U : never } {
  const result: any = {};
  for (let name in wrappedValues) {
    const value = wrappedValues[name].getValue();
    result[name] = value;
  }
  return result;
}

const values = {
  a: 123,
  b: "abc",
};

const wrappedValues = wrapValues(values);
const vals = unwrapValues(wrappedValues);

function processWrappedValues<T extends Record<string, any>>(wrapped: {
  [K in keyof T]: ValueContainer<T[K]>;
}) {
  for (const key in wrapped) {
    const container = wrapped[key];
    console.log(`Key: ${key}, Value: ${container.getValue()}`);
  }
}
