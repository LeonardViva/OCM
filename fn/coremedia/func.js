const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node

const translateLanguageCode = function(strLanguageCode) {
  // what are all of there Language codes?
  const dicLanguageList = {
    'en-US': {LanguageCode: 'L000003', }
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
      LanguageCode: translateLanguageCode(publishedItem.language),
      Products: publishedItem.Products,
      PushNotificationPdfDocument: {
        // "Countries": [],
        // "Categories": [],
        Attributes: [
            {
                // "AttributeId": "PA000057",
                Values: [
                    {
                        // "DefaultValue": "D103246X014",
                        // "McmId": "TV011134",
                        Translations: [
                            {
                                LanguageId: "L000000", // required 
                                // "Value": "D103246X014",
                                // "McmId": "TV011134"
                            }
                        ]
                    }
                ]
            }
        ],
        StringDefinitions: [
            {
                // "DefinitionId": "SD000018",
                // "Name": "ManufacturePartNumber",
                Value: "MR105" // required for coremedia product relation
            },
            {
                // "DefinitionId": "SD000020",
                // "Name": "ExportDocumentType",
                Value: "Manuals" // required for coremedia document type; OCM asset type
            }
        ],
        Products: [
            "P001504"
        ],
        // "TaxonomyList": [],
        // "Entry": [],
        "SEO": {
            "Title": "Manuals: MR105 Installation Guide, Fisher, Regulators (VCIGD-14505-EN)", // required
            "Keywords": [
                "MR105 Installation Guide" // required
            ],
            "Description": "MR105 Installation Guide"
        },
        "Identifier": "VCIGD-14505-EN", // optional for reference
        "FileName": "VCIGD-14505-EN.pdf", // optional for reference
        "Title": "Manuals: MR105 Installation Guide, Fisher", // required
        "LanguageCode": "L000003", // required
        "Brand": "B4634086", // required for storing in specific folder in coremedia
        "FileUrl": "https://topcat.mcm-plus.com/Files/History/VCIGD-14505-EN.pdf?id=320674&hash=bcac2c205ee8c44dc93c1988afa472e03da2a41d&uid=4729681", // required
        "FileType": "FT000001",
        "FileTimeStamp": "2022-02-08T14:36:39.000",
        "FileMD5Hash": null,
        "DocumentType": "DT000042", // required
        "McmId": "DV4857004", 
        "IsoCode": "en-gb", // required
        "TriggerEvent": "EV000001", // required
        "TimeStamp": "2022-02-09T11:40:20.949",
        "Action": "UPDATE" // required
      }
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

// "PushNotificationPdfDocument": {
//   "Attributes": [
//       {
//           "AttributeId": "PA000057",
//           "Values": [
//               {
//                   "DefaultValue": "D103246X014",
//                   "McmId": "TV011134",
//                   "Translations": [
//                       {
//                           "LanguageId": "L000000", // required 
//                           "Value": "D103246X014",
//                           "McmId": "TV011134"
//                       }
//                   ]
//               }
//           ]
//       }
//   ],
//   "StringDefinitions": [
//       {
//           "DefinitionId": "SD000018",
//           "Name": "ManufacturePartNumber",
//           "Value": "MR105" // required for coremedia product relation
//       },
//       {
//           "DefinitionId": "SD000020",
//           "Name": "ExportDocumentType",
//           "Value": "Manuals" // required for coremedia document type; OCM asset type
//       }
//   ],
//   "Products": [
//       "P001504"
//   ],
//   "TaxonomyList": [],
//   "Entry": [],
//   "SEO": {
//       "Title": "Manuals: MR105 Installation Guide, Fisher, Regulators (VCIGD-14505-EN)", // required
//       "Keywords": [
//           "MR105 Installation Guide" // required
//       ],
//       "Description": "MR105 Installation Guide"
//   },
//   "Identifier": "VCIGD-14505-EN", // optional for reference
//   "FileName": "VCIGD-14505-EN.pdf", // optional for reference
//   "Title": "Manuals: MR105 Installation Guide, Fisher", // required
//   "LanguageCode": "L000003", // required
//   "Brand": "B4634086", // required for storing in specific folder in coremedia
//   "FileUrl": "https://topcat.mcm-plus.com/Files/History/VCIGD-14505-EN.pdf?id=320674&hash=bcac2c205ee8c44dc93c1988afa472e03da2a41d&uid=4729681", // required
//   "FileType": "FT000001",
//   "FileTimeStamp": "2022-02-08T14:36:39.000",
//   "FileMD5Hash": null,
//   "DocumentType": "DT000042", // required
//   "McmId": "DV4857004", 
//   "IsoCode": "en-gb", // required
//   "TriggerEvent": "EV000001", // required
//   "TimeStamp": "2022-02-09T11:40:20.949",
//   "Action": "UPDATE" // required
// }