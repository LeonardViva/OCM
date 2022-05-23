const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node
const fs = require('fs');
const fetch = require('node-fetch');
const {	forEachSeries } = require('modern-async')


fdk.handle(
	/**
	 * Function Handler
	 * @param {object} objInput JSON request payload
	 * @param {object} objContext Function Context
	 * @returns Promise<object> Object containing an array of the POST status responses
	 */
	async (objInput, objContext) => {
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
    const getFullTaxonomy = async (strToken) => {
      //set basic 'form' headers
      let options = {
        method: 'POST',
        body: strBody,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${strBoundary}`,
          charset: 'utf-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${strToken}`
        }
      }
      // @ts-expect-error
      
      let req = await fetch(`${objApplication.host}/content/management/api/v1.1/taxonomies/${objApplication.taxonomyRootId}/categories`, options)
      let res = await req.json()
      return res
    }
    const getTaxonomyForAsset = async (objInput, strToken) => {
      //set basic 'form' headers
      let options = {
        method: 'POST',
        body: strBody,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${strBoundary}`,
          charset: 'utf-8',
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
    const objFullTaxonomy = await getFullTaxonomy(strToken);
		let arPublishedItems = objInput.entity.items
    // Iterate over each of the items that has been published
    await forEachSeries(arPublishedItems, async (objItem) => {
      const objAssetTaxonomy = await getTaxonomyForAsset(objItem, strToken);
      arOutput.push(objAssetTaxonomy);
    });
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
