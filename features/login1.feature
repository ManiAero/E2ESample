Feature: Login Functionality

  Scenario: ✅ Successful login
    Given I launch the browser
    When I navigate to the login page
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be logged in successfully

  Scenario: 🚫 Login fails with incorrect credentials
    Given I launch the browser
    When I navigate to the login page
    When I login with username "invalid_user" and password "wrong_password"
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"
