import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";

export const Products = pgTable(
  "products",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    clerkId: varchar("clerk_id", { length }).notNull(),

    name: varchar("name", { length }).notNull(),
    url: text("url").notNull(),
    description: text("description"),

    createdAt,
    updatedAt,
  },
  // BUG: this cause pgTable invalid signature
  // (table) => {
  //   return {
  //     clerkIdIndex: index("clerk_id_index").on(table.clerkId),
  //   };
  // },
);
