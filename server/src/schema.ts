
import { z } from 'zod';

// Landing page content schema
export const landingPageContentSchema = z.object({
  id: z.number(),
  section_name: z.string(),
  title: z.string(),
  content: z.string(),
  order_index: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LandingPageContent = z.infer<typeof landingPageContentSchema>;

// Branding configuration schema
export const brandingConfigSchema = z.object({
  id: z.number(),
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
  font_family: z.string(),
  logo_url: z.string().nullable(),
  favicon_url: z.string().nullable(),
  coin_name: z.string(),
  coin_symbol: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type BrandingConfig = z.infer<typeof brandingConfigSchema>;

// Team member schema
export const teamMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  bio: z.string(),
  image_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  order_index: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

// Roadmap item schema
export const roadmapItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  quarter: z.string(),
  year: z.number().int(),
  status: z.enum(['planned', 'in_progress', 'completed']),
  order_index: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type RoadmapItem = z.infer<typeof roadmapItemSchema>;

// Input schemas for creating/updating content
export const createLandingPageContentInputSchema = z.object({
  section_name: z.string(),
  title: z.string(),
  content: z.string(),
  order_index: z.number().int().nonnegative(),
  is_active: z.boolean().default(true)
});

export type CreateLandingPageContentInput = z.infer<typeof createLandingPageContentInputSchema>;

export const updateBrandingConfigInputSchema = z.object({
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  accent_color: z.string().optional(),
  font_family: z.string().optional(),
  logo_url: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  coin_name: z.string().optional(),
  coin_symbol: z.string().optional()
});

export type UpdateBrandingConfigInput = z.infer<typeof updateBrandingConfigInputSchema>;

export const createTeamMemberInputSchema = z.object({
  name: z.string(),
  position: z.string(),
  bio: z.string(),
  image_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  order_index: z.number().int().nonnegative(),
  is_active: z.boolean().default(true)
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberInputSchema>;

export const createRoadmapItemInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  quarter: z.string(),
  year: z.number().int(),
  status: z.enum(['planned', 'in_progress', 'completed']).default('planned'),
  order_index: z.number().int().nonnegative(),
  is_active: z.boolean().default(true)
});

export type CreateRoadmapItemInput = z.infer<typeof createRoadmapItemInputSchema>;

// Complete landing page data schema
export const landingPageDataSchema = z.object({
  branding: brandingConfigSchema,
  content: z.array(landingPageContentSchema),
  teamMembers: z.array(teamMemberSchema),
  roadmapItems: z.array(roadmapItemSchema)
});

export type LandingPageData = z.infer<typeof landingPageDataSchema>;
