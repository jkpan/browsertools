
import java.io.*;
import java.util.*;

public class ReadParseNiv {

    public ReadParseNiv(String _name) {
        //System.out.print("\nReadParse init...\n");
        name = _name;
    }

    String currentLine;
    String preLine;
    int prechapter = -1;
    int preverse = -1;
    String name = "";

    public void preHandleLine(String line, String prefix) {
    
    }

    public void preReadline(String prefix) {

        currentLine = "";
        preLine = null;

        try {

            BufferedReader br = new BufferedReader(new FileReader("NIV_Bible.txt"));
            
            String line = null;

            //int count = 0;
            do {
                line = br.readLine();
                try {
                    Integer.parseInt(line.trim());
                    //System.out.print(line);
                    continue;
                } catch(Exception e) {
                    
                }

                if (line != null) {
                    if (line.startsWith(prefix)) {
                        currentLine = currentLine.trim();
                        System.out.println(currentLine);
                        currentLine = line;
                        continue;
                    } else if (line.startsWith("CHAPTER") && line.length() <= 15) {
                        //System.out.println(currentLine);
                        continue;
                    } else if (line.length() == 0) {
                        //System.out.print("#");
                        continue;
                    } else if (line.length() == 1) { // {
                        //System.out.print(line);
                        continue;
                    } else if(line.equals(" ")) {
                        continue;
                    } else {
                        currentLine += line;
                    }

                    //count++;System.out.println(line);
                    //preHandleLine(line, prefix);
                    //preLine = currentLine;

                } else {
                    break;
                }
            } while (true);

            System.out.println(currentLine);

            br.close();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            
        }
    }

    public void readline(String prefix) {

        currentLine = null;
        preLine = null;

        try {

            BufferedReader br = new BufferedReader(new FileReader("bible.txt"));
            //BufferedReader br = new BufferedReader(new FileReader("約翰福音.txt"));
            
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

            //System.out.println("count: "+count);
        
            /*
            StringBuilder sb = new StringBuilder();
            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                line = br.readLine();
            }
            String everything = sb.toString();
            */

            br.close();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            
        }
    }

    public void handleLine(String line, String prefix) {
        if (!line.startsWith(prefix)) return;
        StringTokenizer st = new StringTokenizer(line, " ");
        int chapter = -1;
        int verse = -1;
        if (st.hasMoreElements()) {
            String title = st.nextToken();
            StringTokenizer st2 = new StringTokenizer(title.substring(prefix.length()), ":");
            try {
                chapter = Integer.parseInt(st2.nextToken());
                verse = Integer.parseInt(st2.nextToken());
            } catch(NumberFormatException ne) {
                return;
            }
        
            currentLine = line.substring(title.length() + 1);
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

        //new ReadParse("詩篇").readline("詩");
        //return;
        
        new ReadParseNiv("Genesis").preReadline("Ge.");
        /*
        new ReadParseNiv("Exodus").readline("Ex.");
        new ReadParseNiv("Leviticus").readline("Le.");
        new ReadParseNiv("Numbers").readline("Nu.");
        new ReadParseNiv("Deuteronomy").readline("De.");
        new ReadParseNiv("Joshua").readline("Jo.");
        new ReadParseNiv("Judges").readline("Ju.");
        new ReadParseNiv("Ruth").readline("Ru.");
        new ReadParseNiv("1 Samuel").readline("1Sa.");
        new ReadParseNiv("2 Samuel").readline("2Sa.");
        new ReadParseNiv("1 Kings").readline("1Kg.");
        new ReadParseNiv("2 Kings").readline("2Kg.");
        new ReadParseNiv("1 Chronicles").readline("1Ch.");
        new ReadParseNiv("2 Chronicles").readline("2Ch.");
        new ReadParseNiv("Ezra").readline("Ezra");
        new ReadParseNiv("Nehemiah").readline("Nehemiah");
        new ReadParseNiv("Esther").readline("Esther");
        new ReadParseNiv("Job").readline("Job");
        new ReadParseNiv("Psalms").readline("Psalms");
        new ReadParseNiv("Proverbs").readline("Proverbs");
        new ReadParseNiv("Ecclesiastes").readline("Ecclesiastes");
        new ReadParseNiv("Song of Songs").readline("Song of Songs");
        new ReadParseNiv("Isaiah").readline("Isaiah");
        new ReadParseNiv("Jeremiah").readline("Jeremiah");
        new ReadParseNiv("Lamentations").readline("Lamentations");
        new ReadParseNiv("Ezekiel").readline("Ezekiel");
        new ReadParseNiv("Daniel").readline("Daniel");
        new ReadParseNiv("Hosea").readline("Hosea");
        new ReadParseNiv("Joel").readline("Joel");
        new ReadParseNiv("Amos").readline("Amos");
        new ReadParseNiv("Obadiah").readline("Obadiah");
        new ReadParseNiv("Jonah").readline("Jonah");
        new ReadParseNiv("Micah").readline("Micah");
        new ReadParseNiv("Nahum").readline("Nahum");
        new ReadParseNiv("Habakkuk").readline("Habakkuk");
        new ReadParseNiv("Zephaniah").readline("Zephaniah");
        new ReadParseNiv("Haggai").readline("Haggai");
        new ReadParseNiv("Zechariah").readline("Zechariah");
        new ReadParseNiv("Malachi").readline("Malachi");
        
        
        new ReadParseNiv("Matthew").readline("Matthew");
        new ReadParseNiv("Mark").readline("Mark");
        new ReadParseNiv("Luke").readline("Luke");
        new ReadParseNiv("John").readline("John");
        new ReadParseNiv("Acts").readline("Acts");
        new ReadParseNiv("Romans").readline("Romans");
        new ReadParseNiv("1 Corinthians").readline("1 Corinthians");
        new ReadParseNiv("2 Corinthians").readline("2 Corinthians");
        new ReadParseNiv("Galatians").readline("Galatians");
        new ReadParseNiv("Ephesians").readline("Ephesians");
        new ReadParseNiv("Philippians").readline("Philippians");
        new ReadParseNiv("Colossians").readline("Colossians");
        new ReadParseNiv("1 Thessalonians").readline("1 Thessalonians");
        new ReadParseNiv("2 Thessalonians").readline("2 Thessalonians");
        new ReadParseNiv("1 Timothy").readline("1 Timothy");
        new ReadParseNiv("2 Timothy").readline("2 Timothy");
        new ReadParseNiv("Titus").readline("Titus");
        new ReadParseNiv("Philemon").readline("Philemon");
        new ReadParseNiv("Hebrews").readline("Hebrews");
        new ReadParseNiv("James").readline("James");
        new ReadParseNiv("1 Peter").readline("1 Peter");
        new ReadParseNiv("2 Peter").readline("2 Peter");
        new ReadParseNiv("1 John").readline("1 John");
        new ReadParseNiv("2 John").readline("2 John");
        new ReadParseNiv("3 John").readline("3 John");
        new ReadParseNiv("Jude").readline("Jude");
        new ReadParseNiv("Revelation").readline("Revelation");
        */
    }
}