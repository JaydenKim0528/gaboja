/**
 * @1900-2100년 사이의 양력 및 음력 상호 변환
 * @charset  UTF-8
 * @author  Ajing(JJonline@JJonline.Cn), 한국어 버전: [Your Name]
 * @Time  2014-7-21, 한국어 버전: 2024-9-4
 * @Version  $ID$
 * @양력을 음력으로 변환: solarLunar.solar2lunar(1987,11,01); //[접두사 0을 생략 가능]
 * @음력을 양력으로 변환: solarLunar.lunar2solar(1987,09,10); //[접두사 0을 생략 가능]
 */

/*import lunarInfo from '../const/lunarInfo';
import solarMonth from '../const/solarMonth';
import gan from '../const/gan';
import zhi from '../const/zhi';
import animals from '../const/animals';
import lunarTerm from '../const/lunarTerm';
import lTermInfo from '../const/lTermInfo';
import nStr1 from '../const/nStr1';
import nStr2 from '../const/nStr2';
import nStr3 from '../const/nStr3';
import nStr4 from '../const/nStr4';*/

const solarLunar = {
  lunarInfo,
  solarMonth,
  gan,
  zhi,
  animals,
  lunarTerm,
  lTermInfo,
  nStr1,
  nStr2,
  nStr3,
  nStr4,
  /**
   * 주어진 음력 연도의 전체 일수를 반환
   * @param lunar Year
   * @return Number
   * @eg:var count = solarLunar.lYearDays(1987) ;//count=387
   */
  lYearDays: function (y) {
    var i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (solarLunar.lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return (sum + solarLunar.leapDays(y));
  },

  /**
   * 주어진 음력 연도의 윤달이 몇 월인지 반환; 윤달이 없으면 0 반환
   * @param lunar Year
   * @return Number (0-12)
   * @eg:var leapMonth = solarLunar.leapMonth(1987) ;//leapMonth=6
   */
  leapMonth: function (y) {
    return (solarLunar.lunarInfo[y - 1900] & 0xf);
  },

  /**
   * 주어진 음력 연도의 윤달 일수를 반환; 윤달이 없으면 0 반환
   * @param lunar Year
   * @return Number (0, 29, 30)
   * @eg:var leapMonthDay = solarLunar.leapDays(1987) ;//leapMonthDay=29
   */
  leapDays: function (y) {
    if (solarLunar.leapMonth(y)) {
      return ((solarLunar.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
    }
    return (0);
  },

  /**
   * 주어진 음력 연도의 특정 월(윤달 아님)의 전체 일수를 반환, 윤달일 경우 leapDays 메서드 사용
   * @param lunar Year
   * @param lunar Month
   * @return Number (-1, 29, 30)
   * @eg:var MonthDay = solarLunar.monthDays(1987,9) ;//MonthDay=29
   */
  monthDays: function (y, m) {
    if (m > 12 || m < 1) {
      return -1;
    } // 월은 1부터 12까지, 잘못된 값일 경우 -1 반환
    return ((solarLunar.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
  },

  /**
   * 주어진 양력 연도 및 월의 일수를 반환
   * @param solar Year
   * @param solar Month
   * @return Number (-1, 28, 29, 30, 31)
   * @eg:var solarMonthDay = solarLunar.solarDays(1987, 2) ;//solarMonthDay=28
   */
  solarDays: function (y, m) {
    if (m > 12 || m < 1) {
      return -1;
    } // 잘못된 매개변수는 -1 반환
    var ms = m - 1;
    if (ms == 1) { // 2월의 경우 윤년을 고려하여 28일 또는 29일 반환
      return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
    } else {
      return (solarLunar.solarMonth[ms]);
    }
  },

  /**
   * 주어진 offset에 따른 천간과 지지 반환
   * @param offset 기준점으로부터의 오프셋
   * @return Cn string
   */
  toGanZhi: function (offset) {
    return (solarLunar.gan[offset % 10] + solarLunar.zhi[offset % 12]);
  },

  /**
   * 주어진 양력 연도에 해당하는 절기의 날짜 반환
   * @param y 양력 연도 (1900-2100)
   * @param n 절기의 번호 (1~24)
   * @return number Number
   * @eg:var _24 = solarLunar.getTerm(1987, 3) ;//_24=4; 즉 1987년 2월 4일 입춘
   */
  getTerm: function (y, n) {
    if (y < 1900 || y > 2100) {
      return -1;
    }
    if (n < 1 || n > 24) {
      return -1;
    }
    var _table = solarLunar.lTermInfo[y - 1900];
    var _info = [
      parseInt('0x' + _table.substr(0, 5)).toString(),
      parseInt('0x' + _table.substr(5, 5)).toString(),
      parseInt('0x' + _table.substr(10, 5)).toString(),
      parseInt('0x' + _table.substr(15, 5)).toString(),
      parseInt('0x' + _table.substr(20, 5)).toString(),
      parseInt('0x' + _table.substr(25, 5)).toString()
    ];
    var _calDay = [
      _info[0].substr(0, 1),
      _info[0].substr(1, 2),
      _info[0].substr(3, 1),
      _info[0].substr(4, 2),

      _info[1].substr(0, 1),
      _info[1].substr(1, 2),
      _info[1].substr(3, 1),
      _info[1].substr(4, 2),

      _info[2].substr(0, 1),
      _info[2].substr(1, 2),
      _info[2].substr(3, 1),
      _info[2].substr(4, 2),

      _info[3].substr(0, 1),
      _info[3].substr(1, 2),
      _info[3].substr(3, 1),
      _info[3].substr(4, 2),

      _info[4].substr(0, 1),
      _info[4].substr(1, 2),
      _info[4].substr(3, 1),
      _info[4].substr(4, 2),

      _info[5].substr(0, 1),
      _info[5].substr(1, 2),
      _info[5].substr(3, 1),
      _info[5].substr(4, 2)
    ];
    return parseInt(_calDay[n - 1]);
  },

  /**
   * 음력 연도를 한글 표현으로 변환
   * @param lunar year
   * @return string
   */
  toKoreanYear: function (y) {
    var oxxx = parseInt(y / 1000);
    var xoxx = parseInt(y % 1000 / 100);
    var xxox = parseInt(y % 100 / 10);
    var xxxo = y % 10;

    return solarLunar.nStr4[oxxx] + solarLunar.nStr4[xoxx] + solarLunar.nStr4[xxox] + solarLunar.nStr4[xxxo] + "년";
  },

  /**
   * 음력 월을 한글 표현으로 변환
   * @param lunar month
   * @return number string
   */
  toKoreanMonth: function (m) {
    if (m > 12 || m < 1) {
      return -1;
    }
    var s = solarLunar.nStr3[m - 1];
    s += "월";
    return s;
  },

  /**
   * 음력 날짜를 한글 표현으로 변환
   * @param lunar day
   * @return Cn string
   */
  toKoreanDay: function (d) {
    var s;
    switch (d) {
      case 10:
        s = '초십';
        break;
      case 20:
        s = '이십';
        break;
      case 30:
        s = '삼십';
        break;
      default:
        s = solarLunar.nStr2[Math.floor(d / 10)];
        s += solarLunar.nStr1[d % 10];
    }
    return s;
  },

  /**
   * 주어진 연도의 십이간지 반환 (정확한 기준은 '입춘')
   * @param y year
   * @return string
   */
  getZodiac: function (y) {
    return solarLunar.animals[(y - 4) % 12];
  },

  /**
   * 양력 날짜를 입력받아 양력 및 음력 정보를 반환
   * @param y solar year
   * @param m solar month
   * @param d solar day
   * @return JSON object
   * @eg:console.log(solarLunar.solar2lunar(1987, 11, 01));
   */
  solar2lunar: function (y, m, d) {
    if (y < 1900 || y > 2100) {
      return -1;
    }
    if (y == 1900 && m == 1 && d < 31) {
      return -1;
    }
    if (!y) {
      var objDate = new Date();
    } else {
      var objDate = new Date(y, parseInt(m) - 1, d);
    }
    var i, leap = 0, temp = 0;
    var y = objDate.getFullYear(), m = objDate.getMonth() + 1, d = objDate.getDate();
    var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = solarLunar.lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }

    var isTodayObj = new Date(), isToday = false;
    if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
      isToday = true;
    }
    var nWeek = objDate.getDay(), cWeek = solarLunar.nStr1[nWeek];
    if (nWeek == 0) {
      nWeek = 7;
    }
    var year = i;
    var leap = solarLunar.leapMonth(i);
    var isLeap = false;

    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i == (leap + 1) && isLeap == false) {
        --i;
        isLeap = true;
        temp = solarLunar.leapDays(year);
      } else {
        temp = solarLunar.monthDays(year, i);
      }
      if (isLeap == true && i == (leap + 1)) {
        isLeap = false;
      }
      offset -= temp;
    }

    if (offset == 0 && leap > 0 && i == leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
      }
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }
    var month = i;
    var day = offset + 1;

    var sm = m - 1;
    var term3 = solarLunar.getTerm(y, 3);
    var gzY = solarLunar.toGanZhi(y - 4);
    var termTimestamp = new Date(y, 1, term3).getTime();
    var dayTimestamp = new Date(y, sm, d).getTime();
    if (dayTimestamp < termTimestamp) {
      gzY = solarLunar.toGanZhi(y - 5);
    }

    var firstNode = solarLunar.getTerm(y, (m * 2 - 1));
    var secondNode = solarLunar.getTerm(y, (m * 2));

    var gzM = solarLunar.toGanZhi((y - 1900) * 12 + m + 11);
    if (d >= firstNode) {
      gzM = solarLunar.toGanZhi((y - 1900) * 12 + m + 12);
    }

    var isTerm = false;
    var term = "";
    if (firstNode == d) {
      isTerm = true;
      term = solarLunar.lunarTerm[m * 2 - 2];
    }
    if (secondNode == d) {
      isTerm = true;
      term = solarLunar.lunarTerm[m * 2 - 1];
    }
    var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
    var gzD = solarLunar.toGanZhi(dayCyclical + d - 1);
    return {
      'lYear': year,
      'lMonth': month,
      'lDay': day,
      'animal': solarLunar.getZodiac(year),
      'yearCn': solarLunar.toKoreanYear(year),
      'monthCn': (isLeap && leap === month ? "윤" : '') + solarLunar.toKoreanMonth(month),
      'dayCn': solarLunar.toKoreanDay(day),
      'cYear': y,
      'cMonth': m,
      'cDay': d,
      'gzYear': gzY,
      'gzMonth': gzM,
      'gzDay': gzD,
      'isToday': isToday,
      'isLeap': isLeap,
      'nWeek': nWeek,
      'ncWeek': "요일 " + cWeek,
      'isTerm': isTerm,
      'term': term
    };
  },

  /**
   * 음력 날짜를 입력받아 양력 날짜로 변환
   * @param y lunar year
   * @param m lunar month
   * @param d lunar day
   * @param isLeapMonth  lunar month is leap or not.
   * @return JSON object
   * @eg:console.log(solarLunar.lunar2solar(1987, 9, 10));
   */
  lunar2solar: function (y, m, d, isLeapMonth) {
    var leapOffset = 0;
    var leapMonth = solarLunar.leapMonth(y);
    var leapDay = solarLunar.leapDays(y);
    if (isLeapMonth && (leapMonth != m)) {
      return -1;
    }
    if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) {
      return -1;
    }
    var day = solarLunar.monthDays(y, m);
    if (y < 1900 || y > 2100 || d > day) {
      return -1;
    }

    var offset = 0;
    for (var i = 1900; i < y; i++) {
      offset += solarLunar.lYearDays(i);
    }
    var leap = 0, isAdd = false;
    for (var i = 1; i < m; i++) {
      leap = solarLunar.leapMonth(y);
      if (!isAdd) {
        if (leap <= i && leap > 0) {
          offset += solarLunar.leapDays(y);
          isAdd = true;
        }
      }
      offset += solarLunar.monthDays(y, i);
    }
    if (isLeapMonth) {
      offset += day;
    }
    var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
    var calObj = new Date((offset + d - 31) * 86400000 + stmap);
    var cY = calObj.getUTCFullYear();
    var cM = calObj.getUTCMonth() + 1;
    var cD = calObj.getUTCDate();

    return solarLunar.solar2lunar(cY, cM, cD);
  }
};

export default solarLunar;
