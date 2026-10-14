/* ============================================================
 * art.js —— 卡通美术工厂（全部用内联 SVG 绘制，不依赖任何外部图片）
 * 风格：圆润、粗轮廓、明快糖果色，适合 3-6 岁儿童
 * ============================================================ */
(function (global) {
  'use strict';

  /* ---------------- 调色板 ---------------- */
  var SKIN = { a: '#FFDCBB', b: '#F6C69B', c: '#E8AE7F', d: '#FFE6CD' };
  var HAIR = {
    black: '#3A2A24', brown: '#6B4327', light: '#A9713F',
    gray: '#CFC9C2', white: '#EDE9E4', wine: '#7A3B4E'
  };

  /* ---------------- 角色（家人）----------------
   * cfg: {skin,hair,shirt,pants,shoe,hairType,fringe,glasses,beard,bow,wave}
   * -------------------------------------------- */
  function char(cfg) {
    var s = Object.assign({
      skin: SKIN.a, hair: HAIR.brown, shirt: '#6EC6FF', pants: '#4E6EA8',
      shoe: '#3D3A50', hairType: 'cap', fringe: 60, glasses: false,
      beard: false, bow: '', wave: false
    }, cfg);

    var hair = s.hair, skin = s.skin;
    var back = '';      // 头后方的头发（长发型）
    var cap = '';       // 头顶头发
    var extra = '';     // 头饰

    if (s.hairType === 'bald') {
      cap = '<ellipse cx="26" cy="52" rx="10" ry="13" fill="' + hair + '"/>' +
            '<ellipse cx="94" cy="52" rx="10" ry="13" fill="' + hair + '"/>' +
            '<ellipse cx="60" cy="26" rx="20" ry="7" fill="' + hair + '" opacity=".85"/>';
    } else {
      cap = '<circle cx="60" cy="50" r="37" fill="' + hair + '"/>' +
            '<path d="M27,54 A33,33 0 0 1 93,54 Q60,' + s.fringe + ' 27,54 Z" fill="' + hair + '"/>';
    }

    switch (s.hairType) {
      case 'long':
        back = '<path d="M24,58 C16,96 20,142 28,170 L48,170 C36,134 32,92 36,60 Z" fill="' + hair + '"/>' +
               '<path d="M96,58 C104,96 100,142 92,170 L72,170 C84,134 88,92 84,60 Z" fill="' + hair + '"/>';
        break;
      case 'twin':
        extra = '<circle cx="20" cy="56" r="15" fill="' + hair + '"/><circle cx="100" cy="56" r="15" fill="' + hair + '"/>' +
                '<circle cx="20" cy="56" r="6" fill="' + (s.bow || '#FF7BA9') + '"/><circle cx="100" cy="56" r="6" fill="' + (s.bow || '#FF7BA9') + '"/>';
        break;
      case 'pony':
        extra = '<circle cx="22" cy="72" r="13" fill="' + hair + '"/><circle cx="98" cy="72" r="13" fill="' + hair + '"/>';
        break;
      case 'bun':
        extra = '<circle cx="60" cy="12" r="15" fill="' + hair + '"/>';
        break;
      case 'curly':
        extra = '<circle cx="26" cy="40" r="13" fill="' + hair + '"/><circle cx="42" cy="22" r="14" fill="' + hair + '"/>' +
                '<circle cx="62" cy="16" r="15" fill="' + hair + '"/><circle cx="82" cy="22" r="14" fill="' + hair + '"/>' +
                '<circle cx="96" cy="42" r="13" fill="' + hair + '"/>';
        break;
      case 'bob':
        back = '<path d="M25,54 C18,84 22,104 28,118 L44,118 C34,100 32,78 34,56 Z" fill="' + hair + '"/>' +
               '<path d="M95,54 C102,84 98,104 92,118 L76,118 C86,100 88,78 86,56 Z" fill="' + hair + '"/>';
        break;
    }

    var ribbon = s.bow
      ? '<g transform="translate(92,26)"><path d="M0,0 l-15,-9 v18 z" fill="' + s.bow + '"/>' +
        '<path d="M0,0 l15,-9 v18 z" fill="' + s.bow + '"/><circle r="5" fill="#FFF" opacity=".8"/></g>'
      : '';

    var glasses = s.glasses
      ? '<g class="glasses" fill="#EAF6FF" fill-opacity=".35" stroke="#5A5566" stroke-width="2.6" stroke-linecap="round">' +
        '<circle cx="47" cy="66" r="12.5"/><circle cx="73" cy="66" r="12.5"/>' +
        '<path d="M59.5,66 h1" fill="none"/><path d="M34.5,64 l-7,-3" fill="none"/><path d="M85.5,64 l7,-3" fill="none"/></g>'
      : '';

    var beard = s.beard
      ? '<path d="M31,68 C33,100 45,116 60,116 C75,116 87,100 89,68 C84,94 74,104 60,104 C46,104 36,94 31,68 Z" fill="' + hair + '"/>' +
        '<path d="M50,80 q10,7 20,0" stroke="' + hair + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
      : '';

    var armR = s.wave ? ' transform="rotate(-42 88 98)"' : '';

    return '' +
      '<svg class="char-svg" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">' +
        '<ellipse cx="60" cy="190" rx="36" ry="9" fill="rgba(110,70,40,.16)"/>' +
        /* 腿 + 鞋 */
        '<rect x="46" y="138" width="13" height="44" rx="6.5" fill="' + s.pants + '"/>' +
        '<rect x="61" y="138" width="13" height="44" rx="6.5" fill="' + s.pants + '"/>' +
        '<ellipse cx="51" cy="182" rx="13" ry="8" fill="' + s.shoe + '"/>' +
        '<ellipse cx="69" cy="182" rx="13" ry="8" fill="' + s.shoe + '"/>' +
        /* 身体 */
        '<path d="M60,86 C43,86 34,97 33,112 L33,132 C33,144 43,150 60,150 C77,150 87,144 87,132 L87,112 C86,97 77,86 60,86 Z" fill="' + s.shirt + '"/>' +
        '<path d="M45,89 Q60,101 75,89 Q60,95 45,89 Z" fill="rgba(255,255,255,.75)"/>' +
        /* 手臂 */
        '<g class="arm-l"><rect x="21" y="94" width="12" height="46" rx="6" fill="' + s.shirt + '"/>' +
        '<circle cx="27" cy="140" r="8.5" fill="' + skin + '"/></g>' +
        '<g class="arm-r"' + armR + '><rect x="87" y="94" width="12" height="46" rx="6" fill="' + s.shirt + '"/>' +
        '<circle cx="93" cy="140" r="8.5" fill="' + skin + '"/></g>' +
        back +
        /* 头 */
        cap +
        '<circle cx="26" cy="64" r="8" fill="' + skin + '"/>' +
        '<circle cx="94" cy="64" r="8" fill="' + skin + '"/>' +
        '<ellipse cx="60" cy="60" rx="33" ry="34" fill="' + skin + '"/>' +
        '<path d="M27,54 A33,33 0 0 1 93,54 Q60,' + s.fringe + ' 27,54 Z" fill="' + hair + '" opacity="' + (s.hairType === 'bald' ? 0 : 1) + '"/>' +
        extra + ribbon +
        '<g class="eyes">' +
          '<ellipse cx="47" cy="66" rx="8.5" ry="9.5" fill="#FFFFFF"/>' +
          '<ellipse cx="73" cy="66" rx="8.5" ry="9.5" fill="#FFFFFF"/>' +
          '<circle cx="47.5" cy="67" r="5.8" fill="#3B2A26"/>' +
          '<circle cx="72.5" cy="67" r="5.8" fill="#3B2A26"/>' +
          '<circle cx="45.6" cy="64" r="2.1" fill="#FFFFFF"/>' +
          '<circle cx="70.6" cy="64" r="2.1" fill="#FFFFFF"/>' +
        '</g>' +
        '<path d="M40,52 Q47,48 54,52" stroke="' + hair + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<path d="M66,52 Q73,48 80,52" stroke="' + hair + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="37" cy="78" rx="7.5" ry="5" fill="#FFAFC3" opacity=".8"/>' +
        '<ellipse cx="83" cy="78" rx="7.5" ry="5" fill="#FFAFC3" opacity=".8"/>' +
        glasses + beard +
        '<path d="M52,80 Q60,89 68,80" stroke="#B0523F" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ---------------- 宝宝（被照顾的对象）---------------- */
  function baby() {
    return '' +
      '<svg class="baby-svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">' +
        /* 身体（连体衣） */
        '<path d="M80,72 C57,72 45,87 43,109 L41,136 C41,149 54,155 80,155 C106,155 119,149 119,136 L117,109 C115,87 103,72 80,72 Z" fill="#FFF0B8"/>' +
        '<path d="M43,120 L117,120 L117,136 C117,149 106,155 80,155 C54,155 43,149 43,136 Z" fill="#FFE07A"/>' +
        /* 小脚 */
        '<ellipse cx="61" cy="153" rx="15" ry="9" fill="#FFE0C4"/>' +
        '<ellipse cx="99" cy="153" rx="15" ry="9" fill="#FFE0C4"/>' +
        /* 手臂 */
        '<g class="b-arm-l"><rect x="24" y="86" width="18" height="42" rx="9" fill="#FFF0B8"/><circle cx="33" cy="128" r="10" fill="#FFE0C4"/></g>' +
        '<g class="b-arm-r"><rect x="118" y="86" width="18" height="42" rx="9" fill="#FFF0B8"/><circle cx="127" cy="128" r="10" fill="#FFE0C4"/></g>' +
        /* 头 */
        '<circle cx="80" cy="52" r="44" fill="#FFE0C4"/>' +
        '<path d="M74,10 q10,-12 16,2 q-8,-6 -16,-2 z" fill="#8A5C3B"/>' +
        /* 眼睛 */
        '<g class="b-eyes-open">' +
          '<ellipse cx="62" cy="52" rx="10" ry="11" fill="#FFFFFF"/>' +
          '<ellipse cx="98" cy="52" rx="10" ry="11" fill="#FFFFFF"/>' +
          '<circle cx="63" cy="53" r="7" fill="#3B2A26"/>' +
          '<circle cx="97" cy="53" r="7" fill="#3B2A26"/>' +
          '<circle cx="60" cy="49" r="2.6" fill="#FFFFFF"/>' +
          '<circle cx="94" cy="49" r="2.6" fill="#FFFFFF"/>' +
        '</g>' +
        /* 哭泣时的眼睛 */
        '<g class="b-eyes-cry">' +
          '<path d="M52,54 q10,-10 20,0" stroke="#3B2A26" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
          '<path d="M88,54 q10,-10 20,0" stroke="#3B2A26" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
          '<ellipse class="b-tear" cx="52" cy="66" rx="6" ry="8" fill="#8ED6FF"/>' +
          '<ellipse class="b-tear t2" cx="108" cy="66" rx="6" ry="8" fill="#8ED6FF"/>' +
        '</g>' +
        /* 睡觉时的眼睛 */
        '<g class="b-eyes-sleep">' +
          '<path d="M52,54 q10,10 20,0" stroke="#3B2A26" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          '<path d="M88,54 q10,10 20,0" stroke="#3B2A26" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        /* 腮红 + 嘴 */
        '<ellipse cx="42" cy="70" rx="11" ry="7" fill="#FFAFC3" opacity=".85"/>' +
        '<ellipse cx="118" cy="70" rx="11" ry="7" fill="#FFAFC3" opacity=".85"/>' +
        '<ellipse class="b-mouth" cx="80" cy="74" rx="7" ry="5.5" fill="#D9635F"/>' +
        '<ellipse class="b-tongue" cx="80" cy="78" rx="4.5" ry="3" fill="#FF9AA0"/>' +
        /* 围嘴 */
        '<path d="M58,88 Q80,104 102,88 Q80,100 58,88 Z" fill="#9BE7C4"/>' +
      '</svg>';
  }

  /* ---------------- 家庭房间背景 ---------------- */
  function room() {
    var stripes = '';
    for (var x = 0; x < 1200; x += 60) {
      stripes += '<rect x="' + x + '" y="0" width="30" height="520" fill="#FFFFFF" opacity=".55"/>';
    }
    var planks = '';
    for (var i = 1; i < 6; i++) {
      planks += '<line x1="' + (i * 200) + '" y1="520" x2="' + (i * 200 - 40) + '" y2="700" stroke="#C79A6C" stroke-width="3" opacity=".45"/>';
    }
    var bunting = '';
    var colors = ['#FF8FA3', '#FFD166', '#8ED6A0', '#8FB8FF', '#C9A6FF'];
    for (var b = 0; b < 20; b++) {
      var bx = 30 + b * 60;
      var col = colors[b % colors.length];
      bunting += '<path d="M' + bx + ',40 l30,0 l-15,34 z" fill="' + col + '"/>';
    }

    return '' +
      '<svg class="layer" viewBox="0 0 1200 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#FFF8EA"/><stop offset="1" stop-color="#FBE6CC"/></linearGradient>' +
          '<linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#E7C49A"/><stop offset="1" stop-color="#D3A574"/></linearGradient>' +
          '<linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#8FD8FF"/><stop offset="1" stop-color="#DFF4FF"/></linearGradient>' +
        '</defs>' +

        /* 墙 + 墙纸 */
        '<rect width="1200" height="520" fill="url(#wallG)"/>' +
        '<g>' + stripes + '</g>' +
        /* 彩旗 */
        '<path d="M0,34 C300,68 900,68 1200,34" stroke="#D9BFA0" stroke-width="4" fill="none"/>' +
        bunting +

        /* 窗户 */
        '<rect x="80" y="100" width="300" height="230" rx="22" fill="#FFFFFF"/>' +
        '<rect x="94" y="114" width="272" height="202" rx="14" fill="url(#skyG)"/>' +
        '<circle cx="134" cy="158" r="26" fill="#FFD54A"/>' +
        '<ellipse cx="250" cy="176" rx="42" ry="22" fill="#FFFFFF" opacity=".95"/>' +
        '<ellipse cx="286" cy="166" rx="30" ry="18" fill="#FFFFFF" opacity=".95"/>' +
        '<ellipse cx="200" cy="250" rx="70" ry="26" fill="#A8E6A0"/>' +
        '<ellipse cx="320" cy="256" rx="60" ry="22" fill="#8FD98C"/>' +
        '<rect x="225" y="114" width="10" height="202" fill="#FFFFFF"/>' +
        '<rect x="94" y="210" width="272" height="10" fill="#FFFFFF"/>' +
        /* 窗帘 */
        '<path d="M56,86 L128,86 C132,170 118,240 100,300 L64,300 C50,236 46,160 56,86 Z" fill="#FFC4DC"/>' +
        '<path d="M124,86 L196,86 C202,170 188,240 170,300 L134,300 C120,236 116,160 124,86 Z" fill="#FFD9E8" opacity=".9"/>' +
        '<rect x="40" y="78" width="290" height="12" rx="6" fill="#D9B98F"/>' +
        '<path d="M124,86 L196,86 C202,170 188,240 170,300 L134,300 C120,236 116,160 124,86 Z" fill="#FFC4DC" transform="translate(230,0)"/>' +

        /* 墙上照片 */
        '<rect x="404" y="140" width="110" height="90" rx="12" fill="#FFFFFF" stroke="#E2C49C" stroke-width="6"/>' +
        '<circle cx="436" cy="176" r="13" fill="#FFC46B"/><circle cx="464" cy="172" r="10" fill="#FFB0C8"/>' +
        '<path d="M424,214 q22,-22 46,0 z" fill="#8ED6A0"/>' +
        '<rect x="532" y="152" width="90" height="76" rx="12" fill="#FFFFFF" stroke="#E2C49C" stroke-width="6"/>' +
        '<path d="M552,206 l16,-26 l14,18 l12,-14 l14,22 z" fill="#9BC9FF"/>' +

        /* 挂钟 */
        '<circle cx="700" cy="170" r="46" fill="#FFFFFF" stroke="#F0B27A" stroke-width="8"/>' +
        '<line x1="700" y1="170" x2="700" y2="142" stroke="#6E5A4B" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="700" y1="170" x2="722" y2="180" stroke="#6E5A4B" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="700" cy="170" r="5" fill="#F0B27A"/>' +

        /* 气球 */
        '<g class="balloons">' +
          '<line x1="1108" y1="200" x2="1078" y2="120" stroke="#D9BFA0" stroke-width="3"/>' +
          '<line x1="1108" y1="200" x2="1122" y2="110" stroke="#D9BFA0" stroke-width="3"/>' +
          '<line x1="1108" y1="200" x2="1150" y2="136" stroke="#D9BFA0" stroke-width="3"/>' +
          '<ellipse cx="1078" cy="96" rx="26" ry="32" fill="#FF9FB4"/>' +
          '<ellipse cx="1122" cy="82" rx="26" ry="32" fill="#FFD166"/>' +
          '<ellipse cx="1152" cy="118" rx="24" ry="30" fill="#8FB8FF"/>' +
        '</g>' +

        /* 置物架 */
        '<rect x="770" y="300" width="360" height="16" rx="8" fill="#E0B888"/>' +
        '<rect x="800" y="316" width="14" height="40" fill="#E0B888"/>' +
        '<rect x="1086" y="316" width="14" height="40" fill="#E0B888"/>' +
        '<rect x="800" y="248" width="42" height="52" rx="8" fill="#FF9F9F"/>' +
        '<rect x="852" y="264" width="42" height="36" rx="8" fill="#8ED6A0"/>' +
        '<circle cx="960" cy="278" r="24" fill="#FFD166"/>' +
        '<circle cx="1000" cy="286" r="16" fill="#8FB8FF"/>' +
        '<rect x="1040" y="252" width="60" height="48" rx="10" fill="#C9A6FF"/>' +

        /* 地板 */
        '<rect y="520" width="1200" height="180" fill="url(#floorG)"/>' +
        '<g>' + planks + '</g>' +
        '<rect y="498" width="1200" height="26" fill="#F8E9D2"/>' +
        '<rect y="498" width="1200" height="6" fill="#EBD6B6"/>' +

        /* 地毯 */
        '<ellipse cx="450" cy="628" rx="330" ry="92" fill="#9FE0C7"/>' +
        '<ellipse cx="450" cy="628" rx="270" ry="72" fill="#C4EEDC"/>' +
        '<ellipse cx="450" cy="628" rx="180" ry="46" fill="#9FE0C7" opacity=".7"/>' +

        /* 盆栽 */
        '<path d="M60,470 C40,430 70,392 92,420 C104,392 138,404 128,436 C158,438 150,478 122,480 Z" fill="#7CC98A"/>' +
        '<path d="M92,480 L92,560" stroke="#7CC98A" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="M40,556 L144,556 L132,642 L52,642 Z" fill="#F09B7A"/>' +
        '<rect x="34" y="544" width="116" height="20" rx="10" fill="#FFB794"/>' +

        /* 玩具箱 */
        '<rect x="780" y="556" width="150" height="92" rx="14" fill="#8FB8FF"/>' +
        '<rect x="780" y="556" width="150" height="26" rx="13" fill="#6E9BEE"/>' +
        '<rect x="834" y="596" width="42" height="18" rx="9" fill="#FFF3C4"/>' +
        '<circle cx="810" cy="536" r="18" fill="#FF9FB4"/>' +
        '<rect x="866" y="518" width="34" height="34" rx="8" fill="#FFD166"/>' +
        '<path d="M918,552 a26,26 0 0 1 46,0 z" fill="#8ED6A0"/>' +

        /* 沙发 */
        '<rect x="742" y="356" width="410" height="130" rx="30" fill="#9BD4B0"/>' +
        '<rect x="770" y="384" width="160" height="86" rx="22" fill="#B6E3C7"/>' +
        '<rect x="948" y="384" width="160" height="86" rx="22" fill="#B6E3C7"/>' +
        '<rect x="722" y="452" width="450" height="66" rx="28" fill="#86C9A3"/>' +
        '<rect x="726" y="424" width="60" height="94" rx="24" fill="#9BD4B0"/>' +
        '<rect x="1108" y="424" width="60" height="94" rx="24" fill="#9BD4B0"/>' +
        '<ellipse cx="860" cy="476" rx="30" ry="18" fill="#FFD166"/>' +

        /* 婴儿床（后半部分，宝宝会画在它前面） */
        '<rect x="286" y="392" width="272" height="150" rx="18" fill="#F7D9AE"/>' +
        '<g stroke="#E7BE8C" stroke-width="12" stroke-linecap="round">' +
          '<line x1="318" y1="404" x2="318" y2="520"/><line x1="360" y1="404" x2="360" y2="520"/>' +
          '<line x1="402" y1="404" x2="402" y2="520"/><line x1="444" y1="404" x2="444" y2="520"/>' +
          '<line x1="486" y1="404" x2="486" y2="520"/><line x1="526" y1="404" x2="526" y2="520"/>' +
        '</g>' +
        '<rect x="278" y="382" width="288" height="22" rx="11" fill="#EFC79A"/>' +
        '<rect x="286" y="470" width="272" height="46" rx="16" fill="#FFF6E5"/>' +
        '<path d="M300,486 q60,-16 120,0 q60,16 120,0 l0,20 q-60,16 -120,0 q-60,-16 -120,0 z" fill="#FFC4DC"/>' +
        '<rect x="298" y="516" width="18" height="76" rx="9" fill="#E7BE8C"/>' +
        '<rect x="528" y="516" width="18" height="76" rx="9" fill="#E7BE8C"/>' +
      '</svg>';
  }

  /* 婴儿床前护栏（盖在宝宝前面，形成层次感） */
  function roomFront() {
    return '' +
      '<svg class="layer" viewBox="0 0 1200 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="272" y="500" width="300" height="66" rx="18" fill="#F7D9AE" opacity=".97"/>' +
        '<g stroke="#E7BE8C" stroke-width="12" stroke-linecap="round" opacity=".97">' +
          '<line x1="308" y1="508" x2="308" y2="558"/><line x1="352" y1="508" x2="352" y2="558"/>' +
          '<line x1="422" y1="508" x2="422" y2="558"/><line x1="466" y1="508" x2="466" y2="558"/>' +
          '<line x1="536" y1="508" x2="536" y2="558"/>' +
        '</g>' +
        '<rect x="264" y="492" width="316" height="22" rx="11" fill="#EFC79A"/>' +
        '<rect x="292" y="560" width="18" height="42" rx="9" fill="#E7BE8C"/>' +
        '<rect x="534" y="560" width="18" height="42" rx="9" fill="#E7BE8C"/>' +
      '</svg>';
  }

  /* 金币 */
  function coin() {
    return '' +
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="32" cy="32" r="29" fill="#F2B322"/>' +
        '<circle cx="32" cy="32" r="29" fill="none" stroke="#D99413" stroke-width="4"/>' +
        '<circle cx="32" cy="32" r="21" fill="#FFD75E"/>' +
        '<path d="M32,16 l4.8,9.6 10.6,1.6 -7.7,7.5 1.8,10.6 -9.5,-5 -9.5,5 1.8,-10.6 -7.7,-7.5 10.6,-1.6 z" fill="#FFF3C4"/>' +
      '</svg>';
  }

  /* 钥匙 */
  function key() {
    return '' +
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="22" cy="22" r="14" fill="none" stroke="#F5C542" stroke-width="9"/>' +
        '<rect x="27" y="30" width="9" height="28" rx="4" fill="#F5C542" transform="rotate(-45 31 44)"/>' +
        '<rect x="42" y="34" width="12" height="8" rx="3" fill="#F5C542" transform="rotate(-45 48 38)"/>' +
      '</svg>';
  }

  global.Art = { char: char, baby: baby, room: room, roomFront: roomFront, coin: coin, key: key, SKIN: SKIN, HAIR: HAIR };
})(window);
