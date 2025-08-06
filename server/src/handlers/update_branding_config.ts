
import { db } from '../db';
import { brandingConfigTable } from '../db/schema';
import { type UpdateBrandingConfigInput, type BrandingConfig } from '../schema';
import { eq, sql } from 'drizzle-orm';

export const updateBrandingConfig = async (input: UpdateBrandingConfigInput): Promise<BrandingConfig> => {
  try {
    // Get the current branding config (assuming there's only one row)
    const existing = await db.select()
      .from(brandingConfigTable)
      .limit(1)
      .execute();

    if (existing.length === 0) {
      throw new Error('No branding configuration found');
    }

    const currentConfig = existing[0];

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: sql`now()`
    };

    if (input.primary_color !== undefined) {
      updateData.primary_color = input.primary_color;
    }
    if (input.secondary_color !== undefined) {
      updateData.secondary_color = input.secondary_color;
    }
    if (input.accent_color !== undefined) {
      updateData.accent_color = input.accent_color;
    }
    if (input.font_family !== undefined) {
      updateData.font_family = input.font_family;
    }
    if (input.logo_url !== undefined) {
      updateData.logo_url = input.logo_url;
    }
    if (input.favicon_url !== undefined) {
      updateData.favicon_url = input.favicon_url;
    }
    if (input.coin_name !== undefined) {
      updateData.coin_name = input.coin_name;
    }
    if (input.coin_symbol !== undefined) {
      updateData.coin_symbol = input.coin_symbol;
    }

    // Update the branding config
    const result = await db.update(brandingConfigTable)
      .set(updateData)
      .where(eq(brandingConfigTable.id, currentConfig.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Branding configuration update failed:', error);
    throw error;
  }
};
