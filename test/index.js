'use strict'

const test = require('tape').test
const split = require('split2')
const flatline = require('../flatline')
const nestline = require('../nestline')
const fs = require('fs')
const concat = require('terminus').concat

test('small input w/ error', (t) => {
  fs.createReadStream(`${__dirname}/input.ndjson`)
    .pipe(split())
    .pipe(flatline())
    .pipe(concat((flat) => {
      const lineCount = flat.toString().trim().split('\n').length
      t.equal(lineCount, 8)
      console.log()
      t.end()
    }))
})

test('small clean input', (t) => {
  fs.createReadStream(`${__dirname}/clean.ndjson`)
    .pipe(split())
    .pipe(flatline())
    .pipe(concat((flat) => {
      const lineCount = flat.toString().trim().split('\n').length
      t.equal(lineCount, 7)
      console.log()
      t.end()
    }))
})

test('long dirty input', (t) => {
  fs.createReadStream(`${__dirname}/metrics.ndjson`)
    .pipe(split())
    .pipe(flatline())
    .pipe(concat((flat) => {
      const lineCount = flat.toString().trim().split('\n').length
      t.equal(lineCount, 5292)
      console.log()
      t.end()
    }))
})

test('reverse it', (t) => {
  fs.createReadStream(`${__dirname}/clean.ndjson`)
    .pipe(split())
    .pipe(flatline())
    .pipe(nestline())
    .pipe(concat((flat) => {
      const lineCount = flat.toString().trim().split('\n').length
      t.equal(lineCount, 3)
      console.log()
      t.end()
    }))
})

test('nest it', (t) => {
  fs.createReadStream(`${__dirname}/flatmetrics.lines`)
    .pipe(split())
    .pipe(nestline())
    .pipe(concat((flat) => {
      const lineCount = flat.toString().trim().split('\n').length
      t.equal(lineCount, 237)
      console.log()
      t.end()
    }))
})
