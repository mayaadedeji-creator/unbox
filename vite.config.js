import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// On Vercel, files in api/ run as serverless functions. `npm run dev` is just Vite,
// which doesn't know about them, so this plugin runs them during local development:
// a request to /api/song-search calls the GET export in api/song-search.js.
// It only exists in dev; the real site still uses Vercel's functions.
function localApiFunctions() {
  return {
    name: 'local-api-functions',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const match = url.pathname.match(/^\/api\/([\w-]+)$/);
        if (!match) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`);
          const handler = mod[req.method];
          if (!handler) {
            res.statusCode = 405;
            return res.end();
          }
          const response = await handler(new Request(url, { method: req.method }));
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          // Missing file or a crash inside the function.
          server.config.logger.error(`[api/${match[1]}] ${err.message}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite normally only exposes VITE_ variables. The api/ functions read their secrets
  // (like SPOTIFY_CLIENT_SECRET) from process.env, so load all of .env.local there.
  // This stays on the dev server; none of it goes into the browser bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react(), localApiFunctions()],
  };
});
