class Player {
  constructor() {
    this.player = document.querySelector('.player');
    this.video = this.player.querySelector('.viewer');
    this.progress = document.querySelector('.progress');
    this.progressFilled = this.progress.querySelector('.progress__filled');
    this.toggle = document.querySelector('.toggle');
    this.ranges = document.querySelectorAll('.player__slider');
    this.skipBtns = document.querySelectorAll('[data-skip]');
    this.mouseDown = false;
  }
  
  init() {
    this.events();
  }

  events() {
    document.addEventListener('DOMContentLoaded', e => this.loadPage(e))
    this.video.addEventListener('click', (e) => this.togglePlay());
    this.toggle.addEventListener('click', (e) => this.togglePlay());
    this.ranges.forEach((item) => item.addEventListener('change', (e) => this.handleRangeUpdate(e)));
    this.ranges.forEach((item) => item.addEventListener('mousemove', (e) => this.handleRangeUpdate(e)));
    this.skipBtns.forEach((btn) => btn.addEventListener('click', (e) => this.skip(e)));
    this.video.addEventListener('timeupdate', e => this.rangeTime(e));
    this.progress.addEventListener('click', e => this.rangeBar(e));
    this.progress.addEventListener('mousemove', e => this.mouseDown && this.rangeBar(e));
    this.progress.addEventListener('mousedown', e => this.mouseDown = true);
    this.progress.addEventListener('mouseup', e => this.mouseDown = false);
  }

  togglePlay() {
    let statusVideo = this.video.paused ? 'play' : 'pause';
    this.toggle.textContent = this.video.paused ? '||' : '>';
    return this.video[statusVideo]();
  }

  handleRangeUpdate(e) {
    this.video[e.target.name] = e.target.value;
  }

  skip(e) {
    this.video.currentTime += parseFloat(e.target.dataset.skip);
  }

  rangeTime(e) {
    this.progressFilled.style.width = (100 / this.video.duration) * this.video.currentTime + '%';
  }

  rangeBar(e) {
      this.video.currentTime = (e.pageX / this.progress.clientWidth) * this.video.duration;
  }

  loadPage(e) {
    if (localStorage.length === 0) {
      localStorage.setItem(thi)
    }
  }


}

const video = new Player();
video.init();
