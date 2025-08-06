
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { 
  createLandingPageContentInputSchema, 
  updateBrandingConfigInputSchema,
  createTeamMemberInputSchema,
  createRoadmapItemInputSchema
} from './schema';
import { getLandingPageData } from './handlers/get_landing_page_data';
import { createLandingPageContent } from './handlers/create_landing_page_content';
import { updateBrandingConfig } from './handlers/update_branding_config';
import { createTeamMember } from './handlers/create_team_member';
import { createRoadmapItem } from './handlers/create_roadmap_item';
import { getBrandingConfig } from './handlers/get_branding_config';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Get complete landing page data (branding + content + team + roadmap)
  getLandingPageData: publicProcedure
    .query(() => getLandingPageData()),

  // Get branding configuration only
  getBrandingConfig: publicProcedure
    .query(() => getBrandingConfig()),

  // Create landing page content section
  createLandingPageContent: publicProcedure
    .input(createLandingPageContentInputSchema)
    .mutation(({ input }) => createLandingPageContent(input)),

  // Update branding configuration
  updateBrandingConfig: publicProcedure
    .input(updateBrandingConfigInputSchema)
    .mutation(({ input }) => updateBrandingConfig(input)),

  // Create team member
  createTeamMember: publicProcedure
    .input(createTeamMemberInputSchema)
    .mutation(({ input }) => createTeamMember(input)),

  // Create roadmap item
  createRoadmapItem: publicProcedure
    .input(createRoadmapItemInputSchema)
    .mutation(({ input }) => createRoadmapItem(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`ultaCoin Landing Page API server listening at port: ${port}`);
}

start();
