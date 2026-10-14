/* ============================================================
 * game.js —— 宝宝照顾小屋 · 主逻辑
 * 玩法：选择家人照顾宝宝 → 喂食/玩耍/洗澡/睡觉 → 宝宝开心冒金币
 *       → 收集金币 → 商店换礼物 → 闯关拿钥匙开宝箱
 * ============================================================ */
(function () {
  'use strict';

  /* ============================================================
   * 一、配置数据
   * ============================================================ */

  /* 家庭成员：star = 最擅长的照顾方式（额外金币） */
  var CHARS = [
    { id: 'me', name: '我', h: 150, skin: '#FFDCBB', hair: '#3A2A24', shirt: '#FFD166', pants: '#5A7BB5', shoe: '#E2645A', hairType: 'cap', fringe: 58, wave: true, star: 'all', coin: 1, line: '我来照顾小宝宝！' },
    { id: 'dad', name: '爸爸', h: 208, skin: '#F6C69B', hair: '#3A2A24', shirt: '#6EC6FF', pants: '#3F5E96', shoe: '#3D3A50', hairType: 'cap', fringe: 54, star: 'play', coin: 2, line: '爸爸陪你玩飞高高！' },
    { id: 'mom', name: '妈妈', h: 196, skin: '#FFDCBB', hair: '#5B3B2A', shirt: '#FF9FC0', pants: '#C95F8B', shoe: '#8A4B6B', hairType: 'long', fringe: 64, star: 'feed', coin: 2, line: '妈妈喂饭最香啦～' },
    { id: 'bro', name: '哥哥', h: 172, skin: '#F6C69B', hair: '#3A2A24', shirt: '#8ED6A0', pants: '#4E6EA8', shoe: '#4A4A5A', hairType: 'cap', fringe: 52, star: 'play', coin: 2, line: '哥哥带你玩积木！' },
    { id: 'sis', name: '姐姐', h: 166, skin: '#FFDCBB', hair: '#6B4327', shirt: '#C9A6FF', pants: '#8A6BC9', shoe: '#6B4E9E', hairType: 'twin', fringe: 62, bow: '#FF7BA9', star: 'bath', coin: 2, line: '姐姐给你洗香香～' },
    { id: 'ybro', name: '弟弟', h: 140, skin: '#FFDCBB', hair: '#5B3B2A', shirt: '#FFB26B', pants: '#6E9BEE', shoe: '#E2645A', hairType: 'cap', fringe: 56, star: 'play', coin: 1, line: '弟弟来逗你笑！' },
    { id: 'ysis', name: '妹妹', h: 134, skin: '#FFDCBB', hair: '#3A2A24', shirt: '#FFC4DC', pants: '#E48FB4', shoe: '#C4678F', hairType: 'pony', fringe: 66, bow: '#FF7BA9', star: 'sleep', coin: 1, line: '妹妹轻轻拍拍你～' },
    { id: 'gpa', name: '爷爷', h: 194, skin: '#E8AE7F', hair: '#CFC9C2', shirt: '#B7C4D6', pants: '#6E7A8A', shoe: '#4A4A5A', hairType: 'bald', glasses: true, beard: true, star: 'sleep', coin: 3, line: '爷爷唱摇篮曲给你听～' },
    { id: 'gma', name: '奶奶', h: 186, skin: '#F6C69B', hair: '#CFC9C2', shirt: '#E08FA8', pants: '#9E6B7E', shoe: '#6B4A56', hairType: 'bun', glasses: true, star: 'feed', coin: 3, line: '奶奶做了软软的饭饭～' },
    { id: 'mgpa', name: '外公', h: 192, skin: '#E8AE7F', hair: '#B9B2AB', shirt: '#8FB08A', pants: '#4F6B4A', shoe: '#3D3A50', hairType: 'bald', glasses: true, beard: true, star: 'play', coin: 2, line: '外公给你讲小故事！' },
    { id: 'mgma', name: '外婆', h: 182, skin: '#FFDCBB', hair: '#EDE9E4', shirt: '#FFB794', pants: '#C97C56', shoe: '#8A5A3E', hairType: 'curly', star: 'bath', coin: 3, line: '外婆给你搓泡泡～' }
  ];

  /* 食物：full 饱腹，mood 心情，coin 基础金币 */
  var FOODS = [
    { id: 'milk', n: '奶瓶', e: '🍼', full: 10, mood: 4, coin: 3 },
    { id: 'rice', n: '米糊', e: '🍚', full: 12, mood: 5, coin: 4 },
    { id: 'noodle', n: '面条', e: '🍜', full: 14, mood: 6, coin: 5 },
    { id: 'egg', n: '鸡蛋羹', e: '🥚', full: 11, mood: 4, coin: 4 },
    { id: 'apple', n: '苹果', e: '🍎', full: 8, mood: 5, coin: 3 },
    { id: 'banana', n: '香蕉', e: '🍌', full: 8, mood: 6, coin: 3 },
    { id: 'carrot', n: '胡萝卜', e: '🥕', full: 10, mood: 3, coin: 4 },
    { id: 'berry', n: '草莓', e: '🍓', full: 6, mood: 7, coin: 3 },
    { id: 'cookie', n: '小饼干', e: '🍪', full: 6, mood: 8, coin: 2 },
    { id: 'cake', n: '小蛋糕', e: '🍰', full: 12, mood: 10, coin: 6 },
    { id: 'juice', n: '果汁', e: '🥤', full: 5, mood: 7, coin: 2 },
    { id: 'water', n: '温水', e: '💧', full: 3, mood: 4, coin: 1 }
  ];

  /* 玩具 */
  var TOYS = [
    { id: 'drum', n: '小鼓', e: '🥁', mood: 10, coin: 3 },
    { id: 'block', n: '搭积木', e: '🧱', mood: 12, coin: 4 },
    { id: 'doll', n: '布娃娃', e: '🎎', mood: 13, coin: 4 },
    { id: 'ball', n: '小皮球', e: '⚽', mood: 14, coin: 5 },
    { id: 'music', n: '音乐盒', e: '🎵', mood: 15, coin: 5 },
    { id: 'clap', n: '拍拍手', e: '👏', mood: 16, coin: 6 },
    { id: 'peek', n: '躲猫猫', e: '🙈', mood: 15, coin: 6 }
  ];

  /* 商店礼物：deco 为房间坐标（1200×700 逻辑像素），size 为显示大小 */
  var SHOP = [
    { id: 'balloon', n: '彩色气球', e: '🎈', price: 15, mood: 8, deco: { x: 1010, y: 196, s: 54 } },
    { id: 'teddy', n: '小熊玩偶', e: '🧸', price: 20, mood: 10, deco: { x: 920, y: 460, s: 64 } },
    { id: 'matry', n: '布娃娃', e: '🎎', price: 25, mood: 10, deco: { x: 866, y: 268, s: 52 } },
    { id: 'blocks', n: '积木盒', e: '🧱', price: 30, mood: 12, deco: { x: 270, y: 600, s: 52 } },
    { id: 'plant', n: '小向日葵', e: '🌻', price: 30, mood: 10, deco: { x: 1058, y: 628, s: 54 } },
    { id: 'car', n: '小汽车', e: '🚗', price: 35, mood: 12, deco: { x: 330, y: 640, s: 54 } },
    { id: 'dress', n: '花裙子', e: '👗', price: 40, mood: 14, deco: { x: 250, y: 402, s: 52 } },
    { id: 'mbox', n: '音乐盒', e: '🎵', price: 45, mood: 14, deco: { x: 496, y: 636, s: 52 } },
    { id: 'lamp', n: '星星夜灯', e: '🌟', price: 55, mood: 15, deco: { x: 1140, y: 600, s: 50 } },
    { id: 'photo', n: '全家福', e: '🖼️', price: 60, mood: 16, deco: { x: 880, y: 156, s: 56 } },
    { id: 'tent', n: '小帐篷', e: '⛺', price: 90, mood: 18, deco: { x: 620, y: 648, s: 80, behind: true } },
    { id: 'horse', n: '摇摇马', e: '🐴', price: 110, mood: 20, deco: { x: 952, y: 618, s: 56 } },
    { id: 'rainbow', n: '彩虹地毯', e: '🌈', price: 150, mood: 22, deco: { x: 430, y: 636, s: 90 } },
    { id: 'house', n: '玩具屋', e: '🏠', price: 220, mood: 25, deco: { x: 172, y: 644, s: 84 } }
  ];

  /* 关卡：goal 里的键 = 本关需要达成的目标 */
  var LEVELS = [
    { t: '喂宝宝吃 3 次饭', goal: 'feed', need: 3, reward: 30 },
    { t: '把宝宝的饱腹度养到 80', goal: 'full', need: 80, reward: 50 },
    { t: '收集 40 枚金币', goal: 'coins', need: 40, reward: 80 },
    { t: '给宝宝洗 2 次澡', goal: 'bath', need: 2, reward: 120 },
    { t: '陪宝宝玩耍 3 次', goal: 'play', need: 3, reward: 160 },
    { t: '让饱腹和心情都到 90', goal: 'both', need: 90, reward: 220 }
  ];

  /* 背景音乐（八分音符步进音序器） */
  var TRACKS = [
    {
      name: '快乐小屋', bpm: 118,
      mel: ['C5', null, 'E5', null, 'G5', null, 'E5', null,
            'F5', null, 'D5', null, 'E5', null, 'C5', null,
            'D5', null, 'F5', null, 'A5', null, 'F5', null,
            'G5', null, 'E5', null, 'C5', null, null, null],
      bass: ['C3', null, null, null, 'G2', null, null, null,
             'F2', null, null, null, 'C3', null, null, null,
             'D3', null, null, null, 'A2', null, null, null,
             'G2', null, null, null, 'C3', null, null, null]
    },
    {
      name: '月亮摇篮曲', bpm: 72,
      mel: ['E4', null, null, null, 'G4', null, null, null, 'C5', null, null, null, 'B4', null, null, null,
            'F4', null, null, null, 'A4', null, null, null, 'C5', null, null, null, 'B4', null, null, null,
            'E4', null, null, null, 'G4', null, null, null, 'C5', null, null, null, 'E5', null, null, null,
            'D5', null, null, null, 'B4', null, null, null, 'C5', null, null, null, null, null, null, null],
      bass: ['C3', null, null, null, null, null, null, null, 'C3', null, null, null, 'G2', null, null, null,
             'F2', null, null, null, null, null, null, null, 'F2', null, null, null, 'C3', null, null, null,
             'C3', null, null, null, null, null, null, null, 'C3', null, null, null, 'G2', null, null, null,
             'G2', null, null, null, null, null, null, null, 'C3', null, null, null, null, null, null, null]
    },
    {
      name: '玩具圆舞曲', bpm: 150,
      mel: ['G4', null, 'B4', null, 'D5', null, 'C5', null, 'A4', null, 'B4', null,
            'G4', null, 'B4', null, 'C5', null, 'D5', null, null, null, 'G4', null],
      bass: ['C3', null, 'G3', null, 'E3', null, 'F3', null, 'C4', null, 'A3', null,
             'G3', null, 'D4', null, 'B3', null, 'C3', null, 'G3', null, 'C3', null]
    }
  ];

  var SAVE_KEY = 'babycare.save.v1';

  /* ============================================================
   * 二、游戏状态
   * ============================================================ */
  function freshState() {
    return {
      coins: 0,
      keys: 0,
      level: 0,
      rewards: [],                                            // 待开箱的奖励队列
      lv: { feed: 0, play: 0, bath: 0, sleep: 0, coins: 0 },  // 本关进度
      baby: { full: 45, mood: 70, clean: 75 },
      owned: [],
      caretaker: 'mom',
      stats: { feed: 0, play: 0, bath: 0, sleep: 0, earned: 0 },
      set: { music: true, sfx: true, track: 0 }
    };
  }

  var S = freshState();

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { }
  }
  function load() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (d && typeof d === 'object') {
        S = Object.assign(freshState(), d);
        S.baby = Object.assign({ full: 45, mood: 70, clean: 75 }, d.baby || {});
        S.set = Object.assign({ music: true, sfx: true, track: 0 }, d.set || {});
        S.lv = Object.assign({ feed: 0, play: 0, bath: 0, sleep: 0, coins: 0 }, d.lv || {});
        S.stats = Object.assign({ feed: 0, play: 0, bath: 0, sleep: 0, earned: 0 }, d.stats || {});
        if (!Array.isArray(S.owned)) S.owned = [];
        if (!Array.isArray(S.rewards)) S.rewards = [];
      }
    } catch (e) { }
  }

  /* ============================================================
   * 三、声音（Web Audio，无外部音频文件）
   * ============================================================ */
  var Sound = (function () {
    var ctx = null, master = null, musicGain = null, sfxGain = null;
    var playing = false, timer = null, step = 0, nextTime = 0, curTrack = 0;
    var MIDI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    function freq(name) {
      var m = /^([A-G])(#?)(-?\d)$/.exec(name);
      if (!m) return 440;
      var midi = MIDI[m[1]] + (m[2] ? 1 : 0) + (parseInt(m[3], 10) + 1) * 12;
      return 440 * Math.pow(2, (midi - 69) / 12);
    }
    function init() {
      if (ctx) return ctx;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.85; master.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.0; musicGain.connect(master);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.45; sfxGain.connect(master);
      return ctx;
    }
    function tone(t, f, dur, type, vol, dest) {
      if (!ctx) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dest || sfxGain);
      o.start(t); o.stop(t + dur + 0.06);
    }
    function scheduler() {
      if (!ctx || !playing) return;
      var tr = TRACKS[curTrack];
      var stepDur = (60 / tr.bpm) / 2;
      while (nextTime < ctx.currentTime + 0.3) {
        var i = step % tr.mel.length;
        var n = tr.mel[i];
        if (n) tone(nextTime, freq(n), stepDur * 1.7, 'triangle', 0.20, musicGain);
        var b = tr.bass[i % tr.bass.length];
        if (b) tone(nextTime, freq(b), stepDur * 2.4, 'sine', 0.26, musicGain);
        nextTime += stepDur;
        step++;
      }
    }
    return {
      init: init,
      resume: function () { if (init()) { if (ctx.state === 'suspended') ctx.resume(); } },
      play: function () {
        if (!init()) return;
        playing = true; step = 0; nextTime = ctx.currentTime + 0.08;
        musicGain.gain.setTargetAtTime(1, ctx.currentTime, 0.4);
        if (!timer) timer = setInterval(scheduler, 40);
      },
      stop: function () {
        playing = false;
        if (ctx) musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      },
      setTrack: function (i) {
        curTrack = i % TRACKS.length; step = 0;
        if (ctx) nextTime = Math.max(nextTime, ctx.currentTime + 0.05);
      },
      trackName: function (i) { return TRACKS[i % TRACKS.length].name; },
      click: function () { if (!ctx || !S.set.sfx) return; tone(ctx.currentTime, 880, 0.09, 'square', 0.16); },
      eat: function () { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        tone(t, 300, 0.10, 'sawtooth', 0.14); tone(t + 0.14, 360, 0.10, 'sawtooth', 0.14); tone(t + 0.28, 300, 0.12, 'sawtooth', 0.12); },
      coin: function (i) { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        tone(t, 988 + (i || 0) * 60, 0.10, 'triangle', 0.24); tone(t + 0.06, 1319 + (i || 0) * 60, 0.16, 'triangle', 0.20); },
      happy: function () { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        [523, 659, 784, 1047].forEach(function (f, k) { tone(t + k * 0.09, f, 0.28, 'triangle', 0.22); }); },
      refuse: function () { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        tone(t, 420, 0.14, 'sine', 0.20); tone(t + 0.15, 300, 0.22, 'sine', 0.18); },
      levelup: function () { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        [523, 659, 784, 1047, 1319].forEach(function (f, k) { tone(t + k * 0.11, f, 0.4, 'triangle', 0.24); }); },
      open: function () { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        [784, 988, 1175, 1568, 1976].forEach(function (f, k) { tone(t + k * 0.07, f, 0.5, 'sine', 0.22); }); },
      water: function () { if (!ctx || !S.set.sfx) return; var t = ctx.currentTime;
        for (var k = 0; k < 6; k++) tone(t + k * 0.09, 600 + Math.random() * 800, 0.16, 'sine', 0.10); }
    };
  })();

  /* ============================================================
   * 四、DOM 与布局
   * ============================================================ */
  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage'), stageWrap = $('stageWrap'), fxLayer = $('fx');
  var SC = 1;                       // 逻辑像素 → 屏幕像素
  var curActor = null, curActorId = null;
  var babyEl = null, babyState = '', sleeping = false, sleepTimer = null;
  var coins = [], rafId = null, lastT = 0;
  var busy = false;                 // 正在喂食/动画中

  function fitStage() {
    var w = stageWrap.clientWidth - 22, h = stageWrap.clientHeight - 22;
    var sc = Math.max(0.18, Math.min(w / 1200, h / 700));
    SC = sc;
    stage.style.width = (1200 * sc) + 'px';
    stage.style.height = (700 * sc) + 'px';
    stage.style.setProperty('--s', sc);
    placeBaby();
    Array.prototype.forEach.call(stage.querySelectorAll('.actor'), placeActor);
    placeDecos();
  }

  function L(v) { return v * SC; }   // 逻辑 → 屏幕

  /* ============================================================
   * 五、场景渲染
   * ============================================================ */
  function buildStage() {
    $('roomLayer').innerHTML = Art.room();
    $('frontLayer').innerHTML = Art.roomFront();

    /* 宝宝 */
    babyEl = document.createElement('div');
    babyEl.className = 'baby';
    babyEl.innerHTML = Art.baby();
    stage.insertBefore(babyEl, fxLayer);

    /* 宝宝气泡与表情容器 */
    placeBaby();

    /* 房间礼物 */
    renderDeco();
  }

  function placeBaby() {
    if (!babyEl) return;
    babyEl.style.left = L(335) + 'px';
    babyEl.style.top = L(379) + 'px';
    babyEl.style.width = L(170) + 'px';
    babyEl.style.height = L(170) + 'px';
  }

  function babyStateSet(cls) {
    if (!babyEl) return;
    babyEl.className = 'baby' + (cls ? ' ' + cls : '');
    babyState = cls;
  }

  /* ---- 角色 ---- */
  function cfgOf(id) {
    for (var i = 0; i < CHARS.length; i++) if (CHARS[i].id === id) return CHARS[i];
    return CHARS[0];
  }

  function makeActor(id) {
    var c = cfgOf(id);
    var el = document.createElement('div');
    el.className = 'actor';
    el.dataset.id = id;
    el.style.height = L(c.h) + 'px';
    el.style.width = L(c.h * 0.6) + 'px';
    el.innerHTML = Art.char(c) + '<span class="tag">' + c.name + '</span>';
    el._cx = -140; el._gy = 604;         // 逻辑坐标：中心 x / 脚底 y
    placeActor(el);
    stage.insertBefore(el, fxLayer);
    return el;
  }

  function placeActor(el) {
    var c = cfgOf(el.dataset.id);
    var w = c.h * 0.6;
    el.style.left = L(el._cx - w / 2) + 'px';
    el.style.top = L(el._gy - c.h) + 'px';
    el.style.height = L(c.h) + 'px';
    el.style.width = L(w) + 'px';
  }

  function walkTo(el, cx, gy, ms) {
    el._cx = cx; el._gy = gy;
    el.classList.add('walking');
    placeActor(el);
    clearTimeout(el._wt);
    el._wt = setTimeout(function () { el.classList.remove('walking'); }, ms || 600);
  }

  function selectChar(id, silent) {
    if (id === curActorId) return;
    Sound.click();
    S.caretaker = id; save();

    var old = curActor;
    if (old) {
      walkTo(old, 1420, old._gy, 700);
      (function (oel) { setTimeout(function () { if (oel.parentNode) oel.parentNode.removeChild(oel); }, 750); })(old);
    }
    var c = cfgOf(id);
    var el = makeActor(id);
    el._cx = -140; el._gy = 604; placeActor(el);
    curActor = el; curActorId = id;
    renderFamily();
    setTimeout(function () {
      walkTo(el, 662, 604, 650);
      setTimeout(function () {
        el.classList.add('cheer');
        setTimeout(function () { el.classList.remove('cheer'); }, 1400);
        say(c.line, 662, 360);
      }, 620);
    }, 40);
    setTimeout(ensurePlayer, 830);
    updateHUD();
    save();
  }

  /* 房间里始终站着的「我」（自己）；当自己就是照顾者时不重复出现 */
  function ensurePlayer() {
    var mine = stage.querySelector('.actor[data-id="me"]');
    if (S.caretaker === 'me') { if (mine && mine !== curActor) mine.remove(); return; }
    if (mine && mine !== curActor) return;
    var el = makeActor('me');
    el._cx = -130; el._gy = 614; placeActor(el);
    setTimeout(function () { walkTo(el, 248, 614, 560); }, 60);
  }

  function renderFamily() {
    var bar = $('familybar');
    bar.innerHTML = '';
    CHARS.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'fam' + (c.id === S.caretaker ? ' on' : '');
      b.innerHTML = Art.char(c) + '<span class="nm">' + c.name + '</span>';
      b.onclick = function () { selectChar(c.id); };
      bar.appendChild(b);
    });
    var on = bar.querySelector('.fam.on');
    if (on && on.scrollIntoView) { try { on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } catch (e) { } }
  }

  /* ---- 房间礼物（位置按逻辑坐标换算，缩放变化时重新摆放）---- */
  function placeDecos() {
    Array.prototype.forEach.call(stage.querySelectorAll('.deco'), function (d) {
      d.style.left = L(d._lx) + 'px';
      d.style.top = L(d._ly) + 'px';
      d.style.fontSize = L(d._ls) + 'px';
    });
  }

  function renderDeco() {
    var old = stage.querySelectorAll('.deco');
    for (var i = 0; i < old.length; i++) old[i].remove();
    SHOP.forEach(function (it) {
      if (S.owned.indexOf(it.id) < 0 || !it.deco) return;
      var d = document.createElement('div');
      d.className = 'deco' + (it.deco.behind ? ' behind' : '');
      d.textContent = it.e;
      d.title = it.n;
      d._lx = it.deco.x; d._ly = it.deco.y; d._ls = it.deco.s;
      stage.insertBefore(d, fxLayer);
    });
    placeDecos();
  }

  /* ============================================================
   * 六、特效
   * ============================================================ */
  function say(text, x, y, ms) {
    var b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = text;
    b.style.left = L(x) + 'px';
    b.style.top = L(y) + 'px';
    fxLayer.appendChild(b);
    setTimeout(function () { b.style.transition = 'opacity .3s'; b.style.opacity = '0'; }, (ms || 2200) - 300);
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, ms || 2200);
    return b;
  }

  function pop(x, y, text, cls) {
    var p = document.createElement('div');
    p.className = 'pop' + (cls ? ' ' + cls : '');
    p.textContent = text;
    p.style.left = L(x) + 'px';
    p.style.top = L(y) + 'px';
    fxLayer.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1200);
  }

  function sparks(x, y, emoji, n) {
    for (var i = 0; i < (n || 5); i++) {
      (function (i) {
        setTimeout(function () {
          var s = document.createElement('div');
          s.className = 'spark';
          s.textContent = emoji || '✨';
          var ang = Math.random() * Math.PI * 2, r = 30 + Math.random() * 90;
          var px = x + Math.cos(ang) * r, py = y + Math.sin(ang) * r * 0.6;
          s.style.left = L(px) + 'px';
          s.style.top = L(py) + 'px';
          fxLayer.appendChild(s);
          setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 720);
        }, i * 55);
      })(i);
    }
  }

  function confetti(n) {
    var emo = ['🌟', '💖', '🎉', '✨', '🍬', '🎈'];
    for (var i = 0; i < (n || 18); i++) {
      (function (i) {
        setTimeout(function () {
          var c = document.createElement('div');
          c.className = 'confetti';
          c.textContent = emo[i % emo.length];
          c.style.left = (Math.random() * 96) + 'vw';
          c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
          document.body.appendChild(c);
          setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 3200);
        }, i * 60);
      })(i);
    }
  }

  function toast(msg, ms) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('show'); }, ms || 2000);
  }

  /* ============================================================
   * 七、金币系统
   * ============================================================ */
  function spawnCoins(n, x, y) {
    for (var i = 0; i < n; i++) {
      (function (i) {
        setTimeout(function () {
          var el = document.createElement('div');
          el.className = 'coin';
          el.innerHTML = Art.coin();
          el.style.width = L(64) + 'px';
          el.style.height = L(64) + 'px';
          stage.appendChild(el);
          var c = {
            el: el, x: x, y: y,
            vx: (Math.random() - 0.5) * 380,
            vy: -380 - Math.random() * 220,
            life: 7, size: L(64), sc: SC, dead: false
          };
          el.addEventListener('pointerdown', function (ev) { ev.stopPropagation(); collect(c, true); });
          coins.push(c);
        }, i * 130);
      })(i);
    }
  }

  function collect(c, manual) {
    if (c.dead) return;
    c.dead = true;
    c.el.style.transition = 'transform .45s ease-in, opacity .45s';
    c.el.style.transform = 'translate3d(' + L(1130) + 'px,' + L(30) + 'px,0) scale(.4)';
    c.el.style.opacity = '0';
    setTimeout(function () { if (c.el.parentNode) c.el.parentNode.removeChild(c.el); }, 480);

    S.coins += 1;
    S.lv.coins += 1;
    S.stats.earned += 1;
    bumpCoin();
    Sound.coin(Math.min(6, coins.filter(function (x) { return x.dead; }).length % 7));
    if (manual) pop(c.x, c.y - 10, '+1', 'txt');
    checkLevel();
  }

  function bumpCoin() {
    $('coinNum').textContent = S.coins;
    var b = $('coinBox');
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    save();
  }

  function coinLoop(t) {
    rafId = requestAnimationFrame(coinLoop);
    if (!lastT) lastT = t;
    var dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    for (var i = coins.length - 1; i >= 0; i--) {
      var c = coins[i];
      if (c.dead) { coins.splice(i, 1); continue; }
      c.vy += 1150 * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      if (c.y > 646) { c.y = 646; c.vy *= -0.42; c.vx *= 0.7; if (Math.abs(c.vy) < 40) c.vy = 0; }
      if (c.x < 30) { c.x = 30; c.vx = Math.abs(c.vx); }
      if (c.x > 1170) { c.x = 1170; c.vx = -Math.abs(c.vx); }
      if (c.sc !== SC) { c.sc = SC; c.size = L(64); c.el.style.width = c.size + 'px'; c.el.style.height = c.size + 'px'; }
      c.el.style.transform = 'translate3d(' + (L(c.x) - c.size / 2) + 'px,' + (L(c.y) - c.size / 2) + 'px,0)';
      c.life -= dt;
      if (c.life <= 0) collect(c, false);
    }
  }

  /* ============================================================
   * 八、照顾动作
   * ============================================================ */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function starCoin(action) {
    var c = cfgOf(S.caretaker);
    if (!c) return 0;
    return (c.star === action || c.star === 'all') ? c.coin : 0;
  }

  function updateBars() {
    var b = S.baby;
    $('barFull').style.width = b.full + '%';
    $('barMood').style.width = b.mood + '%';
    $('barClean').style.width = b.clean + '%';
    $('numFull').textContent = Math.round(b.full);
    $('numMood').textContent = Math.round(b.mood);
    $('numClean').textContent = Math.round(b.clean);
  }

  function updateHUD() {
    $('coinNum').textContent = S.coins;
    $('keyNum').textContent = S.keys;
    updateBars();
    $('btnMusic').classList.toggle('off', !S.set.music);
  }

  /* 飞行食物 */
  function flyItem(emoji, fromEl, tx, ty, dur, done) {
    var r = fromEl.getBoundingClientRect();
    var sr = stage.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'flyer';
    el.textContent = emoji;
    el.style.left = (r.left + r.width / 2 - 23) + 'px';
    el.style.top = (r.top + r.height / 2 - 28) + 'px';
    document.body.appendChild(el);
    var dx = (sr.left + L(tx)) - (r.left + r.width / 2);
    var dy = (sr.top + L(ty)) - (r.top + r.height / 2);
    requestAnimationFrame(function () {
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.75) rotate(20deg)';
    });
    setTimeout(function () {
      el.style.opacity = '0';
      if (el.parentNode) el.parentNode.removeChild(el);
      if (done) done();
    }, dur || 560);
  }

  var MOUTH = { x: 420, y: 458 };
  var cd = { feed: 0, play: 0, bath: 0 };   // 各动作冷却（秒）

  function cdLeft(k) { return cd[k] > 0; }

  function updateDockCd() {
    ['feed', 'play', 'bath'].forEach(function (k) {
      var b = document.querySelector('.dock-btn[data-open="' + k + '"]');
      if (b) b.classList.toggle('cool', cd[k] > 0);
    });
  }

  /* ---- 喂食 ---- */
  function feed(food, btn) {
    if (busy) return;
    var b = S.baby;
    if (cdLeft('feed')) { Sound.refuse(); return; }
    if (b.full >= 96) {
      Sound.refuse();
      say('宝宝：吃饱啦～', 420, 372);
      pop(420, 400, '😊 不饿了', 'txt');
      return;
    }
    busy = true;
    cd.feed = 2;
    updateDockCd();
    Sound.eat();
    flyItem(food.e, btn, MOUTH.x, MOUTH.y - 40, 560, function () {
      closeAll();
      babyStateSet('eat');
      setTimeout(function () { babyStateSet(''); busy = false; }, 900);
      setTimeout(function () {
        var hungry = b.full < 32;
        b.full = clamp(b.full + food.full, 0, 100);
        b.mood = clamp(b.mood + food.mood, 0, 100);
        S.stats.feed++; S.lv.feed++;
        var gain = food.coin + starCoin('feed') + (hungry ? 1 : 0);
        babyStateSet('happy');
        Sound.happy();
        sparks(420, 420, '💖', 6);
        say('宝宝：好好吃！谢谢' + cfgOf(S.caretaker).name + '～', 420, 372);
        setTimeout(function () {
          if (!sleeping) babyStateSet('');
        }, 1600);
        spawnCoins(gain, 420, 430);
        pop(420, 392, '😋 +' + food.full + ' 饱腹', 'txt');
        checkLevel();
        updateBars();
      }, 900);
    });
  }

  /* ---- 玩耍 ---- */
  function play(toy, btn) {
    if (busy) return;
    var b = S.baby;
    if (b.full < 12) {
      Sound.refuse();
      say('宝宝饿了，先吃饭吧～', 420, 372);
      return;
    }
    if (cdLeft('play')) { Sound.refuse(); say('宝宝想歇一小会儿～', 420, 372); return; }
    busy = true;
    cd.play = 4;
    updateDockCd();
    flyItem(toy.e, btn, 420, 400, 520, function () {
      closeAll();
      var tired = b.mood >= 92;
      b.mood = clamp(b.mood + toy.mood, 0, 100);
      b.full = clamp(b.full - 2, 0, 100);
      S.stats.play++; S.lv.play++;
      babyStateSet('happy');
      Sound.happy();
      sparks(420, 400, toy.e, 7);
      say(tired ? '宝宝：玩累啦，抱抱～' : '宝宝：咯咯咯～好开心！', 420, 372);
      setTimeout(function () { if (!sleeping) babyStateSet(''); busy = false; }, 1500);
      spawnCoins(tired ? 1 : toy.coin + starCoin('play'), 420, 430);
      pop(420, 392, '😄 +' + toy.mood + ' 心情', 'txt');
      checkLevel(); updateBars();
    });
  }

  /* ---- 洗澡 ---- */
  function bath() {
    if (busy) return;
    if (cdLeft('bath')) { Sound.refuse(); say('宝宝刚洗过，香香的～', 420, 372); return; }
    busy = true;
    cd.bath = 10;
    updateDockCd();
    Sound.water();
    var b = S.baby;
    var dirty = Math.round((100 - b.clean) / 25);
    b.clean = 100;
    b.mood = clamp(b.mood + 6, 0, 100);
    S.stats.bath++; S.lv.bath++;
    for (var i = 0; i < 14; i++) {
      (function (i) {
        setTimeout(function () {
          var s = document.createElement('div');
          s.className = 'spark';
          s.textContent = '💭';
          s.style.left = L(420 + (Math.random() - 0.5) * 190) + 'px';
          s.style.top = L(430 + (Math.random() - 0.5) * 130) + 'px';
          s.style.fontSize = L(30) + 'px';
          fxLayer.appendChild(s);
          setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 900);
        }, i * 70);
      })(i);
    }
    babyStateSet('happy');
    say('宝宝：香香的～', 420, 372);
    setTimeout(function () { if (!sleeping) babyStateSet(''); }, 1400);
    var gain = 2 + dirty + starCoin('bath');
    spawnCoins(Math.max(1, gain), 420, 430);
    pop(420, 392, '🛁 洗干净啦', 'txt');
    Sound.happy();
    checkLevel(); updateBars(); save();
    setTimeout(function () { busy = false; }, 900);
  }

  /* ---- 睡觉 ---- */
  function sleep() {
    if (sleeping) return;
    sleeping = true;
    var b = S.baby;
    S.stats.sleep++; S.lv.sleep++;
    babyStateSet('sleep');
    say('嘘～宝宝要睡觉觉了', 420, 372, 2600);
    var zz = setInterval(function () {
      if (!sleeping) return;
      var s = document.createElement('div');
      s.className = 'spark';
      s.textContent = '💤';
      s.style.left = L(500 + Math.random() * 40) + 'px';
      s.style.top = L(400) + 'px';
      s.style.fontSize = L(30) + 'px';
      fxLayer.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 900);
    }, 900);

    var prevTrack = S.set.track;
    if (S.set.music) { Sound.setTrack(1); }
    clearTimeout(sleepTimer);
    sleepTimer = setTimeout(function () {
      sleeping = false; clearInterval(zz);
      if (S.set.music) Sound.setTrack(prevTrack);
      var gain = 5 + starCoin('sleep');
      b.mood = clamp(b.mood + 20, 0, 100);
      b.full = clamp(b.full - 3, 0, 100);
      babyStateSet('happy');
      Sound.happy();
      say('宝宝睡醒啦，笑得真甜！', 420, 372);
      setTimeout(function () { babyStateSet(''); }, 1500);
      spawnCoins(gain, 420, 430);
      pop(420, 392, '😴 心情 +20', 'txt');
      checkLevel(); updateBars(); save();
    }, 16000);
  }

  /* ============================================================
   * 九、商店 / 关卡
   * ============================================================ */
  function renderShop() {
    var g = $('shopGrid');
    g.innerHTML = '';
    SHOP.forEach(function (it) {
      var owned = S.owned.indexOf(it.id) >= 0;
      var can = S.coins >= it.price;
      var b = document.createElement('button');
      b.className = 'tile' + (owned ? ' owned' : (can ? '' : ' cant'));
      b.innerHTML =
        (owned ? '<span class="badge">已拥有</span>' : '') +
        '<span class="ic">' + it.e + '</span>' +
        '<span class="nm">' + it.n + '</span>' +
        '<span class="price">' + Art.coin() + (owned ? '已换' : it.price) + '</span>' +
        '<span class="sub">心情 +' + it.mood + '</span>';
      b.onclick = function () { buy(it); };
      g.appendChild(b);
    });
  }

  function buy(it) {
    if (S.owned.indexOf(it.id) >= 0) { Sound.refuse(); toast('这个已经有啦～'); return; }
    if (S.coins < it.price) { Sound.refuse(); toast('金币还不够，再去照顾宝宝吧！'); return; }
    S.coins -= it.price;
    S.owned.push(it.id);
    S.baby.mood = clamp(S.baby.mood + it.mood, 0, 100);
    Sound.levelup();
    confetti(14);
    sparks(420, 400, '🎉', 8);
    toast('换到啦：' + it.e + ' ' + it.n + '！', 2200);
    babyStateSet('happy');
    setTimeout(function () { if (!sleeping) babyStateSet(''); }, 1500);
    renderShop(); renderDeco(); updateHUD(); save();
  }

  function levelProgress() {
    var lv = LEVELS[S.level];
    if (!lv) return { cur: 1, need: 1, txt: '全部通关啦！' };
    var cur = 0, need = lv.need, txt = '';
    if (lv.goal === 'feed') { cur = S.lv.feed; txt = cur + ' / ' + need + ' 次'; }
    else if (lv.goal === 'play') { cur = S.lv.play; txt = cur + ' / ' + need + ' 次'; }
    else if (lv.goal === 'bath') { cur = S.lv.bath; txt = cur + ' / ' + need + ' 次'; }
    else if (lv.goal === 'coins') { cur = S.lv.coins; txt = cur + ' / ' + need + ' 金币'; }
    else if (lv.goal === 'full') { cur = Math.round(S.baby.full); txt = '饱腹度 ' + cur + ' / ' + need; }
    else if (lv.goal === 'both') {
      cur = Math.floor(Math.min(S.baby.full, S.baby.mood));
      txt = '饱腹 ' + Math.round(S.baby.full) + ' · 心情 ' + Math.round(S.baby.mood) + '（都要到 ' + need + '）';
    }
    return { cur: cur, need: need, txt: txt };
  }

  function checkLevel() {
    var lv = LEVELS[S.level];
    if (!lv) return;
    var p = levelProgress();
    if (p.cur >= p.need) {
      S.keys += 1;
      S.rewards.push(LEVELS[S.level].reward);
      S.level += 1;
      S.lv = { feed: 0, play: 0, bath: 0, sleep: 0, coins: 0 };
      Sound.levelup();
      confetti(20);
      toast('🎉 通关啦！获得 1 把钥匙，快去开宝箱！', 3000);
      updateHUD(); renderQuest(); save();
    } else {
      renderQuest();
    }
  }

  function renderQuest() {
    var lv = LEVELS[S.level];
    var p = levelProgress();
    var card = $('questCard');
    if (!lv) {
      card.innerHTML = '<h3>🏆 全部通关！</h3><p>你是最棒的照顾小能手！继续照顾宝宝赚金币吧～</p>';
    } else {
      var pct = Math.min(100, Math.round(p.cur / p.need * 100));
      card.innerHTML = '<h3>第 ' + (S.level + 1) + ' 关 · ' + lv.t + '</h3>' +
        '<p>奖励：打开宝箱可得 ' + lv.reward + ' 金币</p>' +
        '<div class="qbar"><i style="width:' + pct + '%"></i></div>' +
        '<p style="margin-top:6px">进度：' + p.txt + '</p>';
    }
    var ch = $('chest');
    ch.className = 'chest' + (S.keys > 0 ? '' : ' locked');
    $('chestInfo').innerHTML = '你有 <b>' + S.keys + '</b> 把钥匙<br>' +
      (S.keys > 0 ? '宝箱里有 ' + (S.rewards[0] || 30) + ' 金币，点一下打开吧！' : '完成上面的任务就能拿到钥匙');

    var list = $('levelList');
    list.innerHTML = '';
    LEVELS.forEach(function (l, i) {
      var row = document.createElement('div');
      row.className = 'level-row' + (i < S.level ? ' done' : (i === S.level ? ' now' : ' lock'));
      row.innerHTML = '<span class="no">' + (i < S.level ? '✔' : (i + 1)) + '</span>' +
        '<span>' + l.t + '</span>' +
        '<span class="stars">' + (i < S.level ? '⭐⭐⭐' : (i === S.level ? '⏳' : '🔒')) + '</span>';
      list.appendChild(row);
    });
  }

  function openChest() {
    if (S.keys <= 0) { Sound.refuse(); toast('还没有钥匙哦，先完成任务吧！'); return; }
    S.keys -= 1;
    var reward = S.rewards.length ? S.rewards.shift() : 30;
    S.coins += reward;
    Sound.open();
    confetti(26);
    var ch = $('chest');
    ch.classList.add('open');
    setTimeout(function () { ch.classList.remove('open'); }, 900);
    toast('🎁 宝箱打开啦！获得 ' + reward + ' 金币！', 2600);
    for (var i = 0; i < 10; i++) {
      (function (i) {
        setTimeout(function () { sparks(420, 430, '💰', 1); }, i * 90);
      })(i);
    }
    updateHUD(); renderShop(); renderQuest(); save();
  }

  /* ============================================================
   * 十、界面交互
   * ============================================================ */
  function openSheet(name) {
    Sound.click();
    closeAll();
    var ov = $('ov-' + name);
    if (!ov) return;
    if (name === 'shop') renderShop();
    if (name === 'quest') renderQuest();
    ov.classList.add('show');
  }
  function closeAll() {
    ['feed', 'play', 'shop', 'quest', 'set'].forEach(function (n) {
      var ov = $('ov-' + n);
      if (ov) ov.classList.remove('show');
    });
  }

  function buildSheets() {
    var fg = $('foodGrid');
    FOODS.forEach(function (f) {
      var b = document.createElement('button');
      b.className = 'tile';
      b.innerHTML = '<span class="ic">' + f.e + '</span><span class="nm">' + f.n + '</span>' +
        '<span class="sub">饱腹 +' + f.full + '</span>' +
        '<span class="price">' + Art.coin() + f.coin + '</span>';
      b.onclick = function () { feed(f, b); };
      fg.appendChild(b);
    });

    var tg = $('toyGrid');
    TOYS.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'tile';
      b.innerHTML = '<span class="ic">' + t.e + '</span><span class="nm">' + t.n + '</span>' +
        '<span class="sub">心情 +' + t.mood + '</span>' +
        '<span class="price">' + Art.coin() + t.coin + '</span>';
      b.onclick = function () { play(t, b); };
      tg.appendChild(b);
    });
  }

  function buildSettings() {
    var box = $('trackBtns');
    box.innerHTML = '';
    TRACKS.forEach(function (t, i) {
      var b = document.createElement('button');
      b.className = 'track-btn' + (i === S.set.track ? ' on' : '');
      b.textContent = '🎼 ' + t.name;
      b.style.marginRight = '6px';
      b.onclick = function () {
        S.set.track = i;
        Sound.setTrack(i);
        Sound.click();
        buildSettings();
        save();
        toast('音乐切换为：' + t.name);
      };
      box.appendChild(b);
    });
    $('swMusic').className = 'switch' + (S.set.music ? ' on' : '');
    $('swSfx').className = 'switch' + (S.set.sfx ? ' on' : '');
  }

  function toggleMusic() {
    S.set.music = !S.set.music;
    if (S.set.music) { Sound.resume(); Sound.setTrack(S.set.track); Sound.play(); }
    else Sound.stop();
    $('btnMusic').classList.toggle('off', !S.set.music);
    $('btnMusic').textContent = S.set.music ? '🎵' : '🔇';
    buildSettings(); save();
  }

  function bindUI() {
    /* 底部按钮 */
    Array.prototype.forEach.call(document.querySelectorAll('.dock-btn'), function (b) {
      b.onclick = function () {
        var k = b.dataset.open;
        if (k === 'bath') { bath(); return; }
        if (k === 'sleep') { sleep(); return; }
        openSheet(k);
      };
    });
    /* 关闭 */
    Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function (b) {
      b.onclick = function () { Sound.click(); closeAll(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll('.overlay'), function (ov) {
      ov.addEventListener('pointerdown', function (e) { if (e.target === ov) closeAll(); });
    });
    $('btnMusic').onclick = toggleMusic;
    $('btnSet').onclick = function () { buildSettings(); openSheet('set'); };
    $('chest').onclick = openChest;
    $('swMusic').onclick = function () { S.set.music = !S.set.music; toggleMusic(); };
    $('swSfx').onclick = function () { S.set.sfx = !S.set.sfx; Sound.click(); buildSettings(); save(); };
    $('btnReset').onclick = function () {
      if (confirm('要重新开始吗？所有金币和进度都会清空哦～')) {
        S = freshState();
        try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
        renderFamily(); renderDeco(); renderShop(); renderQuest(); updateHUD();
        selectChar('mom', true);
        toast('已重新开始，一起去照顾宝宝吧！');
      }
    };
    $('btnStart').onclick = function () {
      $('splash').classList.add('gone');
      Sound.resume();
      if (S.set.music) { Sound.setTrack(S.set.track); Sound.play(); }
      setTimeout(function () { $('splash').style.display = 'none'; }, 550);
      toast('选一位家人，去照顾小宝宝吧！', 2600);
      selectChar(S.caretaker, true);
    };
    window.addEventListener('resize', fitStage);
    window.addEventListener('orientationchange', function () { setTimeout(fitStage, 300); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });
    window.addEventListener('beforeunload', save);
  }

  /* ============================================================
   * 十一、主循环
   * ============================================================ */
  var cryCool = 0;
  function tick() {
    var b = S.baby;
    if (sleeping) {
      b.mood = clamp(b.mood + 1.2, 0, 100);
      b.full = clamp(b.full - 0.05, 0, 100);
      b.clean = clamp(b.clean - 0.02, 0, 100);
    } else {
      b.full = clamp(b.full - 0.15, 0, 100);
      b.mood = clamp(b.mood - (b.full < 20 ? 0.28 : 0.08), 0, 100);
      b.clean = clamp(b.clean - 0.05, 0, 100);
    }

    /* 哭闹表现 */
    var shouldCry = !sleeping && (b.full < 15 || b.mood < 15);
    if (shouldCry && babyState !== 'cry') babyStateSet('cry');
    if (!shouldCry && babyState === 'cry') babyStateSet('');
    cryCool -= 1;
    if (shouldCry && cryCool <= 0) {
      cryCool = 14;
      say(b.full < 15 ? '宝宝：饿饿～呜哇～' : '宝宝：抱抱我～呜哇～', 420, 372, 2400);
      Sound.refuse();
    }
    /* 提示小气泡 */
    if (!shouldCry && !sleeping && b.full < 40 && Math.random() < 0.06) {
      say('宝宝：肚子咕咕叫～', 420, 372, 1800);
    }
    updateBars();
    renderQuestLight();
    var k, cooled = false;
    for (k in cd) { if (cd[k] > 0) { cd[k] -= 1; cooled = true; } }
    if (cooled) updateDockCd();
    save();
  }

  var lastQuestTxt = '';
  function renderQuestLight() {
    var p = levelProgress();
    var t = p.cur + '|' + p.need;
    if (t !== lastQuestTxt) { lastQuestTxt = t; renderQuest(); }
  }

  /* ============================================================
   * 十二、启动
   * ============================================================ */
  function boot() {
    load();
    buildStage();
    buildSheets();
    bindUI();
    renderFamily();
    renderQuest();
    renderShop();
    buildSettings();
    updateHUD();
    $('coinIcon').innerHTML = Art.coin();
    $('keyIcon').innerHTML = Art.key();
    $('btnMusic').textContent = S.set.music ? '🎵' : '🔇';

    /* 开屏小人 */
    var sc = $('splashChars');
    ['gpa', 'gma', 'dad', 'mom', 'me', 'bro', 'sis'].forEach(function (id) {
      var d = document.createElement('span');
      d.innerHTML = Art.char(cfgOf(id));
      var svg = d.firstChild;
      svg.style.width = '46px'; svg.style.height = '76px';
      sc.appendChild(svg);
    });

    fitStage();
    requestAnimationFrame(coinLoop);
    setInterval(tick, 1000);
    updateBars();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
