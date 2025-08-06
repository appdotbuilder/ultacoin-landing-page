
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type CreateLandingPageContentInput } from '../schema';
import { createLandingPageContent } from '../handlers/create_landing_page_content';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateLandingPageContentInput = {
  section_name: 'about',
  title: 'About Our Project',
  content: 'This is the about section content describing our innovative blockchain project.',
  order_index: 1,
  is_active: true
};

describe('createLandingPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create landing page content', async () => {
    const result = await createLandingPageContent(testInput);

    // Basic field validation
    expect(result.section_name).toEqual('about');
    expect(result.title).toEqual('About Our Project');
    expect(result.content).toEqual(testInput.content);
    expect(result.order_index).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save content to database', async () => {
    const result = await createLandingPageContent(testInput);

    // Query using proper drizzle syntax
    const content = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, result.id))
      .execute();

    expect(content).toHaveLength(1);
    expect(content[0].section_name).toEqual('about');
    expect(content[0].title).toEqual('About Our Project');
    expect(content[0].content).toEqual(testInput.content);
    expect(content[0].order_index).toEqual(1);
    expect(content[0].is_active).toEqual(true);
    expect(content[0].created_at).toBeInstanceOf(Date);
    expect(content[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create content with default is_active value', async () => {
    const inputWithoutIsActive: CreateLandingPageContentInput = {
      section_name: 'features',
      title: 'Key Features',
      content: 'Our platform offers cutting-edge features for modern blockchain applications.',
      order_index: 2,
      is_active: true // Zod default is applied
    };

    const result = await createLandingPageContent(inputWithoutIsActive);

    expect(result.is_active).toEqual(true);
    expect(result.section_name).toEqual('features');
    expect(result.order_index).toEqual(2);
  });

  it('should handle different section types', async () => {
    const tokenomicsInput: CreateLandingPageContentInput = {
      section_name: 'tokenomics',
      title: 'Tokenomics Overview',
      content: 'Detailed breakdown of our token distribution and utility mechanisms.',
      order_index: 3,
      is_active: true
    };

    const result = await createLandingPageContent(tokenomicsInput);

    expect(result.section_name).toEqual('tokenomics');
    expect(result.title).toEqual('Tokenomics Overview');
    expect(result.content).toEqual(tokenomicsInput.content);
    expect(result.order_index).toEqual(3);
  });

  it('should create inactive content when specified', async () => {
    const inactiveInput: CreateLandingPageContentInput = {
      section_name: 'roadmap-intro',
      title: 'Roadmap Introduction',
      content: 'Introduction to our development roadmap and future milestones.',
      order_index: 4,
      is_active: false
    };

    const result = await createLandingPageContent(inactiveInput);

    expect(result.is_active).toEqual(false);
    expect(result.section_name).toEqual('roadmap-intro');
  });
});
