/* 
    drizzle-orm to interact with db and fetch records
    drizzle-kit is dev tool to migrate changes (e.g. add new table make sure table synced with db
        so use kit to push updates of new table to db)
*/

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const $notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    imageUrl: text('imageUrl'),
    userId: text('user_id').notNull(),
    editorState: text('editor_state'),
});

export type NoteType = typeof $notes.$inferInsert;

