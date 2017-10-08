"use strict";
exports.__esModule = true;
require("zone.js/dist/zone-node");
require("reflect-metadata");
var core_1 = require("@angular/core");
var express = require("express");
var http2 = require("http2");
var path_1 = require("path");
var fs_1 = require("fs");
// Faster server renders w/ Prod mode (dev mode never needed)
core_1.enableProdMode();
// Express server
var app = express();
var PORT = process.env.PORT || 4000;
var DIST_FOLDER = path_1.join(process.cwd(), 'dist');
// Our index.html we'll use as our template
var template = fs_1.readFileSync(path_1.join(DIST_FOLDER, 'browser', 'index.html')).toString();
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
var _a = require('./dist/server/main.bundle'), AppServerModuleNgFactory = _a.AppServerModuleNgFactory, LAZY_MODULE_MAP = _a.LAZY_MODULE_MAP;
// Express Engine
var express_engine_1 = require("@nguniversal/express-engine");
// Import module map for lazy loading
var module_map_ngfactory_loader_1 = require("@nguniversal/module-map-ngfactory-loader");
// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', express_engine_1.ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        module_map_ngfactory_loader_1.provideModuleMap(LAZY_MODULE_MAP)
    ]
}));
app.set('view engine', 'html');
app.set('views', path_1.join(DIST_FOLDER, 'browser'));
/* - Example Express Rest API endpoints -
  app.get('/api/**', (req, res) => { });
*/
// Server static files from /browser
app.get('*.*', express.static(path_1.join(DIST_FOLDER, 'browser'), {
    maxAge: '1y'
}));
var pushFile;
findStaticFiles();
console.log(path_1.join(DIST_FOLDER, 'browser', pushFile));
// app.use(function(req, res, next)
// {
//     if(req.url == '/')
//     {
//         let stream = res.push(join(DIST_FOLDER, 'browser', pushFile), {
//             status: 200, // optional
//             method: 'GET', // optional
//             request: {
//                 accept: '*/*'
//             },
//             response: {
//                 'content-type': 'application/javascript'
//             }
//         });
//         // res.render('index', { req });
//         res.end();
//     }
//
//     next();
// });
// ALl regular routes use the Universal engine
app.get('*', function (req, res) {
    res.stream.pushStream({
        status: 200,
        method: 'GET',
        request: {
            accept: '*/*'
        },
        response: {
            'content-type': 'application/javascript'
        }
    }, function (pushStream) {
        pushStream.respondWithFD(path_1.join(DIST_FOLDER, 'browser', pushFile));
    });
    res.render('index', { req: req });
});
var options = {
    key: fs_1.readFileSync('./server.key'),
    cert: fs_1.readFileSync('./server.crt')
};
http2
    .createSecureServer(options, app)
    .listen(PORT, function (error) {
    if (error) {
        console.error(error);
        return process.exit(1);
    }
    else {
        console.log('Listening on port: ' + PORT + '.');
    }
});
// spdy
//     .createServer(options, function (req, res) {
//         if(req.url == '/')
//         {
//             let stream = res.push(join(DIST_FOLDER, 'browser', pushFile), {
//                 status: 200, // optional
//                 method: 'GET', // optional
//                 request: {
//                     accept: '*/*'
//                 },
//                 response: {
//                     'content-type': 'application/javascript'
//                 }
//             });
//             // res.render('index', { req });
//             res.end();
//         }
//         // spdy.addHandler(app);
//         // req.next();
//     })
//     .listen(PORT, (error) => {
//         if (error) {
//             console.error(error);
//             return process.exit(1)
//         } else {
//             console.log('Listening on port: ' + PORT + '.')
//         }
//     });
// Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// });
function findStaticFiles() {
    fs_1.readdirSync(path_1.join(DIST_FOLDER, 'browser').toString()).forEach(function (file) {
        console.log(file);
        pushFile = file;
    });
}
