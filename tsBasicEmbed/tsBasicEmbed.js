///////////////////////////////////////
//Prototype for TS Liveboard Embed  
//
// High-level steps:
//   : Update CORS and CSP settings in ThoughtSpot (Developer -> Security) - your Salesforce url(s)
//   : Update CORS and CSP settings in Salesforce - your thoughtspot cluster url
//   : Upload the ThoughtSpot SDK into SF as Static Resource
//   : Update the configuration parameters in the LWC - ThoughtSpot URL & liveboard GUID
//
///////////////////////////////////////
import { LightningElement, api, track, wire } from 'lwc';
import getUserInfoByEmail from '@salesforce/apex/TSForSFUtils.getUserInfoByEmail';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
//import thoughtSpotSDK from '@salesforce/resourceUrl/thoughtSpotSDK';
import thoughtSpotSDK from '@salesforce/resourceUrl/thoughtSpotSDKv1280alpha5';
import { loadScript } from 'lightning/platformResourceLoader';

export default class TsLiveboardEmbed extends LightningElement {
    
    /** Object API name - automatically passed when in a record page */
    @api objectApiName;
    /** Object record ID - automatically passed when in a record page */
    @api recordId;
    
    advancedFilterValue;

    @api embedType;
    @api vizID;
    @api tsURL;
    @api hideLiveboardHeader;
    @api showLiveboardTitle;
    @api fullHeight;

    @track fieldsInfo=[];
    
    viz_height = 0;
    viz_width = 0;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //Config Vars - Update these to suit your needs
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    myTestHost   = 'https://your.thoughtspot.cloud';
    myTestOrg    = '0';  //set to '0' if not using orgs in TS, otherwise, update as needed.
    myTestViz    = '<your liveboard guid>';
    myTestSageDS = '<your sage data source guid>';
    myTestAPI    = 'https://your.thoughtspot.cloud/api/rest/2.0/auth/token/full';
    myTestUser   = 'username@email.com';
    myTestPW     = 'yourpassword';
   ////////////////////////////////////////////////////////////////////////////////////////////////////

    userEmail;
    userName;
    userName2;
    lbGuid;
    embedObj;
    embedInit;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter'
    })
    getRecord({ error, data }) {
        if (data) {
            console.log("RECORD DATA: ", JSON.stringify(data));
            this.advancedFilterValue = getFieldValue(
                data,
                this.sfAdvancedFilter
            );
            if (this.advancedFilterValue === undefined) {
                //console.log("getRecord: record found");
            } else {
                //console.log("getRecord: no record found");
            }
        } else if (error) {
            //console.log("Failed to retrieve record data: ", error);
            }
        }

        @api
        get filterOnRecordId() {
            return this._filterOnRecordId;
        }
        set filterOnRecordId(val) {
            this._filterOnRecordId = val;
            console.log("FILTER on RECORD: ",  this._filterOnRecordId);
        }

        @api
        get tsAdvancedFilter() {
            return this._tsAdvancedFilter;
        }
        set tsAdvancedFilter(val) {
            this._tsAdvancedFilter = val;
            console.log("tsAdvancedFilter: ", this._tsAdvancedFilter);    
        }
    
        @api
        get sfAdvancedFilter() {
            return this._sfAdvancedFilter;
        }
        set sfAdvancedFilter(val) {
            this._sfAdvancedFilter = val;
            console.log("sfAdvancedFilter: ", this._sfAdvancedFilter);
        }

    async connectedCallback() {

        getUserInfoByEmail()
            .then(data => {
                let filterID = data.Division;
                let userEmail = data.Email;
                let userName = data.Username;
                this.userName2 = data.Username;

                localStorage.removeItem('vfilterID');
                
                window.localStorage.setItem("vfilterID", filterID);
                console.log("*** SET FILTER VALUE: ", filterID);
                console.log("*** Logged in user Email: ", userEmail);
                console.log("*** Logged in user Username: ", userName);
                console.log("*** TS URL: ", this.tsURL);
                console.log("*** TS Viz: ", this.vizID);

                this.loadTSSDK();
        })
    }

    loadTSSDK() {
        loadScript(this, thoughtSpotSDK)
            .then(() => {
                // ThoughtSpot library loaded successfully
                this.initSDKEmbed();
            })
            .catch(error => {
                // Error occurred while loading the ThoughtSpot library
                this.handleError(error);
            });
    }

    async initSDKEmbed() {
        const containerDiv = this.template.querySelector(
            'div.thoughtspot-insightsJWT'
        );

        if (this.viz_height === 0) {
            let tempDiv = this.template.querySelector('div.thoughtspot-insightsJWT');
            this.viz_height = tempDiv.offsetHeight;
            this.viz_width = tempDiv.offsetWidth;
            console.log('LWC: Captured viz width of => ' + this.viz_width);
            console.log('LWC: Captured viz height of => ' + this.viz_height);
            console.log('LWC: Username2 => ' + this.userName2);
        }

        try {
            const thoughtSpotHost = this.tsURL;

            this.embedInit = tsembed.init({
                thoughtSpotHost: this.myTestHost,

                // https://developers.thoughtspot.com/docs/embed-auth
                //authType: tsembed.AuthType.TrustedAuthTokenCookieless,
                //authType: tsembed.AuthType.SAMLRedirect,
                //authType: tsembed.AuthType.EmbeddedSSO,
                //authType: tsembed.AuthType.None,
                authType: tsembed.AuthType.Basic,
                username: this.myTestUser,
                password: this.myTestPW,
                org_id: this.myTestOrg,
                customizations: {
                    style: {
                      customCSSUrl: "https://cdn.jsdelivr.net/gh/thoughtspot/custom-css-demo/css-variables.css", // location of your style sheet
                
                      // To apply overrides for your style sheet in this init, provide variable values below, eg
                      customCSS: {
                        variables: {
                          "--ts-var-button--secondary-background": "#c9c9c9",
                          "--ts-var-button--secondary--hover-background": "#5c5c5c",
                          "--ts-var-button--primary--hover-background":"#c9c9c9",
                          "--ts-var-button--primary-background": "#ffba90",

                          "--ts-var-root-background": "#ffba90",
                          "--ts-var-viz-border-radius": "22px",
                          "--ts-var-viz-title-font-family": "Helvetica",
                          "--ts-var-viz-background": "#ffffff",
                          
                          "--ts-var-menu-background": "#",
                          "--ts-var-menu--hover-background": "#666666",
                          "--ts-var-menu-font-family": "Helvetica",

                          "--ts-var-chip-border-radius": "22px",
                          "--ts-var-chip-box-shadow": false,
                          "--ts-var-chip-background": "#666666",
                          "--ts-var-chip--active-color": "#CF112C",
                          "--ts-var-chip--active-background": "grey",
                          "--ts-var-chip--hover-color": "red",
                          "--ts-var-chip--hover-background": "blue",
                          "--ts-var-chip-color": "grey",

                        },
                      },
                    },
                  },
            });

            if( this.embedType === "Liveboard") {

                console.log("###Embed Type: ", this.embedType);
                console.log("###data.accountId: ", this.recordId);

                tsembed.resetCachedAuthToken();

                this.embedObj = new tsembed.LiveboardEmbed(containerDiv, {
                    frameParams: {
                    },
                    fullHeight: true,
                    hideLiveboardHeader: false,
                    showLiveboardTitle: true,
                    showLiveboardDescription: true, 
                    //liveboardId: this.vizID,  //Uncomment if you want to pass GUID from LWC meta xml
                    liveboardId: this.myTestViz,
                    
                    // runtimeFilters: [{
                    //     columnName: 'Accountid',
                    //     operator: RuntimeFilterOp.EQ,
                    //     values: ['0016A000007Nj94QAC']
                    // }],
                });
            } else if(this.embedType === "Sage") {

                console.log("###SAGE EmbedObj: ", this.embedObj);
                console.log("###SAGE Embed Type: ", this.embedType);

                this.embedObj = new tsembed.SageEmbed(containerDiv, {
                    frameParams: {
                    height: 700,
                    // width: '100%',
                    },
                    fullHeight: true,
                    // searchOptions: {
                    //     searchQuery: 'average sales by country and product type',
                    //     executeSearch: true,
                    //  },
                    dataSource: this.vizID,
                    //dataSource: this.myTestSageDS,
                    hideSageAnswerHeader: false,
                    hideSearchBarTitle: false,
                });
            } else {
                console.log("###ERROR: No embed type selected in meta xml");
            }

            this.embedObj.render();

            }
            catch (error) {
                console.error('Error:', error);
            }
    }

    handleError(error) {
        // Handle errors gracefully
        console.error('Error loading TS library:', error.message || error);
    }
} 
