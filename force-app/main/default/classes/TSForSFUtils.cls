public with sharing class TSForSFUtils {
    @AuraEnabled(cacheable=true)
    public static User getUserInfoByEmail(String emailAddress) {
        try {
            // Querying user information based on provided email address
            String userEmail = UserInfo.getUserEmail();
            String userName  = UserInfo.getUserName();

            User userInfo = [//SELECT Id, Name, Email, Profile.Name, IsActive, UserType, Division 
                              SELECT Division, Email, Username                              
                              FROM User 
                              WHERE Username = :userName
                              AND alias != 'guest'
                              LIMIT 1];
            return userInfo;
        } catch (Exception e) {
            // Handling any exceptions or errors
            System.debug('Error occurred while retrieving user information: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    //@isTest
    public static String getTokenForUser() {
        String endpoint = 'https://embed-1-do-not-delete.thoughtspotstaging.cloud/api/rest/2.0/auth/token/full';
        //return null;
        // Data to be sent in the POST request body
        //@isTest
        Map<String, Object> postData = new Map<String, Object>{
            'username' => 'ronald.dugger@thoughtspot.com',
            'validity_time_in_sec' => 600,
            'org_id' => 33363357,
            'secret_key' => '2806b156-f52c-4b49-b0b9-81d50c59d641',
            'jwt_user_options' => new Map<String, Object>{
                'parameters' => new List<Map<String, Object>>{
                    new Map<String, Object>{
                        'runtime_filter' => new Map<String, Object>{
                            'col1' => 'Region',
                            'op1' => 'IN',
                            'val1' => 'EAST' // Replace with actual value of tempID
                        },
                        'runtime_param_override' => new Map<String, Object>{
                            'param1' => 'RLS Secret String',
                            'paramVal1' => 'abgdezetiklmnzoprstupcpos'
                        }
                    }
                }
            }
            
        };
        //return null;

        // Making a POST request using Http
        System.debug('#### Config Post Request ####');
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/json');
        req.setBody(JSON.serialize(postData));
        Http http = new Http();
        HttpResponse res = http.send(req);
        //@isTest
        if (res.getStatusCode() == 200) {
            Map<String, Object> responseData = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            String token = (String) responseData.get('token');
            System.debug('RD Response: ' + responseData);
            //System.debug('RD TOKEN: ' + token);
            return token;
        } 
        else {
            System.debug('Network response was not ok. Status code: ' + res.getStatusCode());
            System.debug('Response body: ' + res.getBody());
             return 'ErrorRAD';
        }

    }
}