package fwk;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class WebDriverManager {

    private static Map<String, WebDriver> drivers = new HashMap<>();


    public static void openBrowser(String browser, String uniqueID){

        switch (browser){

            case "chrome": setChromeDriver(uniqueID);
            break;
            case "firefox": setFireFoxDriver(uniqueID);
            break;
            default: System.out.println("No match for browser");
        }
    }

    private static void setChromeDriver(String uniqueID){
        if(drivers.get(uniqueID)==null){
            System.setProperty(Constants.WEB_DRIVER_CHROME_DRIVER, System.getProperty("user.dir")+ File.separator+"drivers"+File.separator+"chrome"+File.separator+"chromedriver.exe");
            ChromeOptions options = new ChromeOptions();
            options.addArguments("start-maximized");
            options.addArguments("disable-infobars");
            options.addArguments();
            options.addArguments();
            WebDriver driver = new ChromeDriver(options);
            System.out.println(uniqueID);
            drivers.put(uniqueID,driver);
        }

    }

    private static void setFireFoxDriver(String uniqueID){
        if(drivers.get(uniqueID)==null){
            System.setProperty(Constants.WEB_DRIVER_FIREFOX_DRIVER,System.getProperty("user.dir")+ File.separator+"drivers"+File.separator+"firefox"+File.separator+"geckodriver.exe");
            FirefoxOptions options = new FirefoxOptions();
            WebDriver driver = new FirefoxDriver(options);
            drivers.put(uniqueID,driver);
        }
    }

    public static WebDriver getWebDriver(){
        return WebDriverManager.drivers.get(String.valueOf(Thread.currentThread().getId()));
    }
}
