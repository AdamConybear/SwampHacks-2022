import java.io.*;
import java.util.*;

public class LettersGenerator {
    public static void main(String[] args)
    {
      try {
        BufferedReader in = new BufferedReader(new FileReader("./seed-words.txt"));
        String str = null;
        HashSet<String> valid_words_set = new HashSet<String>();
        ArrayList<String> valid_words_list = new ArrayList<String>();
        HashMap<Integer, ArrayList<String>> valid_words_map = new HashMap<Integer, ArrayList<String>>();
        char[][] word_grid = new char[8][8];
        
        // fill word grid with hashtag character
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                word_grid[row][col] = '#';
            }
        }
         
        while ((str = in.readLine()) != null) {
            valid_words_set.add(str); // set will check if word is valid in O(1)
            valid_words_list.add(str);
            ArrayList<String> matching_length = valid_words_map.getOrDefault(str.length(), new ArrayList<String>());
            matching_length.add(str);
            valid_words_map.put(str.length(), matching_length);
        }
        
        word_grid = fill_word_grid(word_grid, valid_words_map, valid_words_set);
        write_to_file(word_grid);
        print_grid(word_grid);
     } catch (IOException e) {
        System.out.println("Error in generating words");
     }
   }
   
   public static void write_to_file (char[][] word_grid)
   {
   try{
        // Creating a File object that represents the disk file.
        PrintStream new_output = new PrintStream(new File("letters.txt"));
  
        // Store current System.out before assigning a new value
        PrintStream console = System.out;
  
        // Assign new output to output stream
        System.setOut(new_output);
        
        ArrayList<Character> letters = new ArrayList<Character>();
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                if(word_grid[row][col] != '#')
                {
                    letters.add(word_grid[row][col]);
                }
            }
        }
        
        Random random = new Random();
        while(letters.size() > 0)
        {
            int index = random.nextInt(letters.size());
            char letter = letters.get(index);
            letters.remove(index);
            System.out.println(letter);
        }
        
        // Creating a File object that represents the disk file.
        new_output = new PrintStream(new File("grid.txt"));
        
        // Assign new output to output stream
        System.setOut(new_output);
        
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                System.out.print(word_grid[row][col]);
            }
            System.out.println();
        }
        
        // Use stored value for output stream
        System.setOut(console);
        }
        catch(IOException e){}
   }
   
   private static int[] get_random_cell( int orientation )
   {
        /*
        If orientation is horizontal (0), then max col value is 5
        If orientation is vertical (1), then max row value is 5
        */
        int max_row_val = 7;
        int max_col_val = 7;
        if(orientation == 0)
        {
            max_col_val = 5;
        }
        else
        {
            max_row_val = 5;
        }
        int[] cell = new int[2];
        Random random = new Random();
        cell[0] = random.nextInt(max_row_val);
        cell[1] = random.nextInt(max_col_val);
        return cell;
   }
   
   //0 is horizontal and 1 is vertical
   private static int get_random_orientation()
   {
        Random random = new Random();
        return random.nextInt(2);
   }
   
   private static char[][] fill_word_grid(char[][] word_grid,
                                        HashMap<Integer, ArrayList<String>> valid_words_map,
                                        HashSet<String> valid_words_set)
   {
        /*
        Below we will get the first word of the grid.
        */
        int num_letters_used = 0;       
        int orientation = get_random_orientation();
        int[] cell = get_random_cell(orientation);
        int row = cell[0];
        int col = cell[1];
        /*
        If orientation is horizontal (0), then col value is limiting word length
        If oriientation is vertical (1), then row value is limiting word length
        */
        int max_word_length;
        if(orientation == 0)
        {
            max_word_length = 8 - col;
        }
        else
        {
            max_word_length = 8 - row;
        }
        /*
        Possible word length ranges from 3 to max_word_length (inclusive).
        We will generate a random length in that range and then grab a list
        of all the words with that length from the map.
        */
        Random random = new Random();
        int word_length = 0;
        while(word_length < 3)
        {
            word_length = random.nextInt(max_word_length + 1);
        }
        ArrayList<String> possible_words = valid_words_map.get(word_length);
        /*
        We will now grab a word from a random index in the list.
        */
        int index = random.nextInt(possible_words.size());
        String word = possible_words.get(index);
        insert_word(word_grid, word, row, col, orientation);
        /*
        We need to keep track of the total number of letters used to make words.
        */
        num_letters_used += word.length();
        /*
        Below we will get the remaining words of the grid.
        It's a similar process to above, except each subsequent word must
        have a letter that physically overlaps with a letter in a previous word.
        */
        while(num_letters_used < 10)
        {
            orientation = get_random_orientation();
            cell = get_random_cell(orientation);
            row = cell[0];
            col = cell[1];
            /*
            If orientation is horizontal (0), then col value is limiting word length
            If oriientation is vertical (1), then row value is limiting word length
            */
            if(orientation == 0)
            {
                max_word_length = 8 - col;
            }
            else
            {
                max_word_length = 8 - row;
            }
            /*
            We have to make sure we don't use greater than 14 letters.
            Possible word length ranges from 3 to max_word_length (inclusive).
            We will generate a random length in that range and then grab a list
            of all the words with that length from the map.
            */
            max_word_length = Math.min(max_word_length, 14 - num_letters_used);
            word_length = 0;
            while(word_length < 3)
            {
                word_length = random.nextInt(max_word_length + 1);
            }
            /*
            Make sure that a word with given length starting at the given cell
            intersects at-least one letter. We also need to track what letters
            are required to be in what positions in the selected word.
            */
            boolean letter_in_sight = false;
            int temp = 0;
            HashMap<Integer, Character> required_chars = new HashMap<Integer, Character>();
            if(orientation == 0)
            {
                for(int c = col; c < col + word_length; c++)
                {
                    if(word_grid[row][c] != '#')
                    {
                        required_chars.put(temp, word_grid[row][c]);
                        letter_in_sight = true;
                    }
                    temp++;
                }
            }
            else
            {
                for(int r = row; r < row + word_length; r++)
                {
                    if(word_grid[r][col] != '#')
                    {
                        required_chars.put(temp, word_grid[r][col]);
                        letter_in_sight = true;
                    }
                    temp++;
                }
            }
            if(!letter_in_sight)
            {
                continue;
            }
            possible_words = valid_words_map.get(word_length);
            int words_to_check = possible_words.size();
            word = "";
            while(word.length() == 0 && words_to_check > 0)
            {
                index = random.nextInt(words_to_check);
                words_to_check--;
                /*
                We need to make sure the candidate has the correct letters
                at each required position.
                */
                word = possible_words.get(index);
                for(int i = 0; i < word.length(); i++)
                {
                    if(required_chars.get(i) != null && required_chars.get(i) != word.charAt(i))
                    {
                        word = "";
                    }
                }
            }
            if(word.length() == 0)
            {
                continue;
            }
            /*
            Lastly, we need to check that inserting the word into the grid would
            still result in all contiguous letters forming valid words. We will
            create a deep copy to and validate grid to test this.
            */
            char[][] grid_copy = new char[8][8];
            for(int r = 0; r < 8; r++)
            {
                for(int c = 0; c < 8; c++)
                {
                    grid_copy[r][c] = word_grid[r][c];
                }
            }
            insert_word(grid_copy, word, row, col, orientation);
            if(validate_word_grid(valid_words_set, grid_copy))
            {
                word_grid = grid_copy;
                num_letters_used += (word.length() - required_chars.size());
            }
        }
        return word_grid;
   }
   
   private static void print_grid (char[][] word_grid)
   {
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                System.out.print(word_grid[row][col] + " ");
            }
            System.out.println();
        }
   }
   
   private static char[][] insert_word (char[][] word_grid, String word, int row, int col, int orientation)
   {
        /*
        // Below lines help tell where out of bounds exceptions are coming from when inserting words.
        System.out.println("Row: "+row+" Col: "+col+" Ori: "+orientation);
        System.out.println("Word Length: "+word.length());
        */
        if(orientation == 0)
        {
            for(int i = 0; i < word.length(); i++)
            {
                word_grid[row][col] = word.charAt(i);
                col += 1;
            }                
        }
        else
        {
            for(int i = 0; i < word.length(); i++)
            {
                word_grid[row][col] = word.charAt(i);
                row += 1;
            }
        }
        return word_grid;
   }
   
   private static boolean validate_word_grid (HashSet<String> valid_words_set, char[][] word_grid)
   {
        // Words can only be created from top to bottom and left to right.
        
        // First, check left to right.
        for(int row = 0; row < 8 ; row++)
        {
            String word = "";
            for(int col = 0; col < 8; col++)
            {
                char letter = word_grid[row][col];
                if(letter != '#')
                {
                    word += letter;
                }
                else
                {
                    if(word.length() > 1 && !valid_words_set.contains(word))
                    {
                        return false;
                    }
                    word = "";
                }
            }
            if(word.length() > 1 && !valid_words_set.contains(word))
            {
                return false;
            }
        }
        
        // Check top to bottom.
        for(int col = 0; col < 8 ; col++)
        {
            String word = "";
            for(int row = 0; row < 8; row++)
            {
                char letter = word_grid[row][col];
                if(letter != '#')
                {
                    word += letter;
                }
                else
                {
                    if(word.length() > 1 && !valid_words_set.contains(word))
                    {
                        return false;
                    }
                    word = "";
                }
            }
            if(word.length() > 1 && !valid_words_set.contains(word))
            {
                return false;
            }
        }
        
        return true;
   }
}
