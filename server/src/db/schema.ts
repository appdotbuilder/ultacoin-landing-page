
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enum for roadmap status
export const roadmapStatusEnum = pgEnum('roadmap_status', ['planned', 'in_progress', 'completed']);

// Landing page content sections table
export const landingPageContentTable = pgTable('landing_page_content', {
  id: serial('id').primaryKey(),
  section_name: text('section_name').notNull(), // e.g., 'about', 'features', 'tokenomics', etc.
  title: text('title').notNull(),
  content: text('content').notNull(), // JSON or HTML content for the section
  order_index: integer('order_index').notNull(), // For ordering sections
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Branding configuration table
export const brandingConfigTable = pgTable('branding_config', {
  id: serial('id').primaryKey(),
  primary_color: text('primary_color').notNull(), // Hex color code
  secondary_color: text('secondary_color').notNull(), // Hex color code
  accent_color: text('accent_color').notNull(), // Hex color code
  font_family: text('font_family').notNull(), // CSS font family
  logo_url: text('logo_url'), // URL to logo image, nullable
  favicon_url: text('favicon_url'), // URL to favicon, nullable
  coin_name: text('coin_name').notNull(), // e.g., "ultaCoin"
  coin_symbol: text('coin_symbol').notNull(), // e.g., "ULTA"
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Team members table
export const teamMembersTable = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  position: text('position').notNull(),
  bio: text('bio').notNull(),
  image_url: text('image_url'), // URL to member's photo, nullable
  linkedin_url: text('linkedin_url'), // LinkedIn profile URL, nullable
  twitter_url: text('twitter_url'), // Twitter profile URL, nullable
  order_index: integer('order_index').notNull(), // For ordering team members
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Roadmap items table
export const roadmapItemsTable = pgTable('roadmap_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  quarter: text('quarter').notNull(), // e.g., "Q1", "Q2", etc.
  year: integer('year').notNull(),
  status: roadmapStatusEnum('status').notNull().default('planned'),
  order_index: integer('order_index').notNull(), // For chronological ordering
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type LandingPageContent = typeof landingPageContentTable.$inferSelect;
export type NewLandingPageContent = typeof landingPageContentTable.$inferInsert;

export type BrandingConfig = typeof brandingConfigTable.$inferSelect;
export type NewBrandingConfig = typeof brandingConfigTable.$inferInsert;

export type TeamMember = typeof teamMembersTable.$inferSelect;
export type NewTeamMember = typeof teamMembersTable.$inferInsert;

export type RoadmapItem = typeof roadmapItemsTable.$inferSelect;
export type NewRoadmapItem = typeof roadmapItemsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  landingPageContent: landingPageContentTable,
  brandingConfig: brandingConfigTable,
  teamMembers: teamMembersTable,
  roadmapItems: roadmapItemsTable
};
