const anchor = document.getElementById("anchor");
const video = document.getElementById("video");

const scroll = Rx.Observable.fromEvent(document, "scroll");
const mouseDown = Rx.Observable.fromEvent(video, "mousedown");
const mouseMove = Rx.Observable.fromEvent(document, "mousemove");
const mouseUp = Rx.Observable.fromEvent(document, "mouseup");

scroll
  .map(e => anchor.getBoundingClientRect().bottom < 0) // 此 dom 物件的最底部，距離可視範圍的最上面
  .subscribe(bool => {
    if (bool) {
      video.classList.add("video-fixed");
    } else {
      video.classList.remove("video-fixed");
    }
  });

// 判斷是否超出有效範圍
const validValue = (value, max, min) => Math.min(Math.max(value, min), max);

// top -> min: 0, max: window.innerheight - 180
// left -> min: 0, max: window.innerWidth - 320

mouseDown
  .filter(e => video.classList.contains("video-fixed"))
  .map(e => mouseMove.takeUntil(mouseUp))
  .concatAll()
  .withLatestFrom(mouseDown, (move, down) => ({
    // 每次有 mousemove 就會進行以下 callback
    x: validValue(move.clientX - down.offsetX, window.innerWidth - 320, 0),
    y: validValue(move.clientY - down.offsetY, window.innerHeight - 180, 0)
    // client: 可視範圍最上端，到點按位置
    // offset: 點案元件的最上端，到點按位置
  }))
  .subscribe(pos => {
    video.style.left = pos.x + "px";
    video.style.top = pos.y + "px";
  });
