import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import org.testng.annotations.DataProvider;



@CucumberOptions(
        features = {"src/main/resources/featurefiles"},
        glue = {"stepdefenitions","fwk"},
        tags = {"@Second"},
        plugin = {"pretty","json:target/report/cucumber.json"}
)
public class RunCucumberIT extends AbstractTestNGCucumberTests {

        @Override
        @DataProvider(parallel = true)
        public Object[][] scenarios(){
            System.setProperty("Environment","Dev");
            return super.scenarios();
        }
}
