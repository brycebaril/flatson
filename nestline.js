'use strict'

const through2 = require('through2')
const flatnest = require('flatnest')
const splice = require('stream-splice')

const lineRe = /\[(\d+)\]\.(.*): (.*)/

function getPipeline () {
  var current = null
  var working = {}
  const accumulator = through2(function accumulate (line, enc, callback) {
    const pieces = lineRe.exec(line)
    if (!pieces) {
      // derp?
      return callback()
    }
    if (current == null) {
      current = pieces[1]
    }
    const row = pieces[1]
    const key = pieces[2]
    const content = pieces[3]
    if (current !== row) {
      // EMIT
      this.push(working)
      working = {}
      current = row
    }
    // accumulate
    try {
      if (key === '') {
        working = content
      } else if (typeof working === 'object') {
        working[key] = JSON.parse(content)
      }
    } catch (e) {
      console.error('Parse error on <%s>', line)
    }
    callback()
  }, function flush (callback) {
    this.push(working)
    callback()
  })
  accumulator._readableState.objectMode = true

  const nester = through2.obj(function nest (record, enc, callback) {
    if (typeof record === 'object') {
      this.push(JSON.stringify(flatnest.nest(record)) + '\n')
    } else {
      this.push(record + '\n')
    }
    callback()
  })

  return splice(accumulator, nester)
}

module.exports = getPipeline
