#!/usr/bin/env node
var WSServer = require('../lib/WSServer');
new WSServer(process.argv[2] || process.env.WS_PORT || process.env.PORT || 9000);
