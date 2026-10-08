import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { handleMentorChat, handleReverseEngineer, handleGenerateQuiz } from './server/geminiApi';

function careerQuestApiPlugin(): Plugin {
  return {
    name: 'careerquest-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              res.setHeader('Content-Type', 'application/json');

              if (req.url === '/api/chat') {
                const result = await handleMentorChat(
                  parsed.messages,
                  parsed.profile,
                  parsed.roadmapContext,
                  parsed.granularContext
                );
                res.end(JSON.stringify(result));
                return;
              }

              if (req.url === '/api/reverse-engineer') {
                const result = await handleReverseEngineer(
                  parsed.targetCompany,
                  parsed.targetRole,
                  parsed.jobDescription,
                  parsed.profile
                );
                res.end(JSON.stringify(result));
                return;
              }

              if (req.url === '/api/quiz') {
                const result = await handleGenerateQuiz(parsed.topicTitle, parsed.userLevel || 'Beginner');
                res.end(JSON.stringify(result));
                return;
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), careerQuestApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
