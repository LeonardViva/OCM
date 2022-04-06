const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node
const fs = require('fs')

fdk.handle(function (input, ctx) {
  let output = fs.readdirSync(input.folder)
  return {
    output
  }
})
