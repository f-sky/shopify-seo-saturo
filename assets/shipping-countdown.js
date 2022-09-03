/*
countdown.js v2.6.0 http://countdownjs.org
Copyright (c)2006-2014 Stephen M. McKamey.
Licensed under The MIT License.
*/
var module,countdown=function(v){function A(a,b){var c=a.getTime();a.setMonth(a.getMonth()+b);return Math.round((a.getTime()-c)/864E5)}function w(a){var b=a.getTime(),c=new Date(b);c.setMonth(a.getMonth()+1);return Math.round((c.getTime()-b)/864E5)}function x(a,b){b=b instanceof Date||null!==b&&isFinite(b)?new Date(+b):new Date;if(!a)return b;var c=+a.value||0;if(c)return b.setTime(b.getTime()+c),b;(c=+a.milliseconds||0)&&b.setMilliseconds(b.getMilliseconds()+c);(c=+a.seconds||0)&&b.setSeconds(b.getSeconds()+
  c);(c=+a.minutes||0)&&b.setMinutes(b.getMinutes()+c);(c=+a.hours||0)&&b.setHours(b.getHours()+c);(c=+a.weeks||0)&&(c*=7);(c+=+a.days||0)&&b.setDate(b.getDate()+c);(c=+a.months||0)&&b.setMonth(b.getMonth()+c);(c=+a.millennia||0)&&(c*=10);(c+=+a.centuries||0)&&(c*=10);(c+=+a.decades||0)&&(c*=10);(c+=+a.years||0)&&b.setFullYear(b.getFullYear()+c);return b}function D(a,b){return y(a)+(1===a?p[b]:q[b])}function n(){}function k(a,b,c,e,l,d){0<=a[c]&&(b+=a[c],delete a[c]);b/=l;if(1>=b+1)return 0;if(0<=a[e]){a[e]=
  +(a[e]+b).toFixed(d);switch(e){case "seconds":if(60!==a.seconds||isNaN(a.minutes))break;a.minutes++;a.seconds=0;case "minutes":if(60!==a.minutes||isNaN(a.hours))break;a.hours++;a.minutes=0;case "hours":if(24!==a.hours||isNaN(a.days))break;a.days++;a.hours=0;case "days":if(7!==a.days||isNaN(a.weeks))break;a.weeks++;a.days=0;case "weeks":if(a.weeks!==w(a.refMonth)/7||isNaN(a.months))break;a.months++;a.weeks=0;case "months":if(12!==a.months||isNaN(a.years))break;a.years++;a.months=0;case "years":if(10!==
  a.years||isNaN(a.decades))break;a.decades++;a.years=0;case "decades":if(10!==a.decades||isNaN(a.centuries))break;a.centuries++;a.decades=0;case "centuries":if(10!==a.centuries||isNaN(a.millennia))break;a.millennia++;a.centuries=0}return 0}return b}function B(a,b,c,e,l,d){var f=new Date;a.start=b=b||f;a.end=c=c||f;a.units=e;a.value=c.getTime()-b.getTime();0>a.value&&(f=c,c=b,b=f);a.refMonth=new Date(b.getFullYear(),b.getMonth(),15,12,0,0);try{a.millennia=0;a.centuries=0;a.decades=0;a.years=c.getFullYear()-
  b.getFullYear();a.months=c.getMonth()-b.getMonth();a.weeks=0;a.days=c.getDate()-b.getDate();a.hours=c.getHours()-b.getHours();a.minutes=c.getMinutes()-b.getMinutes();a.seconds=c.getSeconds()-b.getSeconds();a.milliseconds=c.getMilliseconds()-b.getMilliseconds();var g;0>a.milliseconds?(g=s(-a.milliseconds/1E3),a.seconds-=g,a.milliseconds+=1E3*g):1E3<=a.milliseconds&&(a.seconds+=m(a.milliseconds/1E3),a.milliseconds%=1E3);0>a.seconds?(g=s(-a.seconds/60),a.minutes-=g,a.seconds+=60*g):60<=a.seconds&&(a.minutes+=
  m(a.seconds/60),a.seconds%=60);0>a.minutes?(g=s(-a.minutes/60),a.hours-=g,a.minutes+=60*g):60<=a.minutes&&(a.hours+=m(a.minutes/60),a.minutes%=60);0>a.hours?(g=s(-a.hours/24),a.days-=g,a.hours+=24*g):24<=a.hours&&(a.days+=m(a.hours/24),a.hours%=24);for(;0>a.days;)a.months--,a.days+=A(a.refMonth,1);7<=a.days&&(a.weeks+=m(a.days/7),a.days%=7);0>a.months?(g=s(-a.months/12),a.years-=g,a.months+=12*g):12<=a.months&&(a.years+=m(a.months/12),a.months%=12);10<=a.years&&(a.decades+=m(a.years/10),a.years%=
  10,10<=a.decades&&(a.centuries+=m(a.decades/10),a.decades%=10,10<=a.centuries&&(a.millennia+=m(a.centuries/10),a.centuries%=10)));b=0;!(e&1024)||b>=l?(a.centuries+=10*a.millennia,delete a.millennia):a.millennia&&b++;!(e&512)||b>=l?(a.decades+=10*a.centuries,delete a.centuries):a.centuries&&b++;!(e&256)||b>=l?(a.years+=10*a.decades,delete a.decades):a.decades&&b++;!(e&128)||b>=l?(a.months+=12*a.years,delete a.years):a.years&&b++;!(e&64)||b>=l?(a.months&&(a.days+=A(a.refMonth,a.months)),delete a.months,
  7<=a.days&&(a.weeks+=m(a.days/7),a.days%=7)):a.months&&b++;!(e&32)||b>=l?(a.days+=7*a.weeks,delete a.weeks):a.weeks&&b++;!(e&16)||b>=l?(a.hours+=24*a.days,delete a.days):a.days&&b++;!(e&8)||b>=l?(a.minutes+=60*a.hours,delete a.hours):a.hours&&b++;!(e&4)||b>=l?(a.seconds+=60*a.minutes,delete a.minutes):a.minutes&&b++;!(e&2)||b>=l?(a.milliseconds+=1E3*a.seconds,delete a.seconds):a.seconds&&b++;if(!(e&1)||b>=l){var h=k(a,0,"milliseconds","seconds",1E3,d);if(h&&(h=k(a,h,"seconds","minutes",60,d))&&(h=
  k(a,h,"minutes","hours",60,d))&&(h=k(a,h,"hours","days",24,d))&&(h=k(a,h,"days","weeks",7,d))&&(h=k(a,h,"weeks","months",w(a.refMonth)/7,d))){e=h;var n,p=a.refMonth,q=p.getTime(),r=new Date(q);r.setFullYear(p.getFullYear()+1);n=Math.round((r.getTime()-q)/864E5);if(h=k(a,e,"months","years",n/w(a.refMonth),d))if(h=k(a,h,"years","decades",10,d))if(h=k(a,h,"decades","centuries",10,d))if(h=k(a,h,"centuries","millennia",10,d))throw Error("Fractional unit overflow");}}}finally{delete a.refMonth}return a}
  function d(a,b,c,e,d){var f;c=+c||222;e=0<e?e:NaN;d=0<d?20>d?Math.round(d):20:0;var k=null;"function"===typeof a?(f=a,a=null):a instanceof Date||(null!==a&&isFinite(a)?a=new Date(+a):("object"===typeof k&&(k=a),a=null));var g=null;"function"===typeof b?(f=b,b=null):b instanceof Date||(null!==b&&isFinite(b)?b=new Date(+b):("object"===typeof b&&(g=b),b=null));k&&(a=x(k,b));g&&(b=x(g,a));if(!a&&!b)return new n;if(!f)return B(new n,a,b,c,e,d);var k=c&1?1E3/30:c&2?1E3:c&4?6E4:c&8?36E5:c&16?864E5:6048E5,
  h,g=function(){f(B(new n,a,b,c,e,d),h)};g();return h=setInterval(g,k)}var s=Math.ceil,m=Math.floor,p,q,r,t,u,f,y,z;n.prototype.toString=function(a){var b=z(this),c=b.length;if(!c)return a?""+a:u;if(1===c)return b[0];a=r+b.pop();return b.join(t)+a};n.prototype.toHTML=function(a,b){a=a||"span";var c=z(this),e=c.length;if(!e)return(b=b||u)?"\x3c"+a+"\x3e"+b+"\x3c/"+a+"\x3e":b;for(var d=0;d<e;d++)c[d]="\x3c"+a+"\x3e"+c[d]+"\x3c/"+a+"\x3e";if(1===e)return c[0];e=r+c.pop();return c.join(t)+e};n.prototype.addTo=
  function(a){return x(this,a)};z=function(a){var b=[],c=a.millennia;c&&b.push(f(c,10));(c=a.centuries)&&b.push(f(c,9));(c=a.decades)&&b.push(f(c,8));(c=a.years)&&b.push(f(c,7));(c=a.months)&&b.push(f(c,6));(c=a.weeks)&&b.push(f(c,5));(c=a.days)&&b.push(f(c,4));(c=a.hours)&&b.push(f(c,3));(c=a.minutes)&&b.push(f(c,2));(c=a.seconds)&&b.push(f(c,1));(c=a.milliseconds)&&b.push(f(c,0));return b};d.MILLISECONDS=1;d.SECONDS=2;d.MINUTES=4;d.HOURS=8;d.DAYS=16;d.WEEKS=32;d.MONTHS=64;d.YEARS=128;d.DECADES=256;
  d.CENTURIES=512;d.MILLENNIA=1024;d.DEFAULTS=222;d.ALL=2047;var E=d.setFormat=function(a){if(a){if("singular"in a||"plural"in a){var b=a.singular||[];b.split&&(b=b.split("|"));var c=a.plural||[];c.split&&(c=c.split("|"));for(var d=0;10>=d;d++)p[d]=b[d]||p[d],q[d]=c[d]||q[d]}"string"===typeof a.last&&(r=a.last);"string"===typeof a.delim&&(t=a.delim);"string"===typeof a.empty&&(u=a.empty);"function"===typeof a.formatNumber&&(y=a.formatNumber);"function"===typeof a.formatter&&(f=a.formatter)}},C=d.resetFormat=
  function(){p=" millisecond; second; minute; hour; day; week; month; year; decade; century; millennium".split(";");q=" milliseconds; seconds; minutes; hours; days; weeks; months; years; decades; centuries; millennia".split(";");r=" and ";t=", ";u="";y=function(a){return a};f=D};d.setLabels=function(a,b,c,d,f,k,m){E({singular:a,plural:b,last:c,delim:d,empty:f,formatNumber:k,formatter:m})};d.resetLabels=C;C();v&&v.exports?v.exports=d:"function"===typeof window.define&&"undefined"!==typeof window.define.amd&&
  window.define("countdown",[],function(){return d});return d}(module);

(function() { // IIAF starts
  let $ = jQuery;

  let countdown_exclucsion_list = {
    "weekdays": ["SAT", "SUN"],
    "start_hour_minute": 0,
    "till_1330_hour_minute": 810,
    "till_2359_hour_minute": 1439,
    "static_hoidays": ["01.01", "06.01", "01.05", "15.08", "26.10", "01.11", "08.12", "24.12", "25.12", "26.12", "31.12"],
    "yearly_exclusion" : {
      "2020": ["05.04", "13.05", "24.05", "03.06"],
      "2021": ["18.04", "26.05", "06.06", "16.06"],
    }
  }

  function get_current_time_in_AT() {
      const currentTime = {
        current_time: (Number(serverTime.hour) * 60) + Number(serverTime.minute),
        weekday: serverTime.weekday.toUpperCase(),
        ...serverTime
        }
        return currentTime;
  }

  function get_cut_off_time_in_AT(hour, minute, second) {
    let cut_off_hour = hour;
    let cut_off_minute = minute;
    let cut_off_second = second;
    let cut_off_time = {};

    cut_off_time.hours_minutes = (Number(cut_off_hour) * 60) + Number(cut_off_minute);

    let options = {
        timeZone: 'Europe/Berlin',
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric',
        hour12: false,
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric',
        timeZoneName: 'short'
    }

    cut_off_time.date_string = new Intl.DateTimeFormat("en-US", options).formatToParts().map((el) => {
      if (el.type == 'hour') {
        el.value = cut_off_hour
        return el;
      } else if (el.type == 'minute') {
        el.value = cut_off_minute;
        return el;
      } else if (el.type == 'second') {
        el.value = cut_off_second;
        return el;				
      } else {
        return el;
      }
    });

    cut_off_time.date_string = cut_off_time.date_string.reduce((ac, el) => {
      return ac + el.value;
    }, "");

    return cut_off_time;
  }

  function error_handle(error) {
      console.log(error);
      return error;
  }		

  function init_countdown() {
    let count_down_container = $('[data-count-down-time]');
    let count_down_container_parent = count_down_container.closest('[data-count-down-parent]');
    let shipping_label_wrapper = $('[data-package-text]');
    let shipping_label_before_1330_text = 'und deine Bestellung wird heute verschickt.';
    let shipping_label_after_1330_text = 'und deine Bestellung wird morgen verschickt.';

    let time_till_1330 = Date.parse(get_cut_off_time_in_AT("13", "30", "00").date_string);
    let time_till_2359 = Date.parse(get_cut_off_time_in_AT("23", "59", "00").date_string);
    let current_time = Date.parse(get_current_time_in_AT().date_string);

    let adjust_clock = 0;
    let adjust_by = 60;

    function countdown_loop() {

      let current_countdown = countdown(current_time, time_till_1330);
      if (current_time > time_till_1330) {
        current_countdown = countdown(current_time, time_till_2359);
      }

      let hour = String(current_countdown.hours);
      let minute = String(current_countdown.minutes);
      let second = String(current_countdown.seconds);
      hour = hour.length == 1 ? "0" + hour : hour;
      minute = minute.length == 1 ? "0" + minute : minute;
      second = second.length == 1 ? "0" + second : second;

      count_down_container.text(`${hour}:${minute}:${second}`);
      current_time = current_time + 1000;
      adjust_clock++;
    }

    function start_countdown(){
      if (current_time < time_till_1330) {
        if (current_time.weekday != 'Sat') {
          shipping_label_wrapper.text(shipping_label_before_1330_text);
        }
      } else if (current_time >= time_till_1330) {
        if (['Fri', 'Sat'].includes(serverTime.weekday) == false) {
          shipping_label_wrapper.text(shipping_label_after_1330_text);
        }
      }

      
      window.global_counter_id = setInterval(countdown_loop, 1000);
      count_down_container_parent.removeClass('hidden').parents('[data-shipping-time]').removeClass('hidden');
    }

    start_countdown();
  }

  async function init_countdown_check() {
      // Check exclusion list
      let exclude;
      let current_time = get_current_time_in_AT();

      // Week days
      exclude = countdown_exclucsion_list.weekdays.find((el) => {
        if (current_time.weekday == el) return true
      })
      if (exclude) {
        // console.log('excluding weekday');
        return;
      }

      // Static holidays in Austria
      exclude = countdown_exclucsion_list.static_hoidays.find((el) => {
        let current_date = (current_time.day.length == 1 ? "0" + current_time.day : current_time.day) + "." + (current_time.month.length == 1 ? "0" + current_time.month : current_time.month);
        if (current_date == el) return true;
      });

      if (exclude)  {
        // console.log('excluding static holidays');
        return;
      }

      // Yearly exclusion dates
      if (countdown_exclucsion_list.yearly_exclusion[current_time.year] && countdown_exclucsion_list.yearly_exclusion[current_time.year].length > 0) {
        exclude = countdown_exclucsion_list.yearly_exclusion[current_time.year].find((el) => {
          let current_date = (current_time.day.length == 1 ? "0" + current_time.day : current_time.day) + "." + (current_time.month.length == 1 ? "0" + current_time.month : current_time.month);
          if (current_date == el) return true;
        })
        if (exclude)  {
          // console.log('excluding yearly dates');
          return;
        }
      }

    if (current_time.weekday == 'Fri') {
      if (current_time.current_time >= countdown_exclucsion_list.till_1330_hour_minute) {
        return;
      }
    }

    if (current_time.weekday == 'Sat') {
      return;
    }

      init_countdown();
  }

  init_countdown_check();

}()); // IIAF ends

(function() { // IIAF starts
  let $ = jQuery;

  let delivery_dates_table = {
    "AUSTRIA": {
      "BEFORE": {
        "MON": 2,
        "TUE": 2,
        "WED": 2,
        "THU": 2,						
        "FRI": null,
        "SAT": null,
        "SUN": 3,						
      },
      "AFTER": {
        "MON": 3,
        "TUE": 3,
        "WED": 3,
        "THU": null,						
        "FRI": null,
        "SAT": null,
        "SUN": 3,						
      }		
    },
    "GERMANY": {
      "BEFORE": {
        "MON": 1,
        "TUE": 1,
        "WED": 1,
        "THU": 1,						
        "FRI": null,
        "SAT": null,
        "SUN": 2,						
      },
      "AFTER": {
        "MON": 2,
        "TUE": 2,
        "WED": 2,
        "THU": null,						
        "FRI": null,
        "SAT": null,
        "SUN": 2,						
      }		
    }
  }

  function error_handle(error) {
      console.log(error);
      return error;
  }

  function get_delivery_time_from_table(country, day, time) {
    let delivery_time, cut_off_handle;
    switch (country) {
      case "AT":
        country = "AUSTRIA";
        break;
      case "DE":
        country = "GERMANY";
        break;				
    }
    cut_off_handle = (time < get_cut_off_Time()) ? "BEFORE" : "AFTER";
    day = day.toUpperCase();

    delivery_time = delivery_dates_table[country][cut_off_handle][day];
    return delivery_time;
  }

  function get_current_time_in_AT() {
        const currentTime = {
          current_time: (Number(serverTime.hour) * 60) + Number(serverTime.minute),
          weekday: serverTime.weekday.toUpperCase(),
          ...serverTime
        }
        
        return currentTime;
  }

  function get_cut_off_Time() {
    let hours = 13;
    let minutes = 30;
    let cut_off_time = (hours * 60) + minutes;
    return cut_off_time;
  }

  function set_delivery_text(days) {
    days = Number(days);
    switch(days) {
      case 1:
        return `Morgen bei dir`;
      case 2:
        return `Übermorgen bei dir`;
      case null:
        return false;
      case undefined:
        return false;
      default:
        return `Bei dir in ${days} Tagen`;			
    }
  }

  // ########   ################ //
  
  function init_delivery_dates() {
        let response = '';
        if (upside.ucd.helpers.cookie.read('_ucd_country') !== undefined) {
      response = upside.ucd.helpers.cookie.read('_ucd_country');
        }
      
        if (response != 'DE' && response != 'AT') {
        // console.log('Country is not Germany or Austria');
        return;
      }

      let current_time_object_AT = get_current_time_in_AT();
      let delivery_time = get_delivery_time_from_table(response, current_time_object_AT.weekday, current_time_object_AT.current_time);

      if (delivery_time == null || delivery_time == undefined) {
        return;
      } else {
      if ($('[data-shipping-time]')) {
        $('[data-shipping-time]').removeClass('hidden').find('span').text(set_delivery_text(delivery_time));
      }
      }
  }	

    let cartLoaded = false;
    window.addEventListener("Upside::UCD::CartBuilt", function(e) {
      if (!cartLoaded && typeof upside === "object") {
        init_delivery_dates();
        cartLoaded = true;
      }
    });
}()); // IIAF ends