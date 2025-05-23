Feature: Dashboard actions

  Scenario: ✅ User successfully adds multiple products to the cart and verifies them
    Given I navigate to the product page with username "standard_user" and password "secret_sauce"
    When I add the following products to the cart
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
      
    Then I should see the following products in the cart
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
      

  Scenario: 🚫 Attempt to login with incorrect credentials
    Given I navigate to the product page with username "invalid_user" and password "wrong_password"
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"

  Scenario: 🚫 Verify incorrect product in the cart
    Given I navigate to the product page with username "standard_user" and password "secret_sauce"
    When I add the following products to the cart
      | Sauce Labs Backpack |
    Then I should NOT see "Sauce Labs Bike Light" in the cart
