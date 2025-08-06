
import { db } from '../db';
import { landingPageContentTable, brandingConfigTable, teamMembersTable, roadmapItemsTable } from '../db/schema';
import { type LandingPageData } from '../schema';
import { asc, eq } from 'drizzle-orm';

export const getLandingPageData = async (): Promise<LandingPageData> => {
  try {
    // Fetch branding configuration (get first record or use defaults)
    const brandingResults = await db.select()
      .from(brandingConfigTable)
      .limit(1)
      .execute();

    const branding = brandingResults.length > 0 
      ? brandingResults[0]
      : {
          id: 1,
          primary_color: '#6366f1', // Indigo-500
          secondary_color: '#1f2937', // Gray-800
          accent_color: '#f59e0b', // Amber-500
          font_family: 'Inter, sans-serif',
          logo_url: null,
          favicon_url: null,
          coin_name: 'ultaCoin',
          coin_symbol: 'ULTA',
          created_at: new Date(),
          updated_at: new Date()
        };

    // Fetch all active content sections ordered by order_index
    const content = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.is_active, true))
      .orderBy(asc(landingPageContentTable.order_index))
      .execute();

    // Fetch all active team members ordered by order_index
    const teamMembers = await db.select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.is_active, true))
      .orderBy(asc(teamMembersTable.order_index))
      .execute();

    // Fetch all active roadmap items ordered by year and order_index
    const roadmapItems = await db.select()
      .from(roadmapItemsTable)
      .where(eq(roadmapItemsTable.is_active, true))
      .orderBy(asc(roadmapItemsTable.year), asc(roadmapItemsTable.order_index))
      .execute();

    return {
      branding,
      content,
      teamMembers,
      roadmapItems
    };
  } catch (error) {
    console.error('Failed to fetch landing page data:', error);
    throw error;
  }
};
