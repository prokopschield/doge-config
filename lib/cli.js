#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const w = process.argv.pop();
if (!w)
    process.exit();
const conf = new _1.Config(w);
console.log(JSON.parse(JSON.stringify(conf)));
