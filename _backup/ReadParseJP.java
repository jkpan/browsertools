
import java.io.*;
import java.util.*;

public class ReadParseJP {   

    public ReadParseJP(String _name) {
        //System.out.print("\nReadParse init...\n");
        name = _name;
    }

    String currentLine;
    String preLine;
    int prechapter = -1;
    int preverse = -1;
    String name = "";

    public void readline(String prefix) {

        currentLine = null;
        preLine = null;

        try {

            BufferedReader br = new BufferedReader(new FileReader("JpCB.txt"));

            String line = null;

            do {
                line = br.readLine();
                if (line != null) {

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

    public void handleLine(String line, String prefix) throws Exception {
        if (!line.startsWith(prefix)) return;

        //line = "創 1:1	初めに， 神が 天と 地を 創造した．";

        StringTokenizer st = new StringTokenizer(line, " ");
        int chapter = -1;
        int verse = -1;
        if (st.hasMoreElements()) {
            String title = st.nextToken();
            String chpv = st.nextToken();

            StringTokenizer st2 = new StringTokenizer(chpv, ":");

            //System.out.println("####" + title + "####" + chpv);

            try {
                chapter = Integer.parseInt(st2.nextToken());
                verse = Integer.parseInt(st2.nextToken());
            } catch(NumberFormatException ne) {
                ne.printStackTrace();
                throw ne;
            }

            currentLine = line.substring(title.length() + 1 + chpv.length()  + 1).trim();
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

    /*
    public void readline(String prefix) {

        System.out.println();

        currentLine = null;
        preLine = null;

        try {

            BufferedReader br = new BufferedReader(new FileReader("bible.txt"));

            String line = null;

            do {
                line = br.readLine();
                if (line != null) {

                    handleLine(line, prefix);
                    preLine = currentLine;
                    

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

    public void handleLine(String line, String prefix) {
        if (!line.startsWith(prefix)) return;
        StringTokenizer st = new StringTokenizer(line, " ");
        int chapter = -1;
        int verse = -1;
        if (st.hasMoreElements()) {
            String title = st.nextToken();
            //System.out.print("(" + title + ")");
            StringTokenizer st2 = new StringTokenizer(title.substring(prefix.length()), ":");
            try {
                chapter = Integer.parseInt(st2.nextToken());
                verse = Integer.parseInt(st2.nextToken());
                //System.out.print("(" + chapter + ", " + verse + ")");
            } catch(NumberFormatException ne) {
                return;
            }
        
            currentLine = line.substring(title.length() + 1);
            //System.out.println(name +" "+ chapter + ":" + verse + " " + currentLine);
            System.out.println(currentLine);
            prechapter = chapter;
            preverse = verse;

        }
        
    }
    */

    public static void main(String[] args) {

        //new ReadParse("詩篇").readline("詩");
        //return;
       new ReadParseJP("創世記").readline("創");
       new ReadParseJP("出エジプト記").readline("出");
       new ReadParseJP("レビ記").readline("レビ");
       new ReadParseJP("民数記").readline("民");
       new ReadParseJP("申命記").readline("申");     
       new ReadParseJP("ヨシュア記").readline("ヨシュ");   
       new ReadParseJP("士師記").readline("士");     
       new ReadParseJP("ルツ記").readline("ルツ");    
       new ReadParseJP("サムエル記上").readline("Ⅰサム");   
      new ReadParseJP("サムエル記下").readline("Ⅱサム");   
      new ReadParseJP("列王記上").readline("王上");    
     new ReadParseJP("列王記下").readline("王下");    
      new ReadParseJP("歴代誌上").readline("代上");    
      new ReadParseJP("歴代誌下").readline("代下");    
      new ReadParseJP("エズラ記").readline("エズ"); 
      new ReadParseJP("ネヘミヤ記").readline("ネヘ");    
      new ReadParseJP("エステル記").readline("エス");    
      new ReadParseJP("ヨブ記").readline("ヨブ");    
      new ReadParseJP("詩篇").readline("詩");     
      new ReadParseJP("箴言").readline("箴");     
      new ReadParseJP("コヘレトの言葉").readline("伝");    
      new ReadParseJP("雅歌").readline("雅歌");     
      new ReadParseJP("イザヤ書").readline("イザ");    
      new ReadParseJP("エレミヤ書").readline("エレ");    
      new ReadParseJP("哀歌").readline("哀歌");
      new ReadParseJP("エゼキエル書").readline("エゼ");    
      new ReadParseJP("ダニエル書").readline("ダニ");    
      new ReadParseJP("ホセア書").readline("hos");//("ホセ");    
      new ReadParseJP("ヨエル書").readline("joe");//("ヨエ");    
      new ReadParseJP("アモス書").readline("amo");//("アモ");    
      new ReadParseJP("オバデヤ書").readline("oba");//("オバ");    
      new ReadParseJP("ヨナ書").readline("jon");//("ヨナ");    
      new ReadParseJP("ミカ書").readline("mic");//("ミカ");    
      new ReadParseJP("ナホム書").readline("nah");//("ナホ");    
      new ReadParseJP("ハバクク書").readline("hab");//("ハバ");    
      new ReadParseJP("ゼファニヤ書").readline("zep");//("ゼファ");   
      new ReadParseJP("ハガイ書").readline("hag");//("ハガ");    
      new ReadParseJP("ゼカリヤ書").readline("zec");//("ゼカ");    
      new ReadParseJP("マラキ書").readline("mal");//("マラ");    

      new ReadParseJP("マタイによる福音書").readline("mat");//("マタ");    
      new ReadParseJP("マルコによる福音書").readline("mar");//("マコ");    
      new ReadParseJP("ルカによる福音書").readline("luk");//("ルカ");    
      new ReadParseJP("ヨハネによる福音書").readline("joh");//("ヨハ");    
      new ReadParseJP("使徒言行録").readline("act");//("使");     
      new ReadParseJP("ローマの信徒への手紙").readline("rom");//("ロマ");    
      new ReadParseJP("コリントの信徒への手紙一").readline("1co");//("Ⅰコリ");   
      new ReadParseJP("コリントの信徒への手紙二").readline("2co");//("Ⅱコリ");   
      new ReadParseJP("ガラテヤの信徒への手紙").readline("gal");//("ガラ");    
     new ReadParseJP("エフェソの信徒への手紙").readline("eph");//("エフェ");   
     new ReadParseJP("フィリピの信徒への手紙").readline("phl");//("フィリ");   
     new ReadParseJP("コロサイの信徒への手紙").readline("col");//("コロ");    
     new ReadParseJP("テサロニケの信徒への手紙一").readline("1th");//("Ⅰテサ");   
     new ReadParseJP("テサロニケの信徒への手紙二").readline("2th");//("Ⅱテサ");   
     new ReadParseJP("テモテへの手紙一").readline("1ti");//("Ⅰテモ");   
     new ReadParseJP("テモテへの手紙二").readline("2ti");//("Ⅱテモ");   
     new ReadParseJP("テトスへの手紙").readline("tit");//("テト");    
     new ReadParseJP("フィレモンへの手紙").readline("mon");//("フィレ");   
     new ReadParseJP("ヘブライ人への手紙").readline("heb");//("ヘブ");    
     new ReadParseJP("ヤコブの手紙").readline("jam");//("ヤコ");    
     new ReadParseJP("ペトロの手紙一").readline("1pe");//("Ⅰペト");   
     new ReadParseJP("ペトロの手紙二").readline("2pe");//("Ⅱペト");   
     new ReadParseJP("ヨハネの手紙一").readline("1jo");//("Ⅰヨハ");   
     new ReadParseJP("ヨハネの手紙二").readline("2jo");//("Ⅱヨハ");   
     new ReadParseJP("ヨハネの手紙三").readline("3jo");//("Ⅲヨハ");   
     new ReadParseJP("ユダの手紙").readline("jud");//("ユダ");    
     new ReadParseJP("ヨハネの黙示録").readline("rev");//("黙");

    }
}
