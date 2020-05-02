package fwk;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import utility.PropertyFileReader;

public class Hooks {

    @Before
    public void openBrowser(){
        //WebDriverManager.openBrowser(PropertyFileReader.getApplicationProperty("browser","Test"),String.valueOf(Thread.currentThread().getId()));
        WebDriverManager.openBrowser(PropertyFileReader.getApplicationProperty("browser",System.getProperty("Environment")),String.valueOf(Thread.currentThread().getId()));
    }

    @After
    public void tearDown(){

        WebDriverManager.getWebDriver().quit();
    }
}
