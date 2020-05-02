import utility.PropertyFileReader;

public class test {

    public static void main(String[] args) {

        System.out.println(PropertyFileReader.getApplicationProperty("username","Test"));
        System.out.println(PropertyFileReader.getApplicationProperty("username","Dev"));
    }
}
