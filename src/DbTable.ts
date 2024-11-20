export type DbSetFields<T extends object> = { [K in keyof T]: string };

export type DbSourceFields<TEntry extends DbSourceEntry<object>> = {
  [K in keyof TEntry]: DbSetFields<
    TEntry[K] extends DbSet<infer TSet> ? TSet : never
  >;
};
// ValueContainer<infer U> ? U : never
// extends ValueContainer<infer U> ? U : never
export type DbSourceEntry<TSet extends object> = {
  [key: string]: DbSet<TSet>;
};

export abstract class DbSet<T extends object> {
  private proto: T;
  constructor(proto: T) {
    this.proto = proto;
  }

  fields(): DbSetFields<T> {
    const fieldNames = {} as DbSetFields<T>;
    for (const key in this.proto) {
      if (this.proto.hasOwnProperty(key)) {
        fieldNames[key] = key;
      }
    }
    return fieldNames;
  }

  abstract sql(): string;
  abstract querySql(): string;
}

export class DbTable<T extends object> extends DbSet<T> {
  private name: string;

  constructor(name: string, proto: T) {
    super(proto);
    this.name = name;
  }
  sql() {
    return this.name;
  }

  querySql(): string {
    return `select * from  ${this.name}`;
  }
}

// export class DbSource<TSet extends object> {
//   constructor(sources: { [key: string]: DbSet<TSet> }) {}
//   fields(): DbSourceFields<{ [key: string]: DbSet<TSet> }, TSet> {
//     return {} as DbSourceFields<{ [key: string]: DbSet<TSet> }, TSet>;
//   }

//   dbSet(): TSet {
//     return {} as TSet;
//   }

//   dbSetFields(): DbSetFields<TSet> {
//     return {} as DbSetFields<TSet>;
//   }

//   entry(): { [key: string]: DbSet<TSet> } {
//     return {} as { [key: string]: DbSet<TSet> };
//   }
// }

export class DbSource<TSet extends object, TEntry extends DbSourceEntry<TSet>> {
  constructor(sources: TEntry) {}
  fields(): DbSourceFields<TEntry> {
    return {} as DbSourceFields<TEntry>;
  }

  //   dbSet(): TSet {
  //     return {} as TSet;
  //   }

  //   dbSetFields(): DbSetFields<TSet> {
  //     return {} as DbSetFields<TSet>;
  //   }

  entry(): TEntry {
    return {} as TEntry;
  }
}

export class DbQuery<
  TSource extends object,
  TResult extends object
> extends DbSet<TResult> {
  private source: DbSet<TSource>;
  //   private select: (fields: DbTableFields<TSource>) => TResult;
  private selectOptions: object;
  constructor(
    source: DbSet<TSource>,
    select: (fields: DbSetFields<TSource>) => TResult
  ) {
    const selectOptions = select(source.fields());
    super(selectOptions);
    this.selectOptions = selectOptions;
    this.source = source;
    // this.select = select;
  }

  querySql(): string {
    const selectFields = Object.entries(this.selectOptions).map(
      ([key, value]) => `${value} as ${key}`
    );
    return `select ${selectFields.join(",")} from ${this.source.sql()}`;
  }

  sql() {
    return `(${this.querySql()})`;
  }
}

// export class ValueContainer<T> {
//   value: T;
//   constructor(value: T) {
//     this.value = value;
//   }

//   getValue(): T {
//     return this.value;
//   }
//   // some other logic
// }

// export function wrapValues(proto: any) {
//   const result: any = {};
//   for (let name in proto) {
//     const value = proto[name];
//     result[name] = new ValueContainer(value);
//   }
//   return result;
// }

// const values = {
//   a: 123,
//   b: "abc",
// };

// const wrappedValues = wrapValues(values) as {
//   a: ValueContainer<number>;
//   b: ValueContainer<string>;
// };

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

// export function unwrapValues(wrappedValues:any){
//     const result: any = {};
//     for (let name in wrappedValues) {
//       const value = wrappedValues[name].getValue();
//       result[name] = value;
//     }
//     return result;
// }

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
