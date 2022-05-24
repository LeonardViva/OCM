const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node
const fs = require('fs');
// @ts-expect-error
const fetch = require('node-fetch');
// @ts-expect-error
const {	forEachSeries } = require('modern-async')


fdk.handle(
	/**
	 * Function Handler
	 * @param {object} objInput JSON request payload
	 * @param {object} objContext Function Context
	 * @returns Promise<object> Object containing an array of the POST status responses
	 */
	async (objInput, objContext) => {
    
    // Test Data, Uncomment and run deploy and invoke to get output 
    // objInput = {
    //         "webhook": {
    //             "id": 2001,
    //             "name": "Sharepoint"
    //         },
    //         "event": {
    //             "id": "4d9edbed-be35-4fcf-b20a-910093e2a628",
    //             "name": "CHANNEL_ASSETPUBLISHED",
    //             "registeredAt": "2022-05-23T22:27:05.646Z",
    //             "initiatedBy": "bcoats@redstonecontentsolutions.com"
    //         },
    //         "entity": {
    //             "id": "RCHANNEL24E15FC9CB894875A3AAA1500C95B3AC",
    //             "name": "Sharepoint",
    //             "items": [
    //                 {
    //                     "translatable": false,
    //                     "description": "",
    //                     "language": "en-US",
    //                     "updatedDate": {
    //                         "value": "2022-05-23T22:27:01.449Z",
    //                         "timezone": "UTC"
    //                     },
    //                     "type": "File",
    //                     "createdDate": {
    //                         "value": "2022-04-18T13:54:57.726Z",
    //                         "timezone": "UTC"
    //                     },
    //                     "fileExtension": "pdf",
    //                     "name": "Northeast Controls_QT BFV & BV_From Contracts - (VC000-06793-EN).pdf",
    //                     "repositoryId": "2A13710F0E3C401DA0DB716A711F88F3",
    //                     "links": [
    //                         {
    //                             "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/items/CONTA3866F34FEB3421F9877FABE836C1FDF",
    //                             "rel": "self",
    //                             "method": "GET",
    //                             "mediaType": "application/json"
    //                         }
    //                     ],
    //                     "id": "CONTA3866F34FEB3421F9877FABE836C1FDF",
    //                     "fields": {
    //                         "metadata": {
    //                             "width": "-1",
    //                             "height": "-1"
    //                         },
    //                         "size": 101221,
    //                         "native": {
    //                             "links": [
    //                                 {
    //                                     "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONTA3866F34FEB3421F9877FABE836C1FDF/native/Northeast+Controls_QT+BFV+%26amp%3B+BV_From+Contracts+-+%28VC000-06793-EN%29.pdf",
    //                                     "rel": "self",
    //                                     "method": "GET",
    //                                     "mediaType": "application/pdf"
    //                                 }
    //                             ]
    //                         },
    //                         "renditions": [
    //                             {
    //                                 "name": "Thumbnail",
    //                                 "formats": [
    //                                     {
    //                                         "format": "jpg",
    //                                         "size": 0,
    //                                         "mimeType": "image/jpeg",
    //                                         "metadata": {
    //                                             "width": "0",
    //                                             "height": "0"
    //                                         },
    //                                         "links": [
    //                                             {
    //                                                 "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONTA3866F34FEB3421F9877FABE836C1FDF/Thumbnail/Northeast+Controls_QT+BFV+%26amp%3B+BV_From+Contracts+-+%28VC000-06793-EN%29.pdf?format=jpg&type=responsiveimage",
    //                                                 "rel": "self",
    //                                                 "method": "GET",
    //                                                 "mediaType": "image/jpeg"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ],
    //                                 "type": "responsiveimage"
    //                             },
    //                             {
    //                                 "name": "Small",
    //                                 "formats": [
    //                                     {
    //                                         "format": "jpg",
    //                                         "size": 0,
    //                                         "mimeType": "image/jpeg",
    //                                         "metadata": {
    //                                             "width": "0",
    //                                             "height": "0"
    //                                         },
    //                                         "links": [
    //                                             {
    //                                                 "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONTA3866F34FEB3421F9877FABE836C1FDF/Small/Northeast+Controls_QT+BFV+%26amp%3B+BV_From+Contracts+-+%28VC000-06793-EN%29.pdf?format=jpg&type=responsiveimage",
    //                                                 "rel": "self",
    //                                                 "method": "GET",
    //                                                 "mediaType": "image/jpeg"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ],
    //                                 "type": "responsiveimage"
    //                             }
    //                         ],
    //                         "mimeType": "application/pdf",
    //                         "fileGroup": "Documents",
    //                         "fileType": "pdf"
    //                     },
    //                     "slug": "file-1481786109679-northeast-controls_qt-bfv--amp--bv_from-contracts---(vc000-06793-en)"
    //                 }
    //             ]
    //         }
    //     };
		let arOutput = []
		const objApplication = {
			"clientID": objContext._config.clientID,
			"clientSecret": objContext._config.clientSecret,
			"scope": objContext._config.scope,
			"idcs": objContext._config.idcs,
			"idcsURL": `https://${objContext._config.idcs}.identity.oraclecloud.com`,
			"host": objContext._config.ocmHost,
      "taxonomyRootId": objContext._config.taxonomyRootId,
      // Emerson Automation Solutions (EMR): A3EC1D2F978646A9A7C5EFD003B5535C
		}
    const getToken = async () => {
      let strCredentialsEncoded = Buffer.from(`${objApplication.clientID}:${objApplication.clientSecret}`).toString('base64')
      let params = new URLSearchParams()
      params.append('grant_type', 'client_credentials')
      params.append('scope', objApplication.scope)
      let options = {
        method: 'post',
        headers: {
          'Authorization': `Basic ${strCredentialsEncoded}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      }
      // @ts-expect-error
      let reqToken = await fetch(`${objApplication.idcsURL}/oauth2/v1/token`, options)
      let resToken = await reqToken.json()
      return resToken.access_token
    }
    const getTaxonomyForAsset = async (objInput, strToken) => {
      //set basic 'form' headers
      let options = {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${strToken}`
        }
      }
      // @ts-expect-error
      
      let req = await fetch(`${objApplication.host}/content/management/api/v1.1/items/${objInput.id}/taxonomies`, options)
      let res = await req.json()
      return res
    }
    const getCategoryPath = async (strCategoryId, strToken) => {
      //set basic 'form' headers
      let options = {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${strToken}`
        }
      }
      // @ts-expect-error
      // Retrieve the categories path, this is the structure of the taxonomy
      // /content/management/api/v1.1/taxonomies/A3EC1D2F978646A9A7C5EFD003B5535C/categories/346E4123282B445E9A980DC8DFD2B976?q=(status%20eq%20%22draft%22)&fields=idPath,namePath
      let req = await fetch(`${objApplication.host}/content/management/api/v1.1/taxonomies/${objApplication.taxonomyRootId}/categories/${strCategoryId}?fields=idPath,namePath`, options)
      let res = await req.json()
      // /Distribution/Location/World Area/Asia/Hong Kong
      // Break up the returned request to pull off the path information
      let arPathPieces = res.namePath.split('/');
      arPathPieces = [arPathPieces[1], arPathPieces.slice(2).join('/')];
      return arPathPieces;
    }
    
    const strToken = await getToken();
    // Get the items from the publish to loop over
		let arPublishedItems = objInput.entity.items
    let objColumns = {};
    // Iterate over each of the items that has been published and then attach it's taxonomy to it
    await forEachSeries(arPublishedItems, async (objItem) => {
      const objAssetTaxonomy = await getTaxonomyForAsset(objItem, strToken);
      try {
        // Iterate over each of found categories and apply their column data
        await forEachSeries(objAssetTaxonomy.data[0].categories, async (category) => {
          const arPathPieces = await getCategoryPath(category.id, strToken);
          const strColumnName = arPathPieces[0];
          const strColumnData = arPathPieces[1];
          // Sort the column data into a dictionary
          if (objColumns[strColumnName]) {
            objColumns[strColumnName].push(strColumnData);
          } else {
            objColumns[strColumnName] = [strColumnData];
          }
        });
      } catch (e) {
        console.error('Unable to retrieve taxonomy Shape:', e);
      }
      // Apply Column data
      objItem.columns = objColumns;
      arOutput.push(objItem);
    });
    // Return the content with the taxonomy added 
		return {
			arOutput
		}
})
// Early Sharepoint connection investigation
// https://github.com/Ramakrishnan-1/Upload-Files-to-Document-Library-using-SharePoint-RESTAPI/blob/main/UploadDoc.js
// const strSharepointUrl = '';
// fdk.handle(
//   async (objInput, objContext) => {
//   // Is this supposed to be the emerson sharepoint as tenant? Maybe just common?
//   // https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
//   // const objSharepointApp = {
//   //   client_id: 'replace me with clientid',
//   //   client_secret: '',
//   //   response_type:'code',
//   //   redirect_uri: '',
//   //   response_mode: 'query',
//   //   scope:"",
//   //   grant_type: 'authorization_code',
//   //   state: '',
//   // };
//   // const getSharepointToken = async () => {
//   //   // const objTenent 
//   //   let params = new URLSearchParams()
//   //   let options = {
//   //     method: 'post',
//   //     headers: {
//   //       'Content-Type': 'application/x-www-form-urlencoded'
//   //     },
//   //     body: params
//   //   }
//   //   // @ts-expect-error
//   //   let reqToken = await fetch(`https://login.microsoftonline.com/${objTenent}/oauth2/v2.0/authorize?`, options)
//   //   let resToken = await reqToken.json()
//   //   return resToken.access_token
//   // }

//   // const postUploadFile = async () => {
//   //     let params = new URLSearchParams()
//   //     const strFilePostUrl = `https://${strSharepointUrl}/_api/web/GetFolderByServerRelativeUrl('/Folder Name')/Files/add(url='a.txt',overwrite=true)`
//   //     let options = {
//   //       method: 'post',
//   //       headers: {
//   //         'Authorization': "Bearer " + accessToken,
//   //         'Content-Length': 'Grab from the header',
//   //         'X-RequestDigest': "{form_digest_value}",
//   //         'Content-Type': 'application/x-www-form-urlencoded',
//   //       },
//   //       // body: params
//   //     }
//   //     // @ts-expect-error
//   //     let reqToken = await fetch(strFilePostUrl, options)
//   //     let resToken = await reqToken.json()
//   //     return resToken.access_token
//   //   }
  

  
//   let output = fs.readdirSync(input.folder)
//   return {
//     output
//   }
// })
