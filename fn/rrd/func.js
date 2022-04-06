const fdk = require('@fnproject/fdk'); // https://github.com/fnproject/fdk-node
const fs = require('fs')
const fetch = require('node-fetch');

let strProgress
let objApplication



const getToken = async () => {
	// https://rcsocedev-rcsmobile.cec.ocp.oraclecloud.com/documents/web?IdcService=GET_OAUTH_TOKEN
	strProgress = '19'
	let strCredentialsEncoded = Buffer.from(`${objApplication.clientID}:${objApplication.clientSecret}`).toString('base64')
	strProgress = '21'
	let params = new URLSearchParams()
	params.append('grant_type', 'client_credentials')
	// params.append('scope', 'urn:opc:idm:__myscopes__')
	params.append('scope', objApplication.scope)
	let options = {
		method: 'post',
		headers: {
			'Authorization': `Basic ${strCredentialsEncoded}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params
	}
	strProgress = `26 - ${objApplication.idcsURL}/oauth2/v1/token - ${strCredentialsEncoded}`
	let reqToken = await fetch(`${objApplication.idcsURL}/oauth2/v1/token`, options)
	strProgress = '28'
	let resToken = await reqToken.json()
	strProgress = `30 - ${JSON.stringify(resToken)}`
	return resToken.access_token
}




const uploadFile = async (objInput, objRRD, strToken) => {
	objInput.name += '.json'

	strProgress = 'inside uploadFile()'
	let strBoundary = "7dc7c172076a"
	strProgress = 'build body'
	let strBody = ""
	strBody += `--${strBoundary}\r\n`
	strBody += `Content-Disposition: form-data; name="jsonInputParameters"\r\n`
	strBody += `Content-Type: application/json\r\n\r\n`
	strBody += `{"parentID": "${objApplication.strParentFolderId}"}\r\n`
	strBody += `--${strBoundary}\r\n`
	strBody += `Content-Disposition: form-data; name="primaryFile"; filename="${objInput.filename}"\r\n`
	strBody += `Content-Type: text/plain\r\n\r\n`
	strBody += `${JSON.stringify(objInput)}\r\n`
	strBody += `--${strBoundary}--`
	//set basic 'form' headers
	strProgress = `build options - ${strToken}`
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
	strProgress = `71 - ${JSON.stringify(options)}`
	// throw new Error(JSON.stringify(options))
	let f = await fetch(`${objApplication.host}/documents/api/1.2/files/data`, options)
	let res = await f.text()
	strProgress = `75 - ${JSON.stringify(res)}`
	return res
}

fdk.handle(async function (objInput, objContext) {
	// TODO loop through objInput.items, perform shaping and upload per item
	try {
		strProgress = 'test'
		objApplication = JSON.parse(fs.readFileSync('./app-configuration.json', 'utf-8'))
		strProgress = `found objapplication - ${JSON.stringify(objApplication)}`
		const objRRD = {
			"PushNotificationPdfDocument": {
				"Countries": [],
				"Categories": [],
				"Attributes": [{
						"AttributeId": "PA000101",
						"Values": [{
							"DefaultValue": "PRM - Pressure Management",
							"McmId": "TV012367",
							"Translations": [{
								"LanguageId": "L000000",
								"Value": "PRM - Pressure Management",
								"McmId": "TV012367"
							}]
						}]
					},
					{
						"AttributeId": "PA000057",
						"Values": [{
							"DefaultValue": "D103234X012",
							"McmId": "TV004123",
							"Translations": [{
								"LanguageId": "L000000",
								"Value": "D103234X012",
								"McmId": "TV004123"
							}]
						}]
					}
				],
				"StringDefinitions": [{
						"DefinitionId": "SD000018",
						"Name": "ManufacturePartNumber",
						"Value": "167D"
					},
					{
						"DefinitionId": "SD000020",
						"Name": "ExportDocumentType",
						"Value": "Manuals"
					},
					{
						"DefinitionId": "SD000036",
						"Name": "NumberOfPages",
						"Value": "12"
					}
				],
				"Products": [
					"P001691"
				],
				"TaxonomyList": [{
					"TaxonomyId": "PT000608",
					"Node": {
						"TaxonomyId": "PT000627",
						"Node": null
					}
				}],
				"Entry": [],
				"SEO": {
					"Title": "Manuals: 167D, 167DA, 167DS and 167DAS Switching Valves Instruction Manual, Fisher, Regulators (VCIMD-11236-EN)",
					"Keywords": [
						"167D",
						"167DA",
						"167DS and 167DAS Switching Valves Instruction Manual\r\n"
					],
					"Description": "167D, 167DA, 167DS and 167DAS Switching Valves Instruction Manual\r\n"
				},
				"Identifier": "VCIMD-11236-EN",
				"FileName": "VCIMD-11236-EN.pdf",
				"Title": "Fisher 167D, 167DA, 167DS and 167DAS Switching Valves Instruction Manual",
				"LanguageCode": "L000003",
				"Brand": "B4634086",
				"FileUrl": "https://topcat.mcm-plus.com/Files/History/VCIMD-11236-EN.pdf?id=192632&hash=54aea1e78b37ca1e47fad4cfe65671065186c357&uid=4726956&overrides=W3siS2V5SWQiOjE4MSwiVmFsdWUiOiJMb3dSZXNTaXplIn1d&overridesHash=97f98b336035d406a9865091010eaa7ff7775483",
				"FileType": "FT000002",
				"FileTimeStamp": "2019-01-18T10:51:48.000",
				"FileMD5Hash": null,
				"DocumentType": "DT000039",
				"McmId": "DV4849397",
				"IsoCode": "en-gb",
				"TriggerEvent": "EV000007",
				"TimeStamp": "2022-02-09T12:29:08.755",
				"Action": "UPDATE"
			}
		}
		strProgress = 'find input'
		let input = objInput.entity.items[0]

		strProgress = 'get token'
		let strToken = await getToken()
		strProgress = 'got token'

		strProgress = 'upload file call'
		// Construct a request to send the obj to OCM docs
		let objUploadFile = await uploadFile(input, objRRD, strToken)
		strProgress = 'upload file call finished'
		// check for errors
			// TODO if (objUploadFile.status === 'success') blah blah blah
		// the return doesn't matter, since it's coming from a webhook
		return {
			strProgress,
			objUploadFile,
			strToken,
		}
	} catch (error) {
		return {
			error,
			strProgress
		}
	}
})