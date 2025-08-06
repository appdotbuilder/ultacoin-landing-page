
import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type CreateLandingPageContentInput, type LandingPageContent } from '../schema';

export const createLandingPageContent = async (input: CreateLandingPageContentInput): Promise<LandingPageContent> => {
  try {
    // Insert landing page content record
    const result = await db.insert(landingPageContentTable)
      .values({
        section_name: input.section_name,
        title: input.title,
        content: input.content,
        order_index: input.order_index,
        is_active: input.is_active
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Landing page content creation failed:', error);
    throw error;
  }
};
