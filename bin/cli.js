#!/usr/bin/env node
var WSServer = require('../lib/WSServer');
new WSServer(process.argv[2]);
