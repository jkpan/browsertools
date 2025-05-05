/*
 * 語音辨識相關
 */

var recogResult = '';
var recognizing = false;
var recognition;

function parseRecogResult() {

  console.log('parseRecogResult...' + recogResult);

  if (recogResult.length == 0) return;
  let result = [SONGS[song][0][0], 0, 0];
  let RecogResult = recogResult;

  RecogResult = RecogResult.replace('創世紀', '創世記');
  RecogResult = RecogResult.replace('列王記', '列王紀');
  RecogResult = RecogResult.replace('生命記', '申命記');
  RecogResult = RecogResult.replace('誌', '志');
  RecogResult = RecogResult.replace('約翰一', '約翰壹');
  RecogResult = RecogResult.replace('約翰二', '約翰貳');
  RecogResult = RecogResult.replace('約翰三', '約翰參');

  let vol = 0;
  for (let i = 1; i < fullname.length; i++) {
    let _vol = fullname[i];
    let idx = RecogResult.indexOf(_vol);
    if (idx !== -1) {
      vol = i;
      result[0] = _vol;
      RecogResult = RecogResult.substring(idx);
      break;
    }
  }

  if (vol == 0) return;

  console.log(RecogResult);

  RecogResult = RecogResult.replaceAll('一', '1');
  RecogResult = RecogResult.replaceAll('二', '2');
  RecogResult = RecogResult.replaceAll('三', '3');
  RecogResult = RecogResult.replaceAll('四', '4');
  RecogResult = RecogResult.replaceAll('五', '5');
  RecogResult = RecogResult.replaceAll('六', '6');
  RecogResult = RecogResult.replaceAll('七', '7');
  RecogResult = RecogResult.replaceAll('八', '8');
  RecogResult = RecogResult.replaceAll('九', '9');
  RecogResult = RecogResult.replaceAll('十', '10');
  //RecogResult = RecogResult.replaceAll('篇', ' ');
  //RecogResult = RecogResult.replaceAll('章', ' ');
  //RecogResult = RecogResult.replaceAll('節', '');
  //RecogResult = RecogResult.replaceAll('第', '');
  //RecogResult = RecogResult.trim();

  console.log(RecogResult);


  ///////
  //txt = "今天是2024年6月19日";
  let numbers = RecogResult.match(/\d+/g);
  if (numbers) {
    console.log(numbers);  // 输出: ["2024", "6", "19"]
    if (numbers.length >= 1) {
      result[1] = numbers[0];
    }
    if (numbers.length >= 2) {
      result[2] = numbers[1];
    }
  }
  /////////

  console.log(result);

  var userConfirmed = confirm(`${result[0]} ${result[1]}:${result[2]} ?`);
  if (userConfirmed) {
    jump2preset(result);
  }

}

// 檢查瀏覽器是否為 Safari
// 1: safari
// 0: chrome
// -1: others
function isSafariBrowser() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) //safari的ua只有'safari'
    return 1;
  if (ua.indexOf('chrome') !== -1) //chrome 的 ua 'safari' 'chrome' 都有
    return 0;
  return -1;
}

function initRecognition() {

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'cmn-Hant-TW';//'zh-TW';//'en-US';'en-US';'cmn-Hant-TW';
  //recognition.interimResults = false;
  recognition.maxAlternatives = 1;


  if (navigator.userAgent.indexOf("Chrome") != -1) {
    var speechRecognitionList = new webkitSpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar volumes; public <volume> = ' + fullname.join(' | ') + ' ;';
    speechRecognitionList.addFromString(grammar, 1.0);
    recognition.grammars = speechRecognitionList;
  }


  recognition.onstart = function () {
    recognizing = true;
    console.log('info_speak_now');
    recogResult = '';
    _repaint();
  };

  recognition.onerror = function (event) {

    recognizing = false;
    recogResult = '';

    if (event.error == 'no-speech') {
      console.log('info_no_speech');
    }
    if (event.error == 'audio-capture') {
      console.log('info_no_microphone');
    }
    if (event.error == 'not-allowed') {
      console.log('not-allowed');
    }

    _repaint();

  };

  recognition.onend = function () {
    parseRecogResult();
    recognizing = false;
    recogResult = '';
    console.log('onend'); //
    _repaint();
  };

  recognition.onresult = function (event) {

    if (typeof (event.results) == 'undefined') {
      console.log('onresult undefined');
      recognition.onend = null;
      recognition.stop();
      return;
    }

    recogResult = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        recogResult += event.results[i][0].transcript;
        console.log('onresult isfinal: ' + recogResult);
      } else {
        recogResult += event.results[i][0].transcript;
        console.log('onresult not isfinal: ' + recogResult);
      }
    }
    console.log('onresult: ' + recogResult);
    _repaint();
  };

}

function voiceChkActive() {
  switch (isSafariBrowser()) {
    case 0: initRecognition(); break;
    case 1: console.log('瀏覽器是 Safari'); break;
    default: console.log('其他瀏覽器'); break;
  }
}

var utter;// = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis
//SpeechSynthesis.cancel()－取消所有 utterances，也就是停止閱讀
//SpeechSynthesis.getVoices()－取得目前可使用的語音列表
//SpeechSynthesis.pause()－暫停閱讀 utterances
//SpeechSynthesis.resume()－繼續閱讀 utterances
//SpeechSynthesis.speak()－閱讀所指定的 utterances

function readingEventEnd(evt) {
  //console.log('Finished in ' + evt.elapsedTime + ' seconds.');
  let _phase = phase;
  let _line = line;
  keyboard({ code: 'ArrowRight', keyCode: 39 });
  if (phase != _phase || line != _line) {
    speakCurrent();
  } else {
    stopReading();
  }
}

function switchVoice2Chinese() {
  initutter();
  utter.lang = 'zh-TW';
}

function switchVoice2English() {
  initutter();
  utter.lang = 'en-US';
}

function initutter() {
  if (utter) return;
  utter = new SpeechSynthesisUtterance();
  utter.lang = 'zh-TW';//'en-US';// //'zh-CN';
  //utter.removeEventListener();
  //startReading();
  //utter.pitch
  //SpeechSynthesisUtterance.rate
  //SpeechSynthesisUtterance.voice
  //SpeechSynthesisUtterance.volume
}

function speak(text) {
  initutter();
  utter.text = text;
  synth.speak(utter);
}

function stopSpeak() {
  if (synth.speaking) {
    synth.cancel();
    return true;
  }
  return false;
}


function startReading() {
  initutter();
  speakCurrent();
  utter.addEventListener('end', readingEventEnd);
}

function stopReading() {
  if (synth.speaking) {
    synth.cancel();
  }
  utter.removeEventListener('end', readingEventEnd);
}

/*
  synth.addEventListener('voiceschanged', () => {
    console.log('--voiceschanged event triggered--')
    console.log(synth.getVoices())
  });
*/

