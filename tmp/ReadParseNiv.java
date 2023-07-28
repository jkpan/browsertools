
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

    public void preReadline(String prefix, String next) {

        currentLine = null;

        try {

            BufferedReader br = new BufferedReader(new FileReader("NIV_Bible.txt"));

            String line = null;

            do {
                line = br.readLine();
                try {
                    Integer.parseInt(line.trim());
                    continue;
                } catch(Exception e) {
                    
                }

                if (line != null) {
                    if (line.startsWith(prefix)) {
                        if (currentLine != null) {
                            System.out.println(currentLine.trim());
                            currentLine = null;
                        }
                        currentLine = line;
                        continue;
                    } else if (line.startsWith(next.toUpperCase())) {
                        if (currentLine != null) {
                            System.out.println(currentLine.trim());
                            currentLine = null;
                        }
                        break;
                    } else if (line.startsWith("CHAPTER") && line.length() <= 15) {
                        continue;
                    } else if (line.length() == 0) {
                        continue;
                    } else if (line.equals(" ")) {
                        continue;
                    } else {
                        if (currentLine != null)
                            currentLine += line;
                        else 
                            System.out.println("Exception!!!!!!!!");
                    }

                    //count++;System.out.println(line);
                    //preHandleLine(line, prefix);
                    //preLine = currentLine;

                } else {
                    break;
                }
            } while (true);

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
        
    }
}