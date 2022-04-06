# emra-integrations

Each folder represents a function running on Emerson's cloud account. Each function is triggered by webhooks from OCM, and manipulates or pushes the data elsewhere.
# Setup

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