// const greet = (name: string): string => {
//   return `Hello, ${name}!`;
// };
// console.log(greet("World"));

import { DbTable } from "./DbTable";

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

const table = new DbTable(exampleObject);
const fields = table.fields();

console.log(fields);
