function drawBgImage(captchaData, drawWidth, drawHeight, callback) {
  if (!captchaData.data || !captchaData.data.shuffle) {
    return
  }
  const shuffle = captchaData.data.shuffle;
  const sourceImageWidth = captchaData.backgroundImageWidth;
  const sourceImageHeight = captchaData.backgroundImageHeight;
  const xNum = shuffle.x;
  const yNum = shuffle.y;
  const pos = shuffle.pos;
  const arr = [];
  const sourceBlockX = sourceImageWidth / xNum;
  const sourceBlockY = sourceImageHeight / yNum;
  const blockX = drawWidth / xNum;
  const blockY = drawHeight / yNum;
  const sourceImageBlocks = [];
  const imageBlocks = [];
  for (let i = 0; i < yNum; i++) {
    for (let o = 0; o < xNum; o++) {
      sourceImageBlocks.push({
        startX: Math.floor(o * sourceBlockX),
        startY: Math.floor(i * sourceBlockY)
      });
      imageBlocks.push({
        startX: Math.round(o * blockX),
        startY: Math.round(i * blockY)
      });
    }
  }
  for (let i = 0; i < pos.length; i++) {
    const p = pos[i]
    const sourceBlock = sourceImageBlocks[p];
    const block = imageBlocks[i];
    let style = `width:${blockX}px;height:${blockY}px;left:${block.startX}px;top:${block.startY}px;background-image:url('${captchaData.backgroundImage}');background-size:${drawWidth}px ${drawHeight}px;background-position:-${sourceBlock.startX*(drawWidth / sourceImageWidth)}px -${sourceBlock.startY*(drawHeight / sourceImageHeight)}px`
    arr.push(style);
  }
  setTimeout(() => {
    arr.forEach((el, index) => {
      callback({
        a: index,
        b: el
      });
    })
  }, 200)
}

function getTrackByEvent(event, requestData) {
  let touchEvent;
  if (event.touches && event.touches.length > 0) {
    touchEvent = event.touches[0];
  } else if (event.changedTouches && event.changedTouches.length > 0) {
    touchEvent = event.changedTouches[0];
  } else {
    throw new Error("未知的event", event);
  }
  const clientX = Math.round(touchEvent.clientX);
  const clientY = Math.round(touchEvent.clientY);
  const type = event.type === "touchstart" ? "down" : event.type === "touchmove" ? "move" : event.type === "touchend" ? "up" : "click"
  return {
    x: clientX,
    y: clientY,
    type: type,
    t: new Date().getTime() - requestData.startTime.getTime()
  }
}

function getLeftTop(el, that, callback) {
  wx.createSelectorQuery()
    .in(that)
    .select(el)
    .boundingClientRect(res => {
      callback([Math.round(res.left), Math.round(res.top)]);
    }).exec();
}

function enc(requestData) {
  const encData = [];
  encData.push(pretreatment(requestData.startTime, 7, true))
  encData.push(pretreatment(requestData.stopTime, 7, true))
  encData.push(pretreatment(Math.round(requestData.bgImageWidth), 3, true))
  encData.push(pretreatment(Math.round(requestData.bgImageHeight), 3, true))
  encData.push(pretreatment(Math.round(requestData.templateImageWidth), 3, true))
  encData.push(pretreatment(Math.round(requestData.templateImageHeight), 3, true))
  encData.push(pretreatment(Math.round(requestData.left), 3, true))
  encData.push(pretreatment(Math.round(requestData.top), 3, true))
  encData.push(pretreatment(requestData.trackList.length, 3, true))
  encData.push(encryptTrack(requestData.trackList))
  if (requestData.data) {
    encData.push(encodeStr(JSON.stringify(requestData.data)));
  }
  return encData.join("");
}

function encodeStr(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    bytes.push(c);
  }
  return bytes.join(",");
}

function encryptTrack(trackList) {
  const encTrackList = [];
  for (let i = 0; i < trackList.length; i++) {
    let track = trackList[i];
    let type = 0;
    switch (track.type) {
      case "down":
        type = 0;
        break;
      case "move":
        type = 1;
        break;
      case "up":
        type = 2;
        break;
      case "click":
        type = 3;
    }
    if (i === 0) {
      encTrackList.push(pretreatment(Math.round(track.x), 3, false));
      encTrackList.push(pretreatment(Math.round(track.y), 3, false));
      encTrackList.push(pretreatment(Math.round(track.t), 4, true));
      encTrackList.push(type);
    } else {
      let preTrack = trackList[i - 1];
      encTrackList.push(pretreatment(Math.round(track.x - preTrack.x), 3, false));
      encTrackList.push(pretreatment(Math.round(track.y - preTrack.y), 3, false));
      encTrackList.push(pretreatment(Math.round(track.t - preTrack.t), 4, true));
      encTrackList.push(type);
    }
  }
  return encTrackList.join("");
}

function pretreatment(data, count, c) {
  const e = string10to64(Math['abs'](data));
  let f = '';
  if (!c) {
    f += data >= 0 ? '1' : '0';
  }
  f += prefixInteger(e, count);
  return f;
}

function prefixInteger(a, b) {
  return (Array(b).join(0) + a).slice(-b);
}

function string10to64(data) {
  let dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~' ['split'](''),
    count = dict.length,
    d = +data,
    e = [];
  do {
    let mod = d % count;
    d = (d - mod) / count;
    e.unshift(dict[mod]);
  } while (d);
  return e.join('');
}

module.exports = {
  drawBgImage,
  getTrackByEvent,
  getTrackByEvent,
  getLeftTop,
  enc
}