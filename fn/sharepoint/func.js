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
    
    objInput = {
      "webhook": {
          "id": 2001,
          "name": "Sharepoint"
      },
      "event": {
          "id": "82f6541e-0a87-47ac-a96d-3d127e3e409d",
          "name": "CHANNEL_ASSETPUBLISHED",
          "registeredAt": "2022-05-23T17:34:00.107Z",
          "initiatedBy": "bcoats@redstonecontentsolutions.com"
      },
      "entity": {
          "id": "RCHANNEL24E15FC9CB894875A3AAA1500C95B3AC",
          "name": "Sharepoint",
          "items": [
              {
                  "translatable": false,
                  "description": "",
                  "language": "en-US",
                  "updatedDate": {
                      "value": "2022-05-23T17:33:54.499Z",
                      "timezone": "UTC"
                  },
                  "type": "File",
                  "createdDate": {
                      "value": "2022-04-18T13:54:57.106Z",
                      "timezone": "UTC"
                  },
                  "fileExtension": "pdf",
                  "name": "Northeast Controls_Knife Gates_From Contracts - (VC000-06789-EN).pdf",
                  "repositoryId": "2A13710F0E3C401DA0DB716A711F88F3",
                  "links": [
                      {
                          "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/items/CONT2C0F3568A29A4B6389DC4851771601F6",
                          "rel": "self",
                          "method": "GET",
                          "mediaType": "application/json"
                      }
                  ],
                  "id": "CONT2C0F3568A29A4B6389DC4851771601F6",
                  "fields": {
                      "metadata": {
                          "width": "-1",
                          "height": "-1"
                      },
                      "size": 99113,
                      "native": {
                          "links": [
                              {
                                  "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONT2C0F3568A29A4B6389DC4851771601F6/native/Northeast+Controls_Knife+Gates_From+Contracts+-+%28VC000-06789-EN%29.pdf",
                                  "rel": "self",
                                  "method": "GET",
                                  "mediaType": "application/pdf"
                              }
                          ]
                      },
                      "renditions": [
                          {
                              "name": "Thumbnail",
                              "formats": [
                                  {
                                      "format": "jpg",
                                      "size": 0,
                                      "mimeType": "image/jpeg",
                                      "metadata": {
                                          "width": "0",
                                          "height": "0"
                                      },
                                      "links": [
                                          {
                                              "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONT2C0F3568A29A4B6389DC4851771601F6/Thumbnail/Northeast+Controls_Knife+Gates_From+Contracts+-+%28VC000-06789-EN%29.pdf?format=jpg&type=responsiveimage",
                                              "rel": "self",
                                              "method": "GET",
                                              "mediaType": "image/jpeg"
                                          }
                                      ]
                                  }
                              ],
                              "type": "responsiveimage"
                          },
                          {
                              "name": "Small",
                              "formats": [
                                  {
                                      "format": "jpg",
                                      "size": 0,
                                      "mimeType": "image/jpeg",
                                      "metadata": {
                                          "width": "0",
                                          "height": "0"
                                      },
                                      "links": [
                                          {
                                              "href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONT2C0F3568A29A4B6389DC4851771601F6/Small/Northeast+Controls_Knife+Gates_From+Contracts+-+%28VC000-06789-EN%29.pdf?format=jpg&type=responsiveimage",
                                              "rel": "self",
                                              "method": "GET",
                                              "mediaType": "image/jpeg"
                                          }
                                      ]
                                  }
                              ],
                              "type": "responsiveimage"
                          }
                      ],
                      "mimeType": "application/pdf",
                      "fileGroup": "Documents",
                      "fileType": "pdf"
                  },
                  "slug": "file-1481786109668-northeast-controls_knife-gates_from-contracts---(vc000-06789-en)"
              }
          ]
      }
    };
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
  
    const getTaxonomyData = async (strToken) => {
      const strUrl = `${objApplication.host}/content/management/api/v1.1/taxonomies/${objApplication.taxonomyRootId}/categories`;
      //set basic 'form' headers
      let options = {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${strToken}`
        }
      }
      // @ts-expect-error
      
      let req = await fetch(strUrl, options)
      let res = await req.json()
      return res
    }
    const shapeTaxonomyData = (id, arNodes) => {
      let arToReturn = arNodes.filter(n => n.parentId === id);
      arToReturn.map(child => {
          child.children = shapeTaxonomyData(child.id, arNodes)
          return child;
      })
      return arToReturn;
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
    const strToken = await getToken();
    let objFullTaxonomy = await getTaxonomyData(strToken);
    objFullTaxonomy = shapeTaxonomyData(objApplication.taxonomyRootId, objFullTaxonomy.items);
    // Get the items from the publish to loop over
		let arPublishedItems = objInput.entity.items
    // Iterate over each of the items that has been published and then attach it's taxonomy to it
    await forEachSeries(arPublishedItems, async (objItem) => {
      const objAssetTaxonomy = await getTaxonomyForAsset(objItem, strToken);
      if (objAssetTaxonomy && objAssetTaxonomy.data && objAssetTaxonomy.data[0]) {
        const objColumns = {};
        objAssetTaxonomy.data[0].categories.forEach(category => {
          const strParentId = objFullTaxonomy.filter(n => category.id === n.id).parentId;
          // Check if the parent/column exists
          if (objColumns[strParentId]) {
            objColumns[strParentId].push(category)
          } else {
            objColumns[strParentId] = [category];
          }
        });
        objItem.columns = objColumns;
      }
      arOutput.push(objItem);
    });
    // Return the content with the taxonomy added 
		return {
			arOutput
		}
})
// Early Sharepoint connection investigation
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
