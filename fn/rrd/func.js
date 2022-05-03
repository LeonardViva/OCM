// @ts-check
// @ts-expect-error
const fdk = require('@fnproject/fdk') // https://github.com/fnproject/fdk-node
const fetch = require('node-fetch')
// @ts-expect-error
const {	forEachSeries } = require('modern-async')

// Globally scope our configuration
let objApplication = {}


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
				// Shape data
				let objPayload = {
					"PushNotificationPdfDocument": {
						// Asset metadata field
						"Identifier": objItem.fields.document_number,
						// Asset name
						"FileName": objItem.name,
						// published asset url
						"FileUrl": objItem.fields.native.links[0].href
					}
				}

				// @ts-expect-error
				// Send request to the functions context item for RRD's endpoint
				let reqPost = await fetch(objContext._config.RRD_endpoint, {
					headers: {
						method: 'POST',
						body: objPayload
					}
				})
				// Response is XML, which fetch doesn't natively support
				let resPost = await reqPost.text()
				objPayload.status = resPost
				// Push to our output array so we can return the response
				arOutput.push(objPayload)
			})
		return {
			arOutput
		}
	})

/**
 * This function uses the function configuration variables to obtain an oAuth token for OCM
 * Unused as of 2022-05-03
 * @returns string
 */
const getToken = async () => {
	// https://rcsocedev-rcsmobile.cec.ocp.oraclecloud.com/documents/web?IdcService=GET_OAUTH_TOKEN
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

/**
 * 
 * @param {object} objInput Object representing the file to upload
 * @param {string} strToken oAuth token for access to OCM Documents
 * @returns Promise<object> Object representing the OCM file
 */
const uploadFile = async (objInput, strToken) => {
	objInput.name += '.json'
	let strBoundary = "7dc7c172076a"
	let strBody = ""
	strBody += `--${strBoundary}\r\n`
	strBody += `Content-Disposition: form-data; name="jsonInputParameters"\r\n`
	strBody += `Content-Type: application/json\r\n\r\n`
	strBody += `{"parentID": "${objApplication.strParentFolderId}"}\r\n`
	strBody += `--${strBoundary}\r\n`
	strBody += `Content-Disposition: form-data; name="primaryFile"; filename="${objInput.name}"\r\n`
	strBody += `Content-Type: text/plain\r\n\r\n`
	strBody += `${JSON.stringify(objInput)}\r\n`
	strBody += `--${strBoundary}--`
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
	let req = await fetch(`${objApplication.host}/documents/api/1.2/files/data`, options)
	let res = await req.json()
	return res
}