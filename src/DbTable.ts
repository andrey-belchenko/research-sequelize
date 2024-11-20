export type DbSetFields<TSetProto extends object> = {
  [K in keyof TSetProto]: string;
};

export type DbSourceFields<TEntry extends DbSourceEntry<object>> = {
  [K in keyof TEntry]: DbSetFields<
    TEntry[K] extends DbSet<infer TSetProto> ? TSetProto : never
  >;
};
// ValueContainer<infer U> ? U : never
// extends ValueContainer<infer U> ? U : never
export type DbSourceEntry<TSetProto extends object> = {
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

  abstract sql(): string;
  abstract querySql(): string;
}

export class DbTable<TSetProto extends object> extends DbSet<TSetProto> {
  private name: string;

  constructor(name: string, proto: TSetProto) {
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

export class DbFrom<TEntry extends DbSourceEntry<object>> {
  constructor(sources: TEntry) {}
  fields(): DbSourceFields<TEntry> {
    return {} as DbSourceFields<TEntry>;
  }

  join<TJoinedEntry extends DbSourceEntry<object>>(
    entry: TJoinedEntry
  ): DbFrom<TEntry & TJoinedEntry> {
    return {} as DbFrom<TEntry & TJoinedEntry>;
  }

}

export class DbSelect<
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
