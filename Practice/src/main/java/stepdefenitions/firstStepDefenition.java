package stepdefenitions;

import fwk.WebDriverManager;
import io.cucumber.java.en.*;

public class firstStepDefenition {


    @Given("I open the browser")
    public void i_open_the_browser() {

        System.out.println("Inside Step");
    }

    @When("open {string} site on chrome")
    public void open_site_on_chrome(String string) {

        WebDriverManager.getWebDriver().get("http://www.google.com");
        System.out.println(string);
    }

    @Then("site should load with out error")
    public void site_should_load_with_out_error() {

        System.out.println("Tatti");    }

}
