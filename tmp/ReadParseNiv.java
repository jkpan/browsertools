
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
        
        new ReadParseNiv("創世記").readline("創");
        new ReadParseNiv("出埃及記").readline("出");
        new ReadParseNiv("利未記").readline("利");
        new ReadParseNiv("民數記").readline("民");
        new ReadParseNiv("申命記").readline("申");
        new ReadParseNiv("約書亞記").readline("書");
        new ReadParseNiv("士師記").readline("士");
        new ReadParseNiv("路得記").readline("得");
        new ReadParseNiv("撒母耳記上").readline("撒上");
        new ReadParseNiv("撒母耳記下").readline("撒下");
        new ReadParseNiv("列王紀上").readline("王上");
        new ReadParseNiv("列王紀下").readline("王下");
        new ReadParseNiv("歷代志上").readline("代上");
        new ReadParseNiv("歷代志下").readline("代下");
        new ReadParseNiv("以斯拉記").readline("拉");
        new ReadParseNiv("尼希米記").readline("尼");
        new ReadParseNiv("以斯帖記").readline("斯");
        new ReadParseNiv("約伯記").readline("伯");
        new ReadParseNiv("詩篇").readline("詩");
        new ReadParseNiv("箴言").readline("箴");
        new ReadParseNiv("傳道書").readline("傳");
        new ReadParseNiv("雅歌").readline("歌");
        new ReadParseNiv("以賽亞書").readline("賽");
        new ReadParseNiv("耶利米書").readline("耶");
        new ReadParseNiv("耶利米哀歌").readline("哀");
        new ReadParseNiv("以西結書").readline("結");
        new ReadParseNiv("但以理書").readline("但");
        new ReadParseNiv("何西阿書").readline("何");
        new ReadParseNiv("約珥書").readline("珥");
        new ReadParseNiv("阿摩司書").readline("摩");
        new ReadParseNiv("俄巴底亞書").readline("俄");
        new ReadParseNiv("約拿書").readline("拿");
        new ReadParseNiv("彌迦書").readline("彌");
        new ReadParseNiv("那鴻書").readline("鴻");
        new ReadParseNiv("哈巴谷書").readline("哈");
        new ReadParseNiv("西番雅書").readline("番");
        new ReadParseNiv("哈該書").readline("該");
        new ReadParseNiv("撒迦利亞書").readline("亞");
        new ReadParseNiv("瑪拉基書").readline("瑪");
        
        
        new ReadParseNiv("馬太福音").readline("太");
        new ReadParseNiv("馬可福音").readline("可");
        new ReadParseNiv("路加福音").readline("路");
        new ReadParseNiv("約翰福音").readline("約");
        new ReadParseNiv("使徒行傳").readline("徒");
        new ReadParseNiv("羅馬書").readline("羅");
        new ReadParseNiv("哥林多前書").readline("林前");
        new ReadParseNiv("哥林多後書").readline("林後");
        new ReadParseNiv("加拉太書").readline("加");
        new ReadParseNiv("以弗所書").readline("弗");
        new ReadParseNiv("腓立比書").readline("腓");
        new ReadParseNiv("歌羅西書").readline("西");
        new ReadParseNiv("帖撒羅尼迦前書").readline("帖前");
        new ReadParseNiv("帖撒羅尼迦後書").readline("帖後");
        new ReadParseNiv("提摩太前書").readline("提前");
        new ReadParseNiv("提摩太後書").readline("提後");
        new ReadParseNiv("提多書").readline("多");
        new ReadParseNiv("腓利門書").readline("門");
        new ReadParseNiv("希伯來書").readline("來");
        new ReadParseNiv("雅各書").readline("雅");
        new ReadParseNiv("彼得前書").readline("彼前");
        new ReadParseNiv("彼得後書").readline("彼後");
        new ReadParseNiv("約翰壹書").readline("約一");
        new ReadParseNiv("約翰貳書").readline("約二");
        new ReadParseNiv("約翰參書").readline("約三");
        new ReadParseNiv("猶大書").readline("猶");
        new ReadParseNiv("啟示錄").readline("啟");
        
    }
}