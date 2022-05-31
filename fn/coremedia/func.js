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
		if (typeof objInput.entity == 'undefined') {
			objInput = {
				"webhook": {
					"id": 2001,
					"name": "Sharepoint"
				},
				"event": {
					"id": "4d9edbed-be35-4fcf-b20a-910093e2a628",
					"name": "CHANNEL_ASSETPUBLISHED",
					"registeredAt": "2022-05-23T22:27:05.646Z",
					"initiatedBy": "bcoats@redstonecontentsolutions.com"
				},
				"entity": {
					"id": "RCHANNEL24E15FC9CB894875A3AAA1500C95B3AC",
					"name": "Sharepoint",
					"items": [{
						"translatable": false,
						"description": "",
						"language": "en-US",
						"updatedDate": {
							"value": "2022-05-23T22:27:01.449Z",
							"timezone": "UTC"
						},
						"type": "File",
						"createdDate": {
							"value": "2022-04-18T13:54:57.726Z",
							"timezone": "UTC"
						},
						"fileExtension": "pdf",
						"name": "Northeast Controls_QT BFV & BV_From Contracts - (VC000-06793-EN).pdf",
						"repositoryId": "2A13710F0E3C401DA0DB716A711F88F3",
						"links": [{
							"href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/items/CONTA3866F34FEB3421F9877FABE836C1FDF",
							"rel": "self",
							"method": "GET",
							"mediaType": "application/json"
						}],
						"id": "CONTA3866F34FEB3421F9877FABE836C1FDF",
						"fields": {
							"metadata": {
								"width": "-1",
								"height": "-1"
							},
							"size": 101221,
							"native": {
								"links": [{
									"href": "https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/content/management/api/v1.1/assets/CONTA3866F34FEB3421F9877FABE836C1FDF/native/Northeast+Controls_QT+BFV+%26amp%3B+BV_From+Contracts+-+%28VC000-06793-EN%29.pdf",
									"rel": "self",
									"method": "GET",
									"mediaType": "application/pdf"
								}]
							},
							"mimeType": "application/pdf",
							"fileGroup": "Documents",
							"fileType": "pdf"
						},
						"slug": "file-1481786109679-northeast-controls_qt-bfv--amp--bv_from-contracts---(vc000-06793-en)"
					}]
				}
			}
		}

		objApplication = {
			"clientID": objContext._config.clientID,
			"clientSecret": objContext._config.clientSecret,
			"scope": objContext._config.scope,
			"idcs": objContext._config.idcs,
			"idcsURL": `https://${objContext._config.idcs}.identity.oraclecloud.com`,
			"host": objContext._config.ocmHost
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
		objApplication.token = await getToken()

		const getTaxonomyForAsset = async (objAsset) => {
			// @ts-expect-error
			let req = await fetch(`${objApplication.host}/content/management/api/v1.1/items/${objAsset.id}/taxonomies`, {
				method: 'GET',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Authorization': `Bearer ${objApplication.token}`
				}
			})
			let objCategories = await req.json()
			return objCategories
		}

		const arItems = objInput.entity.items
		await forEachSeries(arItems,
			/***
			 * Attach taxonomy to each published item
			 * @param {object} objItem OCM document that has been published
			 */
			async (objItem) => {
				const objAssetTaxonomy = await getTaxonomyForAsset(objItem)
				objItem.taxonomy = objAssetTaxonomy.data
			}
		)
 		// Uncomment to send a post request with the contents of the webhook and attached taxonomy/categories
		let buffCredentials = Buffer.from(`${objContext._config.microAppUsername}:${objContext._config.microAppPassword}`)
 		// @ts-expect-error
		const reqMicroApp = await fetch(objContext._config.microAppUrl, {
			method: 'POST',
			body: JSON.stringify(objInput),
			headers: {
				'Authorization': `Basic ${buffCredentials.toString('base64')}`,
				'Content-Type': 'application/json'
			}
		}) 
		const resMicroApp = await reqMicroApp.json()
		return {creds: buffCredentials.toString('base64'), objInput, resMicroApp}
	}
)