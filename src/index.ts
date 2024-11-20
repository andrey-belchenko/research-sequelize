// const greet = (name: string): string => {
//   return `Hello, ${name}!`;
// };
// console.log(greet("World"));

import { DbQuery, DbSource, DbTable } from "./DbTable";

interface msr_фин_начисл {
  id: number;
  changed_at: Date;
  refresh_slice_id: number;
  договор_id: number;
  вид_реал_id: number;
  дата: Date;
  док_нач_id: number;
  вид_тов_id: number;
  начисл: number;
}

const exampleObject = {
  id: 1,
  changed_at: new Date("2023-10-01T10:00:00Z"),
  refresh_slice_id: 101,
  договор_id: 202,
  вид_реал_id: 303,
  дата: new Date("2023-10-01"),
  док_нач_id: 404,
  вид_тов_id: 505,
  начисл: 1000.5,
};

const table = new DbTable("report_dm.msr_фин_начисл", exampleObject);
// const fields = table.fields();

// const result = table.query((fields) => ({
//   field1: `${fields.начисл} * 10`,
// }));

const qry = new DbQuery(new DbSource({ a: table }), (src) => ({
  field1: src.a.договор_id,
  field2: `${src.a.начисл} * 10`,
}));

console.log(qry.querySql());

const qry2 = new DbQuery(new DbSource({ a: qry }), (src) => ({
  field3: src.a.field1,
  field4: src.a.field2,
}));

console.log(qry2.querySql());

let src = new DbSource({ a: qry2 }).join({ b: table }).join({ c: qry });

let ff = src.fields();

let x1 = ff.c.field1;

// let ss = src.dbSet();

// let x = srcFields.a;
