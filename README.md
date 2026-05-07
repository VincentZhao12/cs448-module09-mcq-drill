# cs448-module09-mcq-drill
CS448 module 09+ final-style MCQ drill

## Leaderboard setup

The leaderboard uses Supabase from a static GitHub Pages site. Each browser gets a local UUID in `localStorage`; there is no login. This branch is configured for the `cs448-leaderboard` Supabase project in `VincentZhao12's Org`.

The deployed database table is `public.leaderboard_entries`. The same schema is kept in both `supabase-schema.sql` for quick review and `supabase/migrations/20260507210200_leaderboard_entries.sql` for CLI-managed setup.

To recreate it manually:

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the SQL editor.
3. Copy the Project URL and publishable/anon key into `leaderboard-config.js`.
4. Deploy the static files to GitHub Pages.
