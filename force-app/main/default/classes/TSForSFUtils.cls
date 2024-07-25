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
}
