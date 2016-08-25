#!/usr/bin/env node
'use strict'

const split = require('split2')
const pipeline = require('./flatline')

if (process.stdin.readable) {
  process.stdin.pipe(split())
    .pipe(pipeline())
    .pipe(process.stdout)
}
