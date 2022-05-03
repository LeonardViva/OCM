# Emerson Integrations - Oracle Functions - Coremedia, RRD, and Sharepoint

Each folder represents a function running on Emerson's cloud account. Each function is triggered by webhooks from OCM, and manipulates or pushes the data elsewhere.

## Prerequisites for Project Installation

    1. Node.js, at least version: v12.14.1
    [Node.js](https://nodejs.org/en/)
    2. Docker Local Client
    [Docker Client](https://docs.docker.com/get-docker/)
    3. Account for IDCS:
    [IDCS Console](https://console.us-ashburn-1.oraclecloud.com/)
    4. Access to Emerson Final Control OCM Instance
    [emersonfinalcontrol](https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/documents/integrations/webhooks)

## Oracle Functions - Quickstart Guide

This section is filled with all of the helpful resources that helped to create the project, they are also listed in there own sites, but this serves as a quick guide if knowledge of just one part is needed.

### [Oracle Functions with Node.js tutorial](https://fnproject.io/tutorials/node/intro/)

### [Sample Node.js Function](https://github.com/fnproject/fdk-node/blob/master/examples/simple/func.js)

### [Oracle Quickstart Documention](https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsquickstartguidestop.htm)

### [Configuriung the API Gateway for the Function](https://docs.oracle.com/en-us/iaas/Content/APIGateway/Tasks/apigatewayusingfunctionsbackend.htm#usingconsole)

### [Function Configuration Walkthrough](https://cloud.oracle.com/functions/apps/ocid1.fnapp.oc1.iad.aaaaaaaaf55xgljg6expnupdusxhqww4qo6c635rnztvuijcmwl2zffjihja/gettingStarted?region=us-ashburn-1)

## Create the Api Gateway

    Connecting the OCM Webhook to the Oracle Functions is a straightforward process:
    1. Sign into Oracle Cloud: [IDCS Console](https://console.us-ashburn-1.oraclecloud.com/)
    2. Click on the hamburger menu in the top left
    3. Click on the Networking option
    4. Click on the Virtual Cloud Networks option
    5. Follow these instructions:
    https://docs.oracle.com/en-us/iaas/Content/APIGateway/Tasks/apigatewayquickstartsetupcreatedeploy.htm

## Create the Oracle Function

    * Follow these instruction to create an Oracle function
    https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsquickstartocicomputeinstance.htm#functionsquickstartocicomputeinstance

## Add the Functions to the API Gateway

    * Follow these instructions to add the functions to the API Gateway
    https://docs.oracle.com/en-us/iaas/Content/APIGateway/Tasks/apigatewayquickstartsetupcreatedeploy.htm

## Create The Webhook

    To create a webhook in OCM:
    1. Sign into OCE  [emersonfinalcontrol](https://finalcontroldam-emersonfinalcontrol.cec.ocp.oraclecloud.com/documents/integrations/webhooks)
    2. In the left panel, click on the integration icon (the puzzle pieces fitting together)
    3. At the top of the window, next to Integrations click the dropdown and select webhooks
    4. In the top right corner hit create (choose Asset Publishing Webhook)
    5. Fill out the form for the webhook
    6. For the following fields use the following values:
    Name: (Application name)
    Enable Webhook: Checked
    Publishing Channel: (Channel of the assets)
    Events: Select Individual Events
    Channel Asset: Published: Checked, Unpublished: Checked
    Payload: detailed
    Target URL: (Url of the function in the api gateway) (This is what connects the Function to the webhook)
    Authentication: None
    7. Save the webhook

## Setup For Adding Functions to The Project

Rename `app-configuration-template.json` to `app-configuration.json`, and update it's contents

Develop each fn within it's folder. When ready to deploy, `npm run deploy`

## Steps taken to initialize this project

```shell
docker run hello-world

fn create context emra --provider oracle

fn use context emra

fn update context oracle.profile emra-shapers

fn update context oracle.compartment-id ocid1.compartment.oc1..aaaaaaaaaizafqdkwgowv7wg3jdv67fmym6fudxpbf67j5jafobvrzqblmha

fn update context api-url https://functions.us-ashburn-1.oci.oraclecloud.com

fn update context registry iad.ocir.io/idel0vl4epnz/emerson-automation

docker login -u 'idel0vl4epnz/oracleidentitycloudservice/tcaruth@redstonecontentsolutions.com' iad.ocir.io
# enter password

fn list apps
```
