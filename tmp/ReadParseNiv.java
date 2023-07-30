
import java.io.*;
import java.util.*;

public class ReadParseNiv {

  static String volumns[] = { "Genesis",//).preReadline("Ge.", "Exodus");
                     "Exodus",//).preReadline("Ex.", "Leviticus");
                     "Leviticus",//).preReadline("Le.", "Numbers");
                     "Numbers",//).preReadline("Nu.", "Deuteronomy");
                     "Deuteronomy",//).preReadline("De.", "Joshua");
                     "Joshua",//).preReadline("Jo.", "Judges");
                     "Judges",//).preReadline("Ju.", "Ruth");
                     "Ruth",//).preReadline("Ru.", "1 Samuel");
                     "1 Samuel",//).preReadline("1Sa.", "2 Samuel");
                     "2 Samuel",//).preReadline("2Sa.", "1 Kings");
                     "1 Kings",//).preReadline("1Kg.", "2 Kings");
                     "2 Kings",//).preReadline("2Kg.", "1 Chronicles");
                     "1 Chronicles",//).preReadline("1Ch.", "2 Chronicles");
                     "2 Chronicles",//).preReadline("2Ch.", "Ezra");
                     "Ezra",//).preReadline("Ezr.", "Nehemiah");
                     "Nehemiah",//).preReadline("Ne.", "Esther");
                     "Esther",//).preReadline("Es.", "Job");
                     "Job",//).preReadline("Job", "Psalms");
                     "Psalms",//).preReadline("Ps.", "Proverbs");
                     "Proverbs",//).preReadline("Pr.", "Ecclesiastes");
                     "Ecclesiastes",//).preReadline("Ec.", "SONG OF SOLOMON");
                     "Song of Songs",//).preReadline("So.", "Isaiah");
                     "Isaiah",//).preReadline("Is.", "Jeremiah");
                     "Jeremiah",//).preReadline("Je.", "Lamentations");
                     "Lamentations",//).preReadline("La.", "Ezekiel");
                     "Ezekiel",//).preReadline("Ezekiel", "Daniel");
                     "Daniel",//).preReadline("Daniel", "Hosea");
                     "Hosea",//).preReadline("Hosea", "Joel");
                     "Joel",//).preReadline("Joel", "Amos");
                     "Amos",//).preReadline("Amos", "Obadiah");
                     "Obadiah",//).preReadline("Obadiah", "Jonah");
                     "Jonah",//).preReadline("Jonah", "Micah");
                     "Micah",//).preReadline("Micah", "Nahum");
                     "Nahum",//).preReadline("Nahum", "Habakkuk");
                     "Habakkuk",//).preReadline("Habakkuk", "Zephaniah");
                     "Zephaniah",//).preReadline("Zephaniah", "Haggai");
                     "Haggai",//).preReadline("Haggai", "Zechariah");
                     "Zechariah",//).preReadline("Zechariah", "Malachi");
                     "Malachi",//).preReadline("Mal.", "Matthew");

                     "Matthew",//).preReadline("Matthew", "Mark");
                     "Mark",//).preReadline("Mark", "Luke");
                     "Luke",//).preReadline("Luke", "John");
                     "John",//).preReadline("John", "Acts");
                     "Acts",//).preReadline("Acts", "Romans");
                     "Romans",//).preReadline("Romans", "1 Corinthians");
                     "1 Corinthians",//).preReadline("1 Corinthians", "2 Corinthians");
                     "2 Corinthians",//).preReadline("2 Corinthians", "Galatians");
                     "Galatians",//).preReadline("Galatians", "Ephesians");
                     "Ephesians",//).preReadline("Ephesians", "Philippians");
                     "Philippians",//).preReadline("Philippians", "Colossians");
                     "Colossians",//).preReadline("Colossians", "1 Thessalonians");
                     "1 Thessalonians",//).preReadline("1 Thessalonians", "2 Thessalonians");
                     "2 Thessalonians",//).preReadline("2 Thessalonians", "1 Timothy");
                     "1 Timothy",//).preReadline("1 Timothy", "2 Timothy");
                     "2 Timothy",//).preReadline("2 Timothy", "Titus");
                     "Titus",//).preReadline("Titus", "Philemon");
                     "Philemon",//).preReadline("Philemon", "Hebrews");
                     "Hebrews",//).preReadline("Hebrews", "James");
                     "James",//).preReadline("James", "1 Peter");
                     "1 Peter",//).preReadline("1 Peter", "2 Peter");
                     "2 Peter",//).preReadline("2 Peter", "1 John");
                     "1 John",//).preReadline("1 John", "2 John");
                     "2 John",//).preReadline("2 John", "3 John");
                     "3 John",//).preReadline("3 John", "Jude");
                     "Jude",//).preReadline("Jude", "Revelation");
                     "Revelation"};//).preReadline("Revelation", "END.");

 static int[][] cv = {{31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26, },
               {22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38, },
               {17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34, },
               {54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13, },
               {46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12, },
               {18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33, },
               {36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25, },
               {22, 23, 18, 22, },
               {28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13, },
               {27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25, },
               {53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53, },
               {18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30, },
               {54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30, },
               {17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23, },
               {11, 70, 13, 24, 17, 22, 28, 36, 15, 44, },
               {11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31, },
               {22, 23, 15, 17, 14, 14, 10, 17, 32, 3, },
               {22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17, },
               {6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6, },
               {33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31, },
               {18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14, },
               {17, 17, 11, 16, 16, 13, 13, 14, },
               {31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24, },
               {19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34, },
               {22, 22, 66, 22, 22, },
               {28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35, },
               {21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13, },
               {11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9, },
               {20, 32, 21, },
               {15, 16, 15, 13, 27, 14, 17, 14, 15, },
               {21, },
               {17, 10, 10, 11, },
               {16, 13, 12, 13, 15, 16, 20, },
               {15, 13, 19, },
               {17, 20, 19, },
               {18, 15, 20, },
               {15, 23, },
               {21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21, },
               {14, 17, 18, 6, },
               {25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20, },
               {45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20, },
               {80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53, },
               {51, 25, 36, 54, 47, 71, 52, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25, },
               {26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31, },
               {32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27, },
               {31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24, },
               {24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14, },
               {24, 21, 29, 31, 26, 18, },
               {23, 22, 21, 32, 33, 24, },
               {30, 30, 21, 23, },
               {29, 23, 25, 18, },
               {10, 20, 13, 18, 28, },
               {12, 17, 18, },
               {20, 15, 16, 16, 25, 21, },
               {18, 26, 17, 22, },
               {16, 15, 15, },
               {25, },
               {14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25, },
               {27, 26, 18, 17, 20, },
               {25, 25, 22, 19, 14, },
               {21, 22, 18, },
               {10, 29, 24, 21, 21, },
               {13, },
               {15, },
               {25, },
               {20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21, }};

    public ReadParseNiv(String _name) {
        //System.out.print("\nReadParse init...\n");
        name = _name;
    }

    String currentLine;
    String preLine;
    int prechapter = -1;
    int preverse = -1;
    String name = "";

    public void preReadline(int v) {

        currentLine = null;
        String prefix = volumns[v];
        String next = v+1<volumns.length?volumns[v+1]:null;
        int array[] = cv[v];

        //System.out.println(prefix + "~" + next);

        try {

            BufferedReader br = new BufferedReader(new FileReader("NIV_Bible.txt"));

            String line = null;
            int chapter = 1;
            int verse = 1;
            boolean start = false;

            //int count = 0;

            do {
                line = br.readLine();
                //count++;
                if (line == null) break;
                if (line.trim().length() == 0) continue;
                if (next != null && line.equals(next)) break;
                if (line.equals(prefix)) {
                    start = true;
                    continue;
                }
                if (!start) continue;

                System.out.println(prefix + " " + chapter+":" + verse + " " + line);
                if (verse == array[chapter-1]) {
                    chapter++;
                    verse = 1;
                    continue;
                }
                verse++;
                
            } while (true);

            br.close();

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Exception: " + prefix +" ~ "+ next);
        } finally {
            
        }
    }

    public void readline(String prefix) {

        currentLine = null;
        preLine = null;

        prefix += " ";

        try {

            BufferedReader br = new BufferedReader(new FileReader("niv_raw.txt"));
            
            String line = null;

            //int count = 0;
            do {
                line = br.readLine();
                if (line != null) {
                    //count++;System.out.println(line);
                    handleLine(line, prefix);
                    preLine = currentLine;
                } else {
                    break;
                }
            } while (true);

            currentLine = currentLine + "]]";

            System.out.println(currentLine);
            System.out.println("} </script>");

            br.close();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            
        }
    }

    public void handleLine(String line, String prefix) {
        if (!line.startsWith(prefix)) return;
        line = line.substring(prefix.length());
        //
        //return;
        StringTokenizer st = new StringTokenizer(line, " ");
        int chapter = -1;
        int verse = -1;
        if (st.hasMoreElements()) {
            String title = st.nextToken();
            StringTokenizer st2 = new StringTokenizer(title, ":");
            try {
                chapter = Integer.parseInt(st2.nextToken());
                verse = Integer.parseInt(st2.nextToken());
                //System.out.print("(" + chapter+" # "+verse + ")");
            } catch(NumberFormatException ne) {
                return;
            }
            
            currentLine = line.substring(title.length() + 1).trim();
            //System.out.println(currentLine);

            currentLine = "\"" + currentLine + "\"";

            if (preLine == null) {
                System.out.println("<script id=\"" +prefix + "\" name=\"" + name +"\" type=\"application/json\" charset=\"UTF-8\"> {");
                System.out.println("\"content\" : [[\"" + name + "\"],");
                System.out.println("[\"" + name + " " + chapter + "\",");
                //currentLine = "[" +currentLine;
                prechapter = chapter;
                preverse = verse;
                return;
            }

            if (chapter != prechapter) {
                preLine = preLine + "],";
                System.out.println(preLine);
                System.out.println("[\"" + name + " " + chapter + "\",");
            } else {
                preLine = preLine + ",";
                System.out.println(preLine);
            }
            
            prechapter = chapter;
            
            
            //System.out.println(chapter + ":" + verse +" "+content);
        }
        
    }

    public static void main(String[] args) {
        
        //System.out.println(volumns.length);
        //System.out.println(cv.length);

        //new ReadParseNiv("").preReadline(4);

        //for (int i=0;i<volumns.length;i++) new ReadParseNiv("").preReadline(i);

        //new ReadParseNiv(volumns[0]).readline(volumns[0]);

        for (int i=0;i<volumns.length;i++) new ReadParseNiv(volumns[i]).readline(volumns[i]);

        /*
        new ReadParseNiv("Genesis").preReadline("Ge.", "Exodus");
        new ReadParseNiv("Exodus").preReadline("Ex.", "Leviticus");
        new ReadParseNiv("Leviticus").preReadline("Le.", "Numbers");
        new ReadParseNiv("Numbers").preReadline("Nu.", "Deuteronomy");
        new ReadParseNiv("Deuteronomy").preReadline("De.", "Joshua");
        new ReadParseNiv("Joshua").preReadline("Jo.", "Judges");
        new ReadParseNiv("Judges").preReadline("Ju.", "Ruth");
        new ReadParseNiv("Ruth").preReadline("Ru.", "1 Samuel");
        new ReadParseNiv("1 Samuel").preReadline("1Sa.", "2 Samuel");
        new ReadParseNiv("2 Samuel").preReadline("2Sa.", "1 Kings");
        new ReadParseNiv("1 Kings").preReadline("1Kg.", "2 Kings");
        new ReadParseNiv("2 Kings").preReadline("2Kg.", "1 Chronicles");
        new ReadParseNiv("1 Chronicles").preReadline("1Ch.", "2 Chronicles");
        new ReadParseNiv("2 Chronicles").preReadline("2Ch.", "Ezra");
        new ReadParseNiv("Ezra").preReadline("Ezr.", "Nehemiah");
        new ReadParseNiv("Nehemiah").preReadline("Ne.", "Esther");
        new ReadParseNiv("Esther").preReadline("Es.", "Job");
        new ReadParseNiv("Job").preReadline("Job", "Psalms");
        new ReadParseNiv("Psalms").preReadline("Ps.", "Proverbs");
        new ReadParseNiv("Proverbs").preReadline("Pr.", "Ecclesiastes");
        new ReadParseNiv("Ecclesiastes").preReadline("Ec.", "SONG OF SOLOMON");
        new ReadParseNiv("Song of Songs").preReadline("So.", "Isaiah");
        new ReadParseNiv("Isaiah").preReadline("Is.", "Jeremiah");
        new ReadParseNiv("Jeremiah").preReadline("Je.", "Lamentations");
        new ReadParseNiv("Lamentations").preReadline("La.", "Ezekiel");
        new ReadParseNiv("Ezekiel").preReadline("Ezekiel", "Daniel");
        new ReadParseNiv("Daniel").preReadline("Daniel", "Hosea");
        new ReadParseNiv("Hosea").preReadline("Hosea", "Joel");
        new ReadParseNiv("Joel").preReadline("Joel", "Amos");
        new ReadParseNiv("Amos").preReadline("Amos", "Obadiah");
        new ReadParseNiv("Obadiah").preReadline("Obadiah", "Jonah");
        new ReadParseNiv("Jonah").preReadline("Jonah", "Micah");
        new ReadParseNiv("Micah").preReadline("Micah", "Nahum");
        new ReadParseNiv("Nahum").preReadline("Nahum", "Habakkuk");
        new ReadParseNiv("Habakkuk").preReadline("Habakkuk", "Zephaniah");
        new ReadParseNiv("Zephaniah").preReadline("Zephaniah", "Haggai");
        new ReadParseNiv("Haggai").preReadline("Haggai", "Zechariah");
        new ReadParseNiv("Zechariah").preReadline("Zechariah", "Malachi");
        new ReadParseNiv("Malachi").preReadline("Mal.", "Matthew");
        
        
        new ReadParseNiv("Matthew").preReadline("Matthew", "Mark");
        new ReadParseNiv("Mark").preReadline("Mark", "Luke");
        new ReadParseNiv("Luke").preReadline("Luke", "John");
        new ReadParseNiv("John").preReadline("John", "Acts");
        new ReadParseNiv("Acts").preReadline("Acts", "Romans");
        new ReadParseNiv("Romans").preReadline("Romans", "1 Corinthians");
        new ReadParseNiv("1 Corinthians").preReadline("1 Corinthians", "2 Corinthians");
        new ReadParseNiv("2 Corinthians").preReadline("2 Corinthians", "Galatians");
        new ReadParseNiv("Galatians").preReadline("Galatians", "Ephesians");
        new ReadParseNiv("Ephesians").preReadline("Ephesians", "Philippians");
        new ReadParseNiv("Philippians").preReadline("Philippians", "Colossians");
        new ReadParseNiv("Colossians").preReadline("Colossians", "1 Thessalonians");
        new ReadParseNiv("1 Thessalonians").preReadline("1 Thessalonians", "2 Thessalonians");
        new ReadParseNiv("2 Thessalonians").preReadline("2 Thessalonians", "1 Timothy");
        new ReadParseNiv("1 Timothy").preReadline("1 Timothy", "2 Timothy");
        new ReadParseNiv("2 Timothy").preReadline("2 Timothy", "Titus");
        new ReadParseNiv("Titus").preReadline("Titus", "Philemon");
        new ReadParseNiv("Philemon").preReadline("Philemon", "Hebrews");
        new ReadParseNiv("Hebrews").preReadline("Hebrews", "James");
        new ReadParseNiv("James").preReadline("James", "1 Peter");
        new ReadParseNiv("1 Peter").preReadline("1 Peter", "2 Peter");
        new ReadParseNiv("2 Peter").preReadline("2 Peter", "1 John");
        new ReadParseNiv("1 John").preReadline("1 John", "2 John");
        new ReadParseNiv("2 John").preReadline("2 John", "3 John");
        new ReadParseNiv("3 John").preReadline("3 John", "Jude");
        new ReadParseNiv("Jude").preReadline("Jude", "Revelation");
        new ReadParseNiv("Revelation").preReadline("Revelation", "END.");
        */
    }
}