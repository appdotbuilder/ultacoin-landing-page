
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { brandingConfigTable } from '../db/schema';
import { type UpdateBrandingConfigInput } from '../schema';
import { updateBrandingConfig } from '../handlers/update_branding_config';

describe('updateBrandingConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper to create initial branding config
  const createInitialConfig = async () => {
    const result = await db.insert(brandingConfigTable)
      .values({
        primary_color: '#000000',
        secondary_color: '#ffffff',
        accent_color: '#ff0000',
        font_family: 'Arial',
        logo_url: 'https://example.com/logo.png',
        favicon_url: 'https://example.com/favicon.ico',
        coin_name: 'TestCoin',
        coin_symbol: 'TEST'
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should update only provided fields', async () => {
    const initial = await createInitialConfig();
    
    const input: UpdateBrandingConfigInput = {
      primary_color: '#6366f1',
      coin_name: 'ultaCoin'
    };

    const result = await updateBrandingConfig(input);

    expect(result.id).toEqual(initial.id);
    expect(result.primary_color).toEqual('#6366f1');
    expect(result.coin_name).toEqual('ultaCoin');
    // Unchanged fields should remain the same
    expect(result.secondary_color).toEqual('#ffffff');
    expect(result.accent_color).toEqual('#ff0000');
    expect(result.font_family).toEqual('Arial');
    expect(result.logo_url).toEqual('https://example.com/logo.png');
    expect(result.favicon_url).toEqual('https://example.com/favicon.ico');
    expect(result.coin_symbol).toEqual('TEST');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(initial.updated_at.getTime());
  });

  it('should update nullable fields to null', async () => {
    await createInitialConfig();
    
    const input: UpdateBrandingConfigInput = {
      logo_url: null,
      favicon_url: null
    };

    const result = await updateBrandingConfig(input);

    expect(result.logo_url).toBeNull();
    expect(result.favicon_url).toBeNull();
  });

  it('should update all fields when provided', async () => {
    await createInitialConfig();
    
    const input: UpdateBrandingConfigInput = {
      primary_color: '#1f2937',
      secondary_color: '#9ca3af',
      accent_color: '#f59e0b',
      font_family: 'Inter, sans-serif',
      logo_url: 'https://newsite.com/logo.png',
      favicon_url: 'https://newsite.com/favicon.ico',
      coin_name: 'NewCoin',
      coin_symbol: 'NEW'
    };

    const result = await updateBrandingConfig(input);

    expect(result.primary_color).toEqual('#1f2937');
    expect(result.secondary_color).toEqual('#9ca3af');
    expect(result.accent_color).toEqual('#f59e0b');
    expect(result.font_family).toEqual('Inter, sans-serif');
    expect(result.logo_url).toEqual('https://newsite.com/logo.png');
    expect(result.favicon_url).toEqual('https://newsite.com/favicon.ico');
    expect(result.coin_name).toEqual('NewCoin');
    expect(result.coin_symbol).toEqual('NEW');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should persist changes to database', async () => {
    const initial = await createInitialConfig();
    
    const input: UpdateBrandingConfigInput = {
      primary_color: '#6366f1',
      coin_name: 'ultaCoin'
    };

    await updateBrandingConfig(input);

    // Verify changes were persisted
    const configs = await db.select()
      .from(brandingConfigTable)
      .execute();

    expect(configs).toHaveLength(1);
    expect(configs[0].primary_color).toEqual('#6366f1');
    expect(configs[0].coin_name).toEqual('ultaCoin');
    expect(configs[0].secondary_color).toEqual('#ffffff'); // Unchanged
    expect(configs[0].updated_at.getTime()).toBeGreaterThan(initial.updated_at.getTime());
  });

  it('should throw error when no branding config exists', async () => {
    const input: UpdateBrandingConfigInput = {
      primary_color: '#6366f1'
    };

    await expect(updateBrandingConfig(input)).rejects.toThrow(/no branding configuration found/i);
  });
});
