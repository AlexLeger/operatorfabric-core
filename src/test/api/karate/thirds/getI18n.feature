Feature: getI18n

  Background:
   #Getting token for admin and tso1-operator user calling getToken.feature
    * def signIn = call read('../common/getToken.feature') { username: 'admin'}
    * def authToken = signIn.authToken
    * def signInAsTSO = call read('../common/getToken.feature') { username: 'tso1-operator'}
    * def authTokenAsTSO = signInAsTSO.authToken
    * def thirdName = 'api_test'
    * def templateName = 'template'
    * def thirdVersion = 2
    * def fileLanguage = 'en'

  Scenario: Check i18n file

    # Check template
    Given url opfabUrl + 'thirds/'+ thirdName +'/i18n/' + '?locale=' + fileLanguage + '&version='+ thirdVersion
    And header Authorization = 'Bearer ' + authToken
    When method GET
    Then status 200
    And print response

  Scenario: Check i18n file without authentication

    Given url opfabUrl + 'thirds/'+ thirdName +'/i18n/' + '?locale=' + fileLanguage + '&version='+ thirdVersion
    When method GET
    Then status 401
    And print response

  Scenario: Check unknown i18n file version

    Given url opfabUrl + 'thirds/'+ thirdName +'/i18n/' + '?locale=' + fileLanguage + '&version=9999999'
    And header Authorization = 'Bearer ' + authToken
    When method GET
   Then print response
   And status 404



  Scenario: Check unknown i18n file language

    Given url opfabUrl + 'thirds/'+ thirdName +'/i18n/' + '?locale=DD' + '&version='+ thirdVersion
    And header Authorization = 'Bearer ' + authToken
    When method GET
    Then print response
    And status 404

  Scenario: Check i18n for an unknown third

    Given url opfabUrl + 'thirds/unknownThird/i18n/' + '?locale=fr' + '&version='+ thirdVersion
    And header Authorization = 'Bearer ' + authToken
    When method GET
    Then print response
    And status 404
