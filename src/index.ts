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

const qry = new DbQuery(table, (fields) => ({
  field1: fields.договор_id,
  field2: `${fields.начисл} * 10`,
}));
console.log(qry.querySql());

const qry2 = new DbQuery(qry, (fields) => ({
  field3: fields.field1,
  field4: fields.field2,
}));

console.log(qry2.querySql());


let src = new DbSource({ a: qry2 });

let ff = src.fields();

let qq = ff.a

let xx = qry2.fields()

let a:DbQuery<{
    field1: string;
    field2: string;
}, {
    field3: string;
    field4: string;
}>




// let ss = src.dbSet();

let ee = src.entry();



// let ssf = src.dbSetFields();

let x = ee.a;

// let x = srcFields.a;
