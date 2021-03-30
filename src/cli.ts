#!/usr/bin/env node

import { Config } from '.';

const w = process.argv.pop();

if (!w) process.exit();

const conf = new Config(w);

console.log(JSON.parse(JSON.stringify(conf)));
