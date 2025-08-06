
import { db } from '../db';
import { brandingConfigTable } from '../db/schema';
import { type BrandingConfig } from '../schema';

export const getBrandingConfig = async (): Promise<BrandingConfig> => {
  try {
    // Get the most recent branding configuration
    const result = await db.select()
      .from(brandingConfigTable)
      .orderBy(brandingConfigTable.id)
      .limit(1)
      .execute();

    if (result.length === 0) {
      throw new Error('No branding configuration found');
    }

    return result[0];
  } catch (error) {
    console.error('Failed to get branding configuration:', error);
    throw error;
  }
};
