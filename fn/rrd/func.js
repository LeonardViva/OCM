// @ts-check
// @ts-expect-error
const fdk = require('@fnproject/fdk') // https://github.com/fnproject/fdk-node
const fetch = require('node-fetch')
// @ts-expect-error
const {	forEachSeries } = require('modern-async')

// Globally scope our configuration
let objApplication = {}

const replaceAll = (replaceThis, withThis, inThis) => {
    withThis = withThis.replace(/\$/g,"$$$$");
    return inThis.replace(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g,"\\$&"),"g"), withThis);
};

fdk.handle(
	/**
	 * Function Handler
	 * @param {object} objInput JSON request payload
	 * @param {object} objContext Function Context
	 * @returns Promise<object> Object containing an array of the POST status responses
	 */
	async (objInput, objContext) => {
		if (objContext._headers['Fn-Http-H-Token'] != objContext._config.token) {
			return {status: 'Unauthorized. Invalid Token'}
		  }
		// Be ready to return some data
		let arOutput = []

		// Prep the application context variables
		objApplication = {
			"clientID": objContext._config.clientID,
			"clientSecret": objContext._config.clientSecret,
			"scope": objContext._config.scope,
			"idcs": objContext._config.idcs,
			"idcsURL": `https://${objContext._config.idcs}.identity.oraclecloud.com`,
			"host": objContext._config.ocmHost,
			"channelToken": objContext._config.channelToken
		}


		let arItems = objInput.entity.items
		await forEachSeries(arItems,
			/**
			 * Post to RRD
			 * @param {object} objItem OCM document that has been published
			 */
			async (objItem) => {
				// SOAP prefix/suffix around the payload data
				let strPrefix = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/"><soap:Header/><soap:Body><tem:PostFile><tem:jsonString>`
				let strSuffix = `</tem:jsonString></tem:PostFile></soap:Body></soap:Envelope>`
				
				//Generate Unique ID
				const uniqueId = () => {
					const str = objItem.id;			
					return objItem.type+"-"+str.substring(str.length -7 , str.length - 1)
				};
				

				//Micro App Methods
				// Uncomment to send a post request with the contents of the webhook and attached taxonomy/categories
				let buffCredentials = Buffer.from(`${objContext._config.microAppUsername}:${objContext._config.microAppPassword}`)
					// @ts-expect-error
					const reqMicroApp_GET = await fetch(objContext._config.microAppUrl, {
						method: 'GET',
						headers: {
							'Authorization': `Basic ${buffCredentials.toString('base64')}`,
							'Content-Type': 'application/json'
						}
					})

				const resMicroApp_GET = await reqMicroApp_GET.json()

				let index = resMicroApp_GET.findIndex(x => x.identifier === uniqueId());
					
				if(index != -1){	
					//MicroApp Payload
					let objMicroAppPayload = {
							"id":resMicroApp_GET[index].id,
							// Asset metadata field
							"Identifier": uniqueId(),
							// Asset name
							"FileName": objItem.name,
							// Published asset url
							"FileUrl": objItem.fields.native.links[0].href
					}
					// @ts-expect-error
					const reqMicroApp = await fetch(objContext._config.microAppUrl+"/"+resMicroApp_GET[index].id, {
						method: 'PUT',
						body: JSON.stringify(objMicroAppPayload),
						headers: {
							'Authorization': `Basic ${buffCredentials.toString('base64')}`,
								'Content-Type': 'application/json'
						}
					})
				}else if(index == -1){
					//MicroApp Payload
					let objMicroAppPayloadPost = {
							// Asset metadata field
							"Identifier": uniqueId(),
							// Asset name
							"FileName": objItem.name,
							// Published asset url
							"FileUrl": objItem.fields.native.links[0].href
					}
					// @ts-expect-error
					const reqMicroApp = await fetch(objContext._config.microAppUrl, {
						method: 'POST',
						body: JSON.stringify(objMicroAppPayloadPost),
						headers: {
							'Authorization': `Basic ${buffCredentials.toString('base64')}`,
								'Content-Type': 'application/json'
						}
					})
				}


				// Shape data for RRD
				let objPayload = {
					"PushNotificationPdfDocument": {
						// Asset metadata field
						"Identifier": objItem.fields.document_number,
						// Asset name
						"FileName": objItem.name,
						// Published asset url
						"FileUrl": `${objItem.fields.native.links[0].href.replace('/content/management/api', '/content/published/api')}?channelToken=${objApplication.channelToken}`
					}
				}
				objPayload = replaceAll('"', '&quot;', JSON.stringify(objPayload))
				// Build our body
				let body = `${strPrefix}${objPayload}${strSuffix}`
				// @ts-expect-error
				// Send request to the functions context item for RRD's endpoint
				let reqPost = await fetch(objContext._config.RRD_endpoint, {
					method: 'post',
					headers: {
						'Content-Type': 'application/soap+xml;charset=UTF-8;action="http://tempuri.org/PostFile"',
					},
					body: body
				})
				// Response is XML, which fetch doesn't natively support
				let resPost = await reqPost.text()
				let status = reqPost.status
				if (reqPost.status == 200 && resPost.indexOf('<PostFileResult>&lt;Response&gt;OK&lt;/Response&gt;</PostFileResult>') > 0) {
					status = 'success'
				}
				arOutput.push({resPost, status})
			})
		return {arOutput}
		
	})