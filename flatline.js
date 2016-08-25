'use strict'

const through2 = require('through2')
const flatnest = require('flatnest')
const splice = require('stream-splice')

function getPipeline () {
  var row = 0

  const parser = through2(function parse (line, enc, callback) {
    line = line.toString()
    if (line) {
      try {
        const obj = JSON.parse(line)
        if (obj !== undefined) {
          this.push(obj)
        }
      } catch (e) {
        console.error('JSON parse error on line [%s]', row)
      }
    }
    callback()
  })
  parser._readableState.objectMode = true

  const flattener = through2.obj(function flatten (record, enc, callback) {
    const flat = flatnest.flatten(record)
    const keys = Object.keys(flat)
    for (var i = 0; i < keys.length; i++) {
      const line = `[${row}].${keys[i]}: ${JSON.stringify(flat[keys[i]])}\n`
      this.push(line)
    }
    row++
    callback()
  })
  flattener.on('error', (err) => {
    console.error('object flatten error on line %s', row)
    console.error(err)
    row++
  })

  return splice(parser, flattener)
}

module.exports = getPipeline
