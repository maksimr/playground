require('http').createServer(function(req, res) {
  const parse = require('url').parse;

  if (
    req.url.startsWith('/api/channel') &&
    req.headers['accept'].match('text/event-stream')) {
    const id = parse(req.url, true).query.id;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });


    req.connection.on('close', ((id) => () => clearInterval(id))(
      setInterval(() => {
        if (!res.finished) {
          const data = JSON.stringify({
            event: 'foo',
            date: Date.now(),
            id: id,
            data: process.versions
          });
          res.write(`data: ${data}\n`);
          res.write('\n');
        }
      }, 1000)
    ));
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(8088);