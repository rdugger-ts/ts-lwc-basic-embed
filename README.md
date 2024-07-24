# Salesforce DX Project: Next Steps

Now that you’ve created a Salesforce DX project, what’s next? Here are some documentation resources to get you started.

## How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)

We recommend using [Visual Studio Code](https://code.visualstudio.com/download) (vscode) for LWC development and deployment. After installing, following these steps in vscode:

1. Install the Salesforce Extension Pack.
2. Open terminal in vscode: View -> Terminal
3. Create 'project' directory on your local machine (e.g. Documents/LWC/ThoughtSpotSFEmbed)
4. Authorize your org and provide it with an alias. Ex: 'tsBasicEmbed'
`sfdx force:auth:web:login -s -a tsBasicEmbed`

5. Clone the repository in the directory create above:
`git clone https://github.com/rdugger-ts/ts-lwc-basic-embed`

6. Navigate to the directory of the repository you just cloned:
`cd ts-lwc-basic-embed`

7. Deploy components to your Org:
`sfdx force:source:deploy -p force-app`

8. Open the ts-lwc-basic-embed folder in vscode: File -> Open Folder

9. Update CORS

10. Update CSP

11. Log into your Org manually or use:
`sfdx force:org:open -u mydevorg`

12. Add the LWC to your page
