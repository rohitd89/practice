package stepdefenitions;

import fwk.WebDriverManager;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class SecondStepDef {
    @Given("I open the browser second time")
    public void iOpenTheBrowserSecondTime() {
        System.out.println("Hi From Second FF");
    }

    @When("open {string} site on chrome second time")
    public void openSiteOnChromeSecondTime(String arg0) {
        System.out.println(arg0+" from second StepDef");
        WebDriverManager.getWebDriver().get("http://www.rediff.com");
    }

    @Then("site should load with out error second time")
    public void siteShouldLoadWithOutErrorSecondTime() {

        System.out.println("Second - GG WP");
    }
}
