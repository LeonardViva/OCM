const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node

const translateLangauageCode = function(strLanguageCode) {
  // what are all of there langauge codes?
  const dicLanguageList = {
    'en-US': 'L000003'
  }
  return dicLanguageList[strLanguageCode];
}

fdk.handle(function(oceData, ctx){
  console.log('oceData', oceData);
  console.log('ctx', ctx);
  // get only the published item/items
  const arPublishedItems = oceData.entity.items;
  let objCoreMediaData = {}

  arPublishedItems.map(publishedItem => {
    objCoremediaData = {
      // Title: publishedItem., Where should this come from
      FileName: publishedItem.name, 
      LanguageCode: translateLangauageCode(publishedItem.language),
      Products: publishedItem.Products,
    }
  }); 
  console.log('\nInside Node shaping function')
  return objCoreMediaData;
})

// OCE Fields:
// "name": "f220118_sm_toyfinder_nonholiday_mob_nav.jpg",
// "repositoryId": "810903DB893B4C3DA6D885534D6BF73B",
// "description": "",
// "language": "en-US",


// EMERSON FIELDS

// "Identifier": "VCIGD-14505-EN",
// "FileName": "VCIGD-14505-EN.pdf",
// "Title": "Manuals: MR105 Installation Guide, Fisher",
// "LanguageCode": "L000003",
// "Brand": "B4634086",
// "FileUrl": "https://topcat.mcm-plus.com/Files/History/VCIGD-14505-EN.pdf?id=320674&hash=bcac2c205ee8c44dc93c1988afa472e03da2a41d&uid=4729681",
// "FileType": "FT000001",
// "FileTimeStamp": "2022-02-08T14:36:39.000",
// "FileMD5Hash": null,
// "DocumentType": "DT000042",
// "McmId": "DV4857004",
// "IsoCode": "en-gb",
// "TriggerEvent": "EV000001",
// "TimeStamp": "2022-02-09T11:40:20.949",
// "Action": "UPDATE"