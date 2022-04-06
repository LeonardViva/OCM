const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node

fdk.handle(function (input, ctx) {
  let name = 'Sharepoint';
  if (input.name) {
    name = input.name;
  }
  console.log('\nInside Node Hello World function')
  return {
    'message': 'Hello ' + name
  }
})
