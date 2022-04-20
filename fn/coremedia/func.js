const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node

const translateLanguageCode = function(strLanguageCode) {
  // what are all of there Language codes?
  const dicLanguageList = {
    'en-US': {language_code: 'L000003', iso_code: 'en-gb'}
  }
  return dicLanguageList[strLanguageCode];
}

fdk.handle(function(oceData, ctx){
  console.log('oceData', oceData);
  console.log('ctx', ctx);
  // get only the published item/items
  const datePublishedTime = oceData.event.registeredAt;
  const arPublishedItems = oceData.entity.items;
  let objCoreMediaData = {}

  arPublishedItems.map(publishedItem => {
    objCoremediaData = {
      PushNotificationPdfDocument: {
        "Countries": [],
        "Categories": [],
        "TaxonomyList": [],
        "Entry": [],
        // Need to fill out bdog
        "Attributes": null,
        // Need to fill out bdog
        "StringDefinitions": [
          // These are the three string definitions we know about. What other string definition ids are defined?
          {
              // SD000018 = ManufacturePartNumber
              "DefinitionId": "SD000018",
              "Name": "ManufacturePartNumber",
              "Value": publishedItem.fields.product_code// Maps to Coremedia's product
          },
          {
              // SD000020 is the id for ExportDocumentType
              // Manuals is one valid value, what are the others?
              "DefinitionId": "SD000020",
              "Name": "ExportDocumentType",
              "Value": publishedItem.fields.document_type // emerson.com document section; RCS - document_type
          },
          {
              // SD000036 is the id for NumberOfPages
              "DefinitionId": "SD000036",
              "Name": "NumberOfPages",
              "Value": publishedItem.fields.page_count
          }           
        ],
        "DocumentType": null,// Replace with the correct Doc type when marvin gives updates
        "Products": publishedItem.fields.products,
        "SEO": {
          "Title": publishedItem.fields.document_title, // RCS - document_title
          "Keywords": publishedItem.fields.seo_metadata, // RCS - seo_metadata
          "Description": publishedItem.description // RCS - OCM Document Description
        },
        "Title": publishedItem.fields.document_title, // RCS - document_title
        "Brand": publishedItem.fields.brand_code, // RCS - asset field (dropdown)
        // OCM published URL // this is the native resolution, not sure if pdfs have a different structure
        "FileUrl": publishedItem.links[0].href,
        "FileType": null, // RCS - guessing FT00001 is a PDF. No mapping available in the spreadsheet
        // for now just passing the oce date
        "FileTimeStamp": publishedItem.createdDate.value, // created date/time. question about OG creation date (new document_date field) or just pass the OCM creation date
        "FileMD5Hash": null, // RCS - always null
        // What is this? How does it relate to each product? HArd coded for now BDOG
        "McmId": null, 
        // ISO code en-gb is language code L000003, but so is every other language
        // Where do the MCM language ids apply?
        "iso_code": translateLanguageCode(publishedItem.language).iso_code,
        "LanguageCode": translateLanguageCode(publishedItem.language).language_code, // RCS - OCM language code (conversion)
        // What is this? How does it relate to the json file? Hard coded for now BDOG
        "TriggerEvent": "EV000001", // required
        // UPDATE, what other actions are possible? For now set to update always
        "Action": "UPDATE", // required
        // Action timestamp
        "TimeStamp": datePublishedTime,
      }
    }
  }); 
  console.log('\nInside Node shaping function')
  return objCoreMediaData;
})