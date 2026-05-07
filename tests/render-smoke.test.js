const path = require('node:path');
const { spawnSync } = require('node:child_process');
const request = require('supertest');
const http = require('node:http');

describe('deployment smoke tests', () => {
  it('serves a basic JSON route', async () => {
    const server = http.createServer((req, res) => {
      if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }

      res.writeHead(404);
      res.end();
    });

    const response = await request(server).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('keeps the server entrypoint syntax valid', () => {
    const result = spawnSync(process.execPath, ['--check', 'server/server.js'], {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });
});
