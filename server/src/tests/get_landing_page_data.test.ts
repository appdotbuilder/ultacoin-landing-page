
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPageContentTable, brandingConfigTable, teamMembersTable, roadmapItemsTable } from '../db/schema';
import { getLandingPageData } from '../handlers/get_landing_page_data';

describe('getLandingPageData', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return default branding when no config exists', async () => {
    const result = await getLandingPageData();

    expect(result.branding.primary_color).toEqual('#6366f1');
    expect(result.branding.secondary_color).toEqual('#1f2937');
    expect(result.branding.accent_color).toEqual('#f59e0b');
    expect(result.branding.font_family).toEqual('Inter, sans-serif');
    expect(result.branding.coin_name).toEqual('ultaCoin');
    expect(result.branding.coin_symbol).toEqual('ULTA');
    expect(result.content).toEqual([]);
    expect(result.teamMembers).toEqual([]);
    expect(result.roadmapItems).toEqual([]);
  });

  it('should return actual branding configuration when it exists', async () => {
    // Insert branding config
    await db.insert(brandingConfigTable)
      .values({
        primary_color: '#ff0000',
        secondary_color: '#00ff00',
        accent_color: '#0000ff',
        font_family: 'Arial, sans-serif',
        logo_url: 'https://example.com/logo.png',
        favicon_url: 'https://example.com/favicon.ico',
        coin_name: 'TestCoin',
        coin_symbol: 'TEST'
      })
      .execute();

    const result = await getLandingPageData();

    expect(result.branding.primary_color).toEqual('#ff0000');
    expect(result.branding.secondary_color).toEqual('#00ff00');
    expect(result.branding.accent_color).toEqual('#0000ff');
    expect(result.branding.font_family).toEqual('Arial, sans-serif');
    expect(result.branding.logo_url).toEqual('https://example.com/logo.png');
    expect(result.branding.favicon_url).toEqual('https://example.com/favicon.ico');
    expect(result.branding.coin_name).toEqual('TestCoin');
    expect(result.branding.coin_symbol).toEqual('TEST');
  });

  it('should return only active content sections ordered by order_index', async () => {
    // Insert test content sections
    await db.insert(landingPageContentTable)
      .values([
        {
          section_name: 'features',
          title: 'Features',
          content: 'Feature content',
          order_index: 2,
          is_active: true
        },
        {
          section_name: 'about',
          title: 'About Us',
          content: 'About content',
          order_index: 1,
          is_active: true
        },
        {
          section_name: 'inactive',
          title: 'Inactive Section',
          content: 'Inactive content',
          order_index: 3,
          is_active: false
        }
      ])
      .execute();

    const result = await getLandingPageData();

    expect(result.content).toHaveLength(2);
    expect(result.content[0].section_name).toEqual('about');
    expect(result.content[0].order_index).toEqual(1);
    expect(result.content[1].section_name).toEqual('features');
    expect(result.content[1].order_index).toEqual(2);
  });

  it('should return only active team members ordered by order_index', async () => {
    // Insert test team members
    await db.insert(teamMembersTable)
      .values([
        {
          name: 'Bob Smith',
          position: 'CTO',
          bio: 'Tech leader',
          image_url: null,
          linkedin_url: null,
          twitter_url: null,
          order_index: 2,
          is_active: true
        },
        {
          name: 'Alice Johnson',
          position: 'CEO',
          bio: 'Company founder',
          image_url: 'https://example.com/alice.jpg',
          linkedin_url: 'https://linkedin.com/in/alice',
          twitter_url: 'https://twitter.com/alice',
          order_index: 1,
          is_active: true
        },
        {
          name: 'Charlie Brown',
          position: 'Former Employee',
          bio: 'Left the company',
          image_url: null,
          linkedin_url: null,
          twitter_url: null,
          order_index: 3,
          is_active: false
        }
      ])
      .execute();

    const result = await getLandingPageData();

    expect(result.teamMembers).toHaveLength(2);
    expect(result.teamMembers[0].name).toEqual('Alice Johnson');
    expect(result.teamMembers[0].position).toEqual('CEO');
    expect(result.teamMembers[0].order_index).toEqual(1);
    expect(result.teamMembers[1].name).toEqual('Bob Smith');
    expect(result.teamMembers[1].position).toEqual('CTO');
    expect(result.teamMembers[1].order_index).toEqual(2);
  });

  it('should return only active roadmap items ordered by year and order_index', async () => {
    // Insert test roadmap items
    await db.insert(roadmapItemsTable)
      .values([
        {
          title: 'Q2 2024 Feature',
          description: 'Second quarter feature',
          quarter: 'Q2',
          year: 2024,
          status: 'planned',
          order_index: 2,
          is_active: true
        },
        {
          title: 'Q1 2024 Feature',
          description: 'First quarter feature',
          quarter: 'Q1',
          year: 2024,
          status: 'completed',
          order_index: 1,
          is_active: true
        },
        {
          title: 'Q1 2025 Feature',
          description: 'Next year feature',
          quarter: 'Q1',
          year: 2025,
          status: 'planned',
          order_index: 1,
          is_active: true
        },
        {
          title: 'Cancelled Feature',
          description: 'This was cancelled',
          quarter: 'Q3',
          year: 2024,
          status: 'planned',
          order_index: 3,
          is_active: false
        }
      ])
      .execute();

    const result = await getLandingPageData();

    expect(result.roadmapItems).toHaveLength(3);
    // Should be ordered by year first, then order_index
    expect(result.roadmapItems[0].title).toEqual('Q1 2024 Feature');
    expect(result.roadmapItems[0].year).toEqual(2024);
    expect(result.roadmapItems[0].order_index).toEqual(1);
    expect(result.roadmapItems[1].title).toEqual('Q2 2024 Feature');
    expect(result.roadmapItems[1].year).toEqual(2024);
    expect(result.roadmapItems[1].order_index).toEqual(2);
    expect(result.roadmapItems[2].title).toEqual('Q1 2025 Feature');
    expect(result.roadmapItems[2].year).toEqual(2025);
    expect(result.roadmapItems[2].order_index).toEqual(1);
  });

  it('should return complete landing page data with all sections populated', async () => {
    // Insert branding config
    await db.insert(brandingConfigTable)
      .values({
        primary_color: '#333333',
        secondary_color: '#666666',
        accent_color: '#999999',
        font_family: 'Roboto, sans-serif',
        logo_url: 'https://example.com/logo.png',
        favicon_url: null,
        coin_name: 'MyToken',
        coin_symbol: 'MTK'
      })
      .execute();

    // Insert content
    await db.insert(landingPageContentTable)
      .values({
        section_name: 'hero',
        title: 'Welcome to MyToken',
        content: 'Hero section content',
        order_index: 1,
        is_active: true
      })
      .execute();

    // Insert team member
    await db.insert(teamMembersTable)
      .values({
        name: 'John Doe',
        position: 'Founder',
        bio: 'Experienced blockchain developer',
        image_url: 'https://example.com/john.jpg',
        linkedin_url: 'https://linkedin.com/in/john',
        twitter_url: null,
        order_index: 1,
        is_active: true
      })
      .execute();

    // Insert roadmap item
    await db.insert(roadmapItemsTable)
      .values({
        title: 'Token Launch',
        description: 'Launch our token on mainnet',
        quarter: 'Q4',
        year: 2024,
        status: 'in_progress',
        order_index: 1,
        is_active: true
      })
      .execute();

    const result = await getLandingPageData();

    // Verify all sections are populated
    expect(result.branding.coin_name).toEqual('MyToken');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].section_name).toEqual('hero');
    expect(result.teamMembers).toHaveLength(1);
    expect(result.teamMembers[0].name).toEqual('John Doe');
    expect(result.roadmapItems).toHaveLength(1);
    expect(result.roadmapItems[0].title).toEqual('Token Launch');
    expect(result.roadmapItems[0].status).toEqual('in_progress');
  });
});
