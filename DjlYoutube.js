'use strict';

export default class DjlYoutube extends HTMLElement {
  static ytApi = null; /* Populated by onYouTubeIframeAPIReady */
  static {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = function() {
      DjlYoutube.ytApi = YT
      Array.from(document.querySelectorAll('djl-youtube'))
        .forEach(e => e.onYouTubeIframeAPIReady())
    }
  }
  static maxElementId = 0

  static get observedAttributes() {
    return [ 'height', 'width', 'videoid' ];
  }

  get height() { return this.getAttribute('height') || 640; }
  set height(x) { return this.setAttribute('height', x); }

  get width() { return this.getAttribute('width') || 480; }
  set width(x) { return this.setAttribute('width', x); }

  get videoid() { return this.getAttribute('videoid'); }
  set videoid(x) { return this.setAttribute('videoid', x); }

  element;
  player; // YT.player controller

  constructor() {
    super();

    this.element = document.createElement('div')
    this.element.id = `__djl_youtube_player_${DjlYoutube.maxElementId}`;
    DjlYoutube.maxElementId += 1;
    this.appendChild(this.element);

    if (DjlYoutube.ytApi) this.onYouTubeIframeAPIReady();
  }

  onYouTubeIframeAPIReady() {
    const player = new DjlYoutube.ytApi.Player(this.element.id, {
      height: this.height,
      width: this.width,
      videoId: this.videoid,
      playerVars: {
        playsinline: 1
      },
      events: {
        /* Don't expose the player until it's fully initialized! */
        onReady: () => this.player = player
      }
    });
  }

  attributeChangedCallback() {
    /* Try again in 500ms if we're not done loading the player */
    if (!this.player)
      return setTimeout(() => this.attributeChangedCallback(), 500);

    console.log(this.player);
    this.player.setSize(this.width, this.height);
    if (this.player.getVideoData()?.video_id != this.videoid)
      this.player.loadVideoById(this.videoid);
  }
}

customElements.define('djl-youtube', DjlYoutube);

