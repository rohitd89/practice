package utility;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class PropertyFileReader {

    private static Properties config;


    public static void loadPropertyFile(String fileName) {

        try {
            Properties newConfig = new Properties();
            File file = new File(System.getProperty("user.dir") + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator + fileName + ".properties");
            System.out.println(System.getProperty("user.dir") + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator + fileName + ".properties");
            FileInputStream fInput = new FileInputStream(file);
            newConfig.load(fInput);
            config = new Properties();
            config.putAll(newConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static String getApplicationProperty(String key, String propertyFileName){
        loadPropertyFile(propertyFileName);
        return config.getProperty(key);

}

}
