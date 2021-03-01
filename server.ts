// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import {enableProdMode} from '@angular/core';

import * as https from 'https';
import * as http from 'http';
import * as express from 'express';
import * as compression from 'compression';
import * as domino from 'domino';
import {join} from 'path';
import {readFileSync} from 'fs';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
import {REQUEST, RESPONSE} from '@nguniversal/express-engine/tokens';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
const win: any = domino.createWindow(template);
global['window'] = win;
global['Event'] = win.Event;
global['document'] = win.document;
global['KeyboardEvent'] = win.KeyboardEvent;
global['MouseEvent'] = win.MouseEvent;
global['FocusEvent'] = win.FocusEvent;
global['PointerEvent'] = win.PointerEvent;
global['HTMLElement'] = win.HTMLElement;
global['object'] = win.object;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');
// For data compression
app.use(compression());

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.use((req, res, next) => {
  if (req.url === '/undefined' || req.url === '/null') {
    return res.status(404).send('data requests are not supported');
  }
  next();
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {maxAge: '14d'}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  global['navigator'] = req['headers']['user-agent'];
  res.render(
    'index',
    {
      req: req,
      res: res,
      providers: [
        {
          provide: REQUEST,
          useValue: req,
        },
        {
          provide: RESPONSE,
          useValue: res,
        }
      ],
    },
    (err, html) => {
      if (!!err) {
        throw err;
      }
      res.send(html);
    },
  );
});

// Start up the Node server

try {
  const privateKey = readFileSync('/etc/ssl/dev.ewo360.key', 'utf8');
  const certificate = readFileSync('/etc/ssl/dev.ewo360.crt', 'utf8');
  const certificateCA = readFileSync('/etc/ssl/gd_bundle-g2-g1.crt', 'utf8');

  // implement http to https redirect
  app.use((req, res) => {
    if (!req.secure || req.protocol === 'http') {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });

  const options = {key: privateKey, cert: certificate, ca: certificateCA};
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Node server listening on https://localhost:${PORT}`);
  });
} catch (err) {
  http.createServer(app).listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
  });
}
