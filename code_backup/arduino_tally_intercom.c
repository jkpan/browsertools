#include <Arduino.h>
#include <HTTPClient.h>

#include <M5StickCPlus.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <Preferences.h>
#include <SkaarhojPgmspace.h>
#include <ATEMbase.h>
#include <ATEMstd.h>
#include <map>

#include "config.hpp"

#define LED_PIN 10 // see https://github.com/m5stack/M5StickC#pinmap

//#define CMDURL "http://192.168.30.146/cmd?cc="
//#define SSID "AOG-2F"
//#define PASS "0223210665"
#define CMDURL "http://192.168.0.71/cmd?cc="
#define SSID "jkpan home"
#define PASS "X25031710"

Preferences preferences;
ATEMstd AtemSwitcher;
WiFiMulti wifiMulti;
HTTPClient http;

int input = 4;
int label = 4;
int previousInput = input;
int previousLabel = label;

boolean previousInputIsProgram = false;
boolean previousInputIsPreview = false;

int orientation = INITIAL_ORIENTATION;
int previousOrientation = orientation;

typedef std::map<char*, char*> Dictionary;
Dictionary conn_array[] = { 
                            { {"SSID", SSID}, {"PASS", PASS} }
                          };

unsigned long lastOrientationUpdate = millis();
bool initialed = false;
String result = "";
int count = 0;

void doQuery() {

  //if ((wifiMulti.run() == WL_CONNECTED)) {}

    String urlStr = CMDURL;
    urlStr = urlStr + input;
    result = "";

    http.begin(urlStr);

    int httpCode = http.GET();
    
    // start connection and send HTTP header.
    // 开始连接服务器并发送HTTP的标头
    if (httpCode > 0) {  // httpCode will be negative on error.  出错时httpCode将为负值
      if (httpCode == HTTP_CODE_OK) {  // file found at server.  在服务器上找到文件
        result = result + http.getString();
      } else {
        result = result + " Fail " + httpCode;
      }
    } else {
      result  = result + " Fail:" + httpCode;
    }

    http.end();

}



void setup() {
  // Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
	digitalWrite(LED_PIN, HIGH); // LOW = on, HIGH = off

	preferences.begin("tally", false);

	input = preferences.getInt("input", 1);
	label = preferences.getInt("label", 1);
  orientation = preferences.getInt("orientation", INITIAL_ORIENTATION);

	M5.begin(true, true, false);
	M5.IMU.Init();
	M5.Lcd.setRotation(orientation);
  M5.Lcd.setTextSize(2);
  
  
  bool wifi_connected = false;

  for(int i = 0; i< sizeof(conn_array); i++ ) {
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setCursor(0, 0);
    M5.Lcd.printf("Connecting to\n%s: ", conn_array[i]["SSID"]);
    int loop = 0;
    WiFi.begin(conn_array[i]["SSID"], conn_array[i]["PASS"]);
    while (WiFi.status() != WL_CONNECTED) {
      loop++;
      M5.Lcd.printf(".");
      delay(500);
      if(loop == 10) {
        M5.Lcd.printf("\n");
        break;
      }
    }
    if (WiFi.status() == WL_CONNECTED) {
      wifi_connected = true;
      break;
    }
  }

  if (!wifi_connected) {
    M5.Lcd.printf("Cannot connect to any WiFi, power off after 5 seconds...");
    delay(5000);
    M5.Axp.PowerOff();
  }
    
  //wifiMulti.addAP(SSID, PASS);

	// M5.Lcd.printf("Connecting to\n%s: ", SSID);

	// WiFi.begin(SSID, PASS);
	// while (WiFi.status() != WL_CONNECTED)
	// {
	// 	delay(500);
	// }

	M5.Lcd.printf(" done\n");

	M5.Lcd.printf("Connecting to ATEM\n<%d.%d.%d.%d>: ", SWITCHER_IP[0], SWITCHER_IP[1], SWITCHER_IP[2], SWITCHER_IP[3]);

	AtemSwitcher.begin(SWITCHER_IP);
	AtemSwitcher.connect();

	M5.Lcd.printf("done\n");

	delay(3000);
}

void loop() {

  count = (count+1)%10;

	M5.update();

	if (AUTOUPDATE_ORIENTATION)
	{
		if (lastOrientationUpdate + 500 < millis())
		{
			updateOrientation();
			lastOrientationUpdate = millis();
		}
	}

	if (M5.BtnA.wasPressed())
	{
		input = (input % NUM_INPUTS) + 1;
		preferences.putInt("input", input);
		label = (label % NUM_LABELS) + 1;
		preferences.putInt("label", label);
		//updateOrientation();
	}
	if (M5.BtnB.wasPressed())
	{
    // Press BtnB will change the orientation.
    orientation = (orientation % 4) +1;
    RenderOrientation((orientation % 4)+1);
		//updateOrientation();
	}
  if (M5.BtnA.isPressed() && M5.BtnB.isPressed())
  {
    // If this 2 button is pressed at the same time, reset all the variables
    input = 1;
    label = 1;
    orientation = INITIAL_ORIENTATION;
    preferences.putInt("input", input);
    preferences.putInt("label", label);
    RenderOrientation(orientation);    
  }

  String pre = result;
  doQuery();

	AtemSwitcher.runLoop();

	boolean inputIsProgram = AtemSwitcher.getProgramTally(input);
	boolean inputIsPreview = AtemSwitcher.getPreviewTally(input);

  //
	if (result.compareTo(pre)!=0 || (input != previousInput) || (label != previousLabel) || (inputIsProgram != previousInputIsProgram) || (inputIsPreview != previousInputIsPreview) || (orientation != previousOrientation) || !initialed)
	{
    if(!initialed)
    {
      initialed = true;
    }
		if (inputIsProgram && inputIsPreview)
		{
			render(input, label, RED, GREEN, LOW);
		}
		else if (inputIsProgram)
		{
			render(input, label, RED, BLACK, LOW);
		}
		else if (inputIsPreview)
		{
			render(input, label, GREEN, BLACK, HIGH);
		}
		else
		{
			render(input, label, BLACK, LEMON, HIGH);
		}
	}

  //render(input, label, BLACK, LEMON, HIGH);

	previousInput = input;
	previousLabel = label;
	previousInputIsProgram = inputIsProgram;
	previousInputIsPreview = inputIsPreview;
	previousOrientation = orientation;

  delay(200);

}


void render(int input, int label, unsigned long int screenColor, unsigned long int labelColor, bool ledValue) {

	digitalWrite(LED_PIN, ledValue);

	M5.Lcd.fillScreen(screenColor);
	M5.Lcd.setTextColor(labelColor, screenColor);

	M5.Lcd.setTextDatum(TL_DATUM);
	M5.Lcd.drawString(String(input), 1, 1, 1);

	M5.Lcd.setTextDatum(MC_DATUM);
  
  /*
	M5.Lcd.drawString(String(label), M5.Lcd.width() / 4, M5.Lcd.height() / 2 + 2, 7);
  if (result.compareTo(".") != 0) {
    M5.Lcd.fillRect(M5.Lcd.width()/2, 0, M5.Lcd.width()/2, M5.Lcd.height(), BLUE);
    M5.Lcd.drawString(String(result), 
                      M5.Lcd.width() * 3 / 4, 
                      M5.Lcd.height() / 2 + 2, 
                      2);
  } 
  */

  M5.Lcd.drawString(String(label), M5.Lcd.width() / 2, M5.Lcd.height() / 3-2, 7);
  if (result.compareTo(".") != 0) {
    M5.Lcd.fillRect(0, M5.Lcd.height()*2/3, M5.Lcd.width(), M5.Lcd.height()/3, BLUE);
    M5.Lcd.drawString(String(result), 
                      M5.Lcd.width()/2, 
                      M5.Lcd.height() *5 / 6, 
                      2);
  } 

  //M5.Lcd.setTextDatum(BR_DATUM);
  //M5.Lcd.drawString(String(count), M5.Lcd.width()-2, M5.Lcd.height()-2, 2);

	float voltage = M5.Axp.GetBatVoltage();
	float current = M5.Axp.GetBatCurrent();

	char batteryStatus[9];
	char chargingIcon = current == 0 ? ' ' : (current > 0 ? '+' : '-');
	sprintf(batteryStatus, "%c %.2fV", chargingIcon, voltage);

	M5.Lcd.setTextDatum(TR_DATUM);
	M5.Lcd.drawString(batteryStatus, M5.Lcd.width() - 1, 1, 1);
}

void updateOrientation()
{
	float accX = 0, accY = 0, accZ = 0;

	M5.IMU.getAccelData(&accX, &accY, &accZ);

	if (accZ < .9)
	{
		if (accX > .6)
		{
			orientation = 1;
		}
		else if (accX < .4 && accX > -.5)
		{
			if (accY > 0)
			{
				orientation = 0;
			}
			else
			{
				orientation = 2;
			}
		}
		else
		{
			orientation = 3;
		}
	}

	if (orientation != previousOrientation)
	{
		M5.Lcd.setRotation(orientation);
	}
}

void RenderOrientation(int orientation)
{
  preferences.putInt("orientation", orientation);
  M5.Lcd.setRotation(orientation);
}
