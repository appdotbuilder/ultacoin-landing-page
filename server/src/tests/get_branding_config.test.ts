
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { brandingConfigTable } from '../db/schema';
import { getBrandingConfig } from '../handlers/get_branding_config';

describe('getBrandingConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return branding configuration when it exists', async () => {
    // Create test branding config
    await db.insert(brandingConfigTable)
      .values({
        primary_color: '#6366f1',
        secondary_color: '#1f2937',
        accent_color: '#f59e0b',
        font_family: 'Inter, sans-serif',
        logo_url: 'https://example.com/logo.png',
        favicon_url: 'https://example.com/favicon.ico',
        coin_name: 'ultaCoin',
        coin_symbol: 'ULTA'
      })
      .execute();

    const result = await getBrandingConfig();

    expect(result.primary_color).toEqual('#6366f1');
    expect(result.secondary_color).toEqual('#1f2937');
    expect(result.accent_color).toEqual('#f59e0b');
    expect(result.font_family).toEqual('Inter, sans-serif');
    expect(result.logo_url).toEqual('https://example.com/logo.png');
    expect(result.favicon_url).toEqual('https://example.com/favicon.ico');
    expect(result.coin_name).toEqual('ultaCoin');
    expect(result.coin_symbol).toEqual('ULTA');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should return configuration with nullable fields as null', async () => {
    // Create test branding config with null values
    await db.insert(brandingConfigTable)
      .values({
        primary_color: '#000000',
        secondary_color: '#ffffff',
        accent_color: '#ff0000',
        font_family: 'Arial',
        logo_url: null,
        favicon_url: null,
        coin_name: 'TestCoin',
        coin_symbol: 'TEST'
      })
      .execute();

    const result = await getBrandingConfig();

    expect(result.logo_url).toBeNull();
    expect(result.favicon_url).toBeNull();
    expect(result.coin_name).toEqual('TestCoin');
    expect(result.coin_symbol).toEqual('TEST');
  });

  it('should return the first configuration when multiple exist', async () => {
    // Create multiple branding configs
    await db.insert(brandingConfigTable)
      .values([
        {
          primary_color: '#first',
          secondary_color: '#first',
          accent_color: '#first',
          font_family: 'First',
          logo_url: null,
          favicon_url: null,
          coin_name: 'FirstCoin',
          coin_symbol: 'FIRST'
        },
        {
          primary_color: '#second',
          secondary_color: '#second',
          accent_color: '#second',
          font_family: 'Second',
          logo_url: null,
          favicon_url: null,
          coin_name: 'SecondCoin',
          coin_symbol: 'SECOND'
        }
      ])
      .execute();

    const result = await getBrandingConfig();

    expect(result.primary_color).toEqual('#first');
    expect(result.coin_name).toEqual('FirstCoin');
    expect(result.coin_symbol).toEqual('FIRST');
  });

  it('should throw error when no branding configuration exists', async () => {
    // Don't create any branding config
    await expect(getBrandingConfig()).rejects.toThrow(/no branding configuration found/i);
  });
});
