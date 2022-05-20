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
		let arOutput = []
		objApplication = {
			"clientID": objContext._config.clientID,
			"clientSecret": objContext._config.clientSecret,
			"scope": objContext._config.scope,
			"idcs": objContext._config.idcs,
			"idcsURL": `https://${objContext._config.idcs}.identity.oraclecloud.com`,
			"host": objContext._config.ocmHost
		}


		let arItems = objInput.entity.items
		await forEachSeries(arItems,
			/**
			 * Post to RRD
			 * @param {object} objItem OCM document that has been published
			 */
			async (objItem) => {
				let strPrefix = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/"><soap:Header/><soap:Body><tem:PostFile><tem:jsonString>`
				let strSuffix = `</tem:jsonString></tem:PostFile></soap:Body></soap:Envelope>`
				// Shape data
				let objPayload = {
					"PushNotificationPdfDocument": {
						// Asset metadata field
						"Identifier": objItem.fields.document_number,
						// Asset name
						"FileName": objItem.name,
						// Published asset url
						"FileUrl": objItem.fields.native.links[0].href
					}
				}
				objPayload = replaceAll('"', '&quot;', JSON.stringify(objPayload))
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