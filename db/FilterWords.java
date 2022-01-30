import java.io.*;
import java.util.*;

public class FilterWords {
   public static void main(String[] args)  {
      try {
         BufferedReader in = new BufferedReader(new FileReader("./words.txt"));
         String str;
         
        // Creating a File object that represents the disk file.
        PrintStream new_output = new PrintStream(new File("./valid-words.txt"));
  
        // Store current System.out before assigning a new value
        PrintStream console = System.out;
  
        // Assign o to output stream
        System.setOut(new_output);
        
        HashSet<String> valid_words = new HashSet<String>();
         
         while ((str = in.readLine()) != null) {
            if(str.matches("[a-zA-Z]+") && str.length() <= 8 && str.length() >= 2)
            {
                valid_words.add(str.toUpperCase());
                System.out.println(str.toUpperCase());
            }
         }
         
        // Use stored value for output stream
        System.setOut(console);

      } catch (IOException e) {
        System.out.println("Error in filtering words.");
      }
   }
}
