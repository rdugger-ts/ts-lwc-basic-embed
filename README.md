# ThoughtSpot + SF Embedding LWC

Template LWC code for embedding ThoughtSpot Liveboard or Sage search in Salesforce.

## Assumptions

- You have a Salesforce Sandbox or Developer Edition configured
- If testing this LWC in Experience Cloud, ensure you have configured "My Domain" and have enabled digital experiences in Salesforce.
- You have access to the Developer tab in ThoughtSpot and access to update CORS settings

## Deployment

We recommend using [Visual Studio Code](https://code.visualstudio.com/download) (vscode) for LWC development and deployment. After installing, following these steps in vscode:

1. Install the Salesforce Extension Pack. Select 'Extensions' icon on left page navigation
3. Open terminal in vscode: View -> Terminal
4. Create 'project' directory on your local machine (e.g. Documents/LWC/ThoughtSpotSFEmbed)
5. Authorize your org and provide it with an alias. Ex: 'tsBasicEmbed'
```
sfdx force:auth:web:login -s -a tsBasicEmbed
```
> **Note:** This will open a browser window prompting you to authenticate. Ensure you are logging into the correct dev/sandbox org.

1. Clone the repository in the directory create above:
  ```
  git clone https://github.com/rdugger-ts/ts-lwc-basic-embed
  ```

6. Navigate to the directory of the repository you just cloned:
  ```
  cd ts-lwc-basic-embed
  ```
8. Open the ts-lwc-basic-embed folder in vscode: File -> Open Folder

9. Update CSP Trusted Sites: force-app -> main -> default -> cspTrustedSites -> Add your ThoughtSpot URL
10. Update configuration variables in LWC: force-app -> main -> default -> lwc -> tsEmbedNoAuth -> tsEmbedNoAuth.js
```
////////////////////////////////////////////////////////////////////////////////////////////////////
    //Config Vars - Update these to suit your needs
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    myTestHost   = 'https://your.thoughtspot.cloud';
    myTestOrg    = '0';  //set to '0' if not using orgs in TS, otherwise, update as needed.
    myTestViz    = '<your liveboard guid>';
    myTestSageDS = '<your sage data source guid>';
    myTestAPI    = 'https://your.thoughtspot.cloud/api/rest/2.0/auth/token/full';
    myTestUser   = 'username@email.com';
    myTestPW   = 'yourpassword';
    ////////////////////////////////////////////////////////////////////////////////////////////////////
```
11. (optional) Update CORS Whitelist: force-app -> main -> default -> corsWhitelistOrigins -> audit url, update if needed
12. Deploy components to your Org:
  ```
  sfdx force:source:deploy -p force-app
  ```

11. In ThoughtSpot - update CORS settings: Developer -> Security Settings -> CORS whitelisted domains
```
Example: rdugger-dev-ed.lightning.force.com,rdugger-dev-ed.my.site.com,rdugger-dev-ed.preview.salesforce-experience.com,rdugger-dev-ed.lightning.force.com
```

12. Log into your Org manually or use:
  ```
  sfdx force:org:open -u mydevorg
  ```

12. Add the LWC to your page


## Helpful Links

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
