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

const msr_фин_начисл = new DbTable("report_dm.msr_фин_начисл", {
  договор_id: null,
  вид_реал_id: null,
  дата: null,
  док_нач_id: null,
  вид_тов_id: null,
  начисл: null,
});

const dim_договор = new DbTable("report_dm.dim_договор", {
  договор_id: null,
  отделение_id: null,
  номер: null,
  участок_id: null,
  абонент_id: null,
  гр_потр_нас_id: null,
});

const dim_абонент = new DbTable("report_dm.dim_абонент", {
  абонент_id: null,
  код: null,
  имя: null,
});

const qry = new DbQuery(
  new DbSource({ a: msr_фин_начисл })
    .innerJoin(
      { d: dim_договор },
      (src) => `${src.a.договор_id}=${src.d.договор_id}`
    )
    .innerJoin(
      { ab: dim_абонент },
      (src) => `${src.d.абонент_id}=${src.ab.абонент_id}`
    ),
  (src) => ({
    абонент: src.ab.имя,
    договор: src.d.номер,
    начислено: src.a.начисл,
  })
);

console.log(qry.querySql());

//   select a.kodp абонент_id,
//   a.nump код,
//   a.name имя
// from kr_payer a

// const fields = table.fields();

// const result = table.query((fields) => ({
//   field1: `${fields.начисл} * 10`,
// }));

// const qry = new DbQuery(new DbSource({ a: msr_фин_начисл }), (src) => ({
//   field1: src.a.договор_id,
//   field2: `${src.a.начисл} * 10`,
// }));

// // console.log(qry.querySql());

// const qry2 = new DbQuery(new DbSource({ a: qry }), (src) => ({
//   field3: src.a.field1,
//   field4: src.a.field2,
// }));

// console.log(qry2.querySql());

// let src = new DbSource({ a: qry2 }).innerJoin({ b: table }).innerJoin({ c: qry });

// let ff = src.fields();

// let x1 = ff.c.field1;

// let ss = src.dbSet();

// let x = srcFields.a;
