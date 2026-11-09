/* ds 2.24.1 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
/* The icons of the apps, one sprite for all of them: <svg class="ico" aria-hidden="true"><use href="#i-wallet"/></svg>.
   Each is drawn on a 24 grid; .ico gives the stroke, its width and its colour (currentColor), and a brand's logo is
   filled with that colour. This script puts the sprite at the top of the page, so a page keeps writing #i-name and
   needs no copy of its own; an app's older copy of the same icons can stay until it goes, the first one is used.
   The first 39 were drawn for Bank and Studio. The others come from Lucide (lucide.dev) and, for the brands' logos,
   from Simple Icons (simpleicons.org), whose notices follow.

   Lucide:
   ISC License

   Copyright (c) 2026 Lucide Icons and Contributors

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted, provided that the above
   copyright notice and this permission notice appear in all copies.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

   Some of Lucide's icons come from Feather:
   The MIT License (MIT) (for the icons listed above)

   Copyright (c) 2013-present Cole Bemis

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.

   Simple Icons: CC0 1.0 Universal, no rights reserved. The logos remain their brands' trademarks: they show a link
   to that brand (a profile, a payment), nothing more. */
(function () {
  var sprite = `
  <symbol id="i-alert" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/></symbol>
  <symbol id="i-book" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 17a3.5 3.5 0 0 1 7 0M3 7h2M3 12h2M3 17h2"/></symbol>
  <symbol id="i-bsky" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M12 11.5C10.5 8.4 7.4 5 4.9 5 3.5 5 3 6 3 7.4c0 2.1 1 4.6 3.6 5.1-2.1.7-2.6 2.6-1.1 3.9 1.9 1.7 4.6.3 6.5-3.4 1.9 3.7 4.6 5.1 6.5 3.4 1.5-1.3 1-3.2-1.1-3.9 2.6-.5 3.6-3 3.6-5.1C21 6 20.5 5 19.1 5c-2.5 0-5.6 3.4-7.1 6.5z"/></symbol>
  <symbol id="i-cal" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></symbol>
  <symbol id="i-cam" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M3 8h3l1.5-2h9L18 8h3v11H3z"/><circle cx="12" cy="13" r="3.4"/></symbol>
  <symbol id="i-chart" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 20h16M7 16V10M12 16V5M17 16v-4"/></symbol>
  <symbol id="i-chat" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></symbol>
  <symbol id="i-check" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></symbol>
  <symbol id="i-coin" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M15 8.6a4 4 0 1 0 0 6.8M7.5 11h6M7.5 13.5h6"/></symbol>
  <symbol id="i-cursor" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M6 3.5l12 7.2-5.3 1.4 3.3 6-2.6 1.4-3.3-6L6 17.5z"/></symbol>
  <symbol id="i-doc" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></symbol>
  <symbol id="i-eye" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></symbol>
  <symbol id="i-eyeoff" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.7M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18 12 18c1.7 0 3.2-.5 4.5-1.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></symbol>
  <symbol id="i-face" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 6"/></symbol>
  <symbol id="i-gift" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="9" rx="1.5"/><rect x="3" y="7.5" width="18" height="3.5" rx="1"/><path d="M12 7.5V20"/><path d="M12 7.5C10.5 4.5 7 4 7 6s3 1.5 5 1.5zM12 7.5c1.5-3 5-3.5 5-1.5s-3 1.5-5 1.5z"/></symbol>
  <symbol id="i-globe" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c4 4.5 4 12.5 0 17M12 3.5c-4 4.5-4 12.5 0 17"/></symbol>
  <symbol id="i-grip" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14"/></symbol>
  <symbol id="i-heart" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.8 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.4 0 5.6 3.3 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3z"/></symbol>
  <symbol id="i-ig" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.9 7.1v.1"/></symbol>
  <symbol id="i-link" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></symbol>
  <symbol id="i-list" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5L7.5 11M3.5 18l1.5 1.5L7.5 17"/></symbol>
  <symbol id="i-lock" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/></symbol>
  <symbol id="i-mail" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/></symbol>
  <symbol id="i-pen" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M17 3.5a2.1 2.1 0 0 1 3 3L8 18.5 3.5 20.5 5.5 16z"/><path d="M15 5.5l3 3"/></symbol>
  <symbol id="i-plane" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M10.5 13.5 3 11l1.5-1.5 7.5 1L16 6c1-1 2.5-1.5 3.5-.5s.5 2.5-.5 3.5l-4.5 4.5 1 7.5L14 22.5l-2.5-7.5L8 18.5V21l-1.5 1.5L5 18l-3.5-1.5L3 15h2.5z"/></symbol>
  <symbol id="i-reload" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 1 1-2.3-5.4"/><path d="M19.6 4.2v4.4h-4.4"/></symbol>
  <symbol id="i-repost" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 11V8a2 2 0 0 1 2-2h12l-3-3M20 13v3a2 2 0 0 1-2 2H6l3 3"/></symbol>
  <symbol id="i-retry" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 1 1-2.3-5.4"/><path d="M19.6 4.2v4.4h-4.4"/></symbol>
  <symbol id="i-rise" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 17l5-6 4 3 6-8"/><path d="M15 6h4v4"/></symbol>
  <symbol id="i-send" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 12l16-7-7 16-2-7z"/></symbol>
  <symbol id="i-server" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M8 7.5h.01M8 16.5h.01"/></symbol>
  <symbol id="i-sliders" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></symbol>
  <symbol id="i-sport" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M6.5 8v8M17.5 8v8M3.5 10v4M20.5 10v4M6.5 12h11"/></symbol>
  <symbol id="i-star" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M12 4l2.4 5 5.6.7-4.1 3.8 1 5.5L12 16.4 7.1 19l1-5.5L4 9.7 9.6 9z"/></symbol>
  <symbol id="i-sun" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></symbol>
  <symbol id="i-tasks" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.5l3 3 5-6"/></symbol>
  <symbol id="i-trash" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5"/></symbol>
  <symbol id="i-wallet" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path d="M5 7.5A2.5 2.5 0 0 1 7.5 5H17v3"/><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M15.5 13.5h2"/></symbol>
  <symbol id="i-xlogo" data-group="Les premières, de Bank et Studio" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></symbol>
  <symbol id="i-close" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M18 6 6 18" /> <path d="m6 6 12 12" /></symbol>
  <symbol id="i-plus" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M5 12h14" /> <path d="M12 5v14" /></symbol>
  <symbol id="i-minus" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M5 12h14" /></symbol>
  <symbol id="i-menu" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M4 5h16" /> <path d="M4 12h16" /> <path d="M4 19h16" /></symbol>
  <symbol id="i-more" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /> <circle cx="19" cy="12" r="1" /> <circle cx="5" cy="12" r="1" /></symbol>
  <symbol id="i-more-v" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /> <circle cx="12" cy="5" r="1" /> <circle cx="12" cy="19" r="1" /></symbol>
  <symbol id="i-chevron-left" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></symbol>
  <symbol id="i-chevron-right" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></symbol>
  <symbol id="i-chevron-up" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6" /></symbol>
  <symbol id="i-chevron-down" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></symbol>
  <symbol id="i-arrow-left" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m12 19-7-7 7-7" /> <path d="M19 12H5" /></symbol>
  <symbol id="i-arrow-right" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /></symbol>
  <symbol id="i-arrow-up" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m5 12 7-7 7 7" /> <path d="M12 19V5" /></symbol>
  <symbol id="i-arrow-down" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M12 5v14" /> <path d="m19 12-7 7-7-7" /></symbol>
  <symbol id="i-external" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M15 3h6v6" /> <path d="M10 14 21 3" /> <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></symbol>
  <symbol id="i-home" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /> <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></symbol>
  <symbol id="i-expand" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M15 3h6v6" /> <path d="m21 3-7 7" /> <path d="m3 21 7-7" /> <path d="M9 21H3v-6" /></symbol>
  <symbol id="i-shrink" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="m14 10 7-7" /> <path d="M20 10h-6V4" /> <path d="m3 21 7-7" /> <path d="M4 14h6v6" /></symbol>
  <symbol id="i-fullscreen" data-group="Interface : ouvrir, fermer, aller" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2" /> <path d="M17 3h2a2 2 0 0 1 2 2v2" /> <path d="M21 17v2a2 2 0 0 1-2 2h-2" /> <path d="M7 21H5a2 2 0 0 1-2-2v-2" /> <rect width="10" height="8" x="7" y="8" rx="1" /></symbol>
  <symbol id="i-search" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /></symbol>
  <symbol id="i-filter" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" /></symbol>
  <symbol id="i-sort" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="m21 16-4 4-4-4" /> <path d="M17 20V4" /> <path d="m3 8 4-4 4 4" /> <path d="M7 4v16" /></symbol>
  <symbol id="i-settings" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" /></symbol>
  <symbol id="i-copy" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></symbol>
  <symbol id="i-share" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /> <circle cx="6" cy="12" r="3" /> <circle cx="18" cy="19" r="3" /> <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /> <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></symbol>
  <symbol id="i-download" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M12 15V3" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /> <path d="m7 10 5 5 5-5" /></symbol>
  <symbol id="i-upload" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M12 3v12" /> <path d="m17 8-5-5-5 5" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></symbol>
  <symbol id="i-undo" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M9 14 4 9l5-5" /> <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></symbol>
  <symbol id="i-redo" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="m15 14 5-5-5-5" /> <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" /></symbol>
  <symbol id="i-pin" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M12 17v5" /> <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></symbol>
  <symbol id="i-bookmark" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" /></symbol>
  <symbol id="i-flag" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" /></symbol>
  <symbol id="i-tag" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /> <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></symbol>
  <symbol id="i-tags" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z" /> <path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193" /> <circle cx="10.5" cy="6.5" r=".5" fill="currentColor" /></symbol>
  <symbol id="i-archive" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="1" /> <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /> <path d="M10 12h4" /></symbol>
  <symbol id="i-printer" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /> <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /> <rect x="6" y="14" width="12" height="8" rx="1" /></symbol>
  <symbol id="i-zoom-in" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /> <line x1="21" x2="16.65" y1="21" y2="16.65" /> <line x1="11" x2="11" y1="8" y2="14" /> <line x1="8" x2="14" y1="11" y2="11" /></symbol>
  <symbol id="i-zoom-out" data-group="Interface : chercher, ranger, agir" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /> <line x1="21" x2="16.65" y1="21" y2="16.65" /> <line x1="8" x2="14" y1="11" y2="11" /></symbol>
  <symbol id="i-info" data-group="États et messages" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="M12 16v-4" /> <path d="M12 8h.01" /></symbol>
  <symbol id="i-help" data-group="États et messages" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /> <path d="M12 17h.01" /></symbol>
  <symbol id="i-ok" data-group="États et messages" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="m16 9-5.5 5.5L8 12" /></symbol>
  <symbol id="i-error" data-group="États et messages" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="m15 9-6 6" /> <path d="m9 9 6 6" /></symbol>
  <symbol id="i-warn" data-group="États et messages" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <line x1="12" x2="12" y1="8" y2="12" /> <line x1="12" x2="12.01" y1="16" y2="16" /></symbol>
  <symbol id="i-bell" data-group="États et messages" viewBox="0 0 24 24"><path d="M10.268 21a2 2 0 0 0 3.464 0" /> <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></symbol>
  <symbol id="i-bell-off" data-group="États et messages" viewBox="0 0 24 24"><path d="M10.268 21a2 2 0 0 0 3.464 0" /> <path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742" /> <path d="m2 2 20 20" /> <path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" /></symbol>
  <symbol id="i-unlock" data-group="États et messages" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 9.9-1" /></symbol>
  <symbol id="i-key" data-group="États et messages" viewBox="0 0 24 24"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /> <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></symbol>
  <symbol id="i-shield" data-group="États et messages" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /> <path d="m9 12 2 2 4-4" /></symbol>
  <symbol id="i-offline" data-group="États et messages" viewBox="0 0 24 24"><path d="M12 20h.01" /> <path d="M8.5 16.429a5 5 0 0 1 7 0" /> <path d="M5 12.859a10 10 0 0 1 5.17-2.69" /> <path d="M19 12.859a10 10 0 0 0-2.007-1.523" /> <path d="M2 8.82a15 15 0 0 1 4.177-2.643" /> <path d="M22 8.82a15 15 0 0 0-11.288-3.764" /> <path d="m2 2 20 20" /></symbol>
  <symbol id="i-clock" data-group="États et messages" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="M12 6v6l4 2" /></symbol>
  <symbol id="i-hourglass" data-group="États et messages" viewBox="0 0 24 24"><path d="M5 22h14" /> <path d="M5 2h14" /> <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /> <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></symbol>
  <symbol id="i-loader" data-group="États et messages" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></symbol>
  <symbol id="i-sparkle" data-group="États et messages" viewBox="0 0 24 24"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></symbol>
  <symbol id="i-user" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" /></symbol>
  <symbol id="i-user-plus" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /> <circle cx="9" cy="7" r="4" /> <line x1="19" x2="19" y1="8" y2="14" /> <line x1="22" x2="16" y1="11" y2="11" /></symbol>
  <symbol id="i-user-check" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="m16 11 2 2 4-4" /> <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /> <circle cx="9" cy="7" r="4" /></symbol>
  <symbol id="i-user-x" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /> <circle cx="9" cy="7" r="4" /> <line x1="17" x2="22" y1="8" y2="13" /> <line x1="22" x2="17" y1="8" y2="13" /></symbol>
  <symbol id="i-login" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="m10 17 5-5-5-5" /> <path d="M15 12H3" /> <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></symbol>
  <symbol id="i-logout" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="m16 17 5-5-5-5" /> <path d="M21 12H9" /> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></symbol>
  <symbol id="i-contact" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="M16 2v2" /> <path d="M7 21v-2a2 2 0 012-2h6a2 2 0 012 2v2" /> <path d="M8 2v2" /> <circle cx="12" cy="10" r="3" /> <rect x="3" y="3" width="18" height="18" rx="2" /></symbol>
  <symbol id="i-crown" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /> <path d="M5 21h14" /></symbol>
  <symbol id="i-badge" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /> <path d="m16 9-5.5 5.5L8 12" /></symbol>
  <symbol id="i-handshake" data-group="Personnes et compte" viewBox="0 0 24 24"><path d="m11 17 2 2a1 1 0 1 0 3-3" /> <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /> <path d="m21 3 1 11h-2" /> <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /> <path d="M3 4h8" /></symbol>
  <symbol id="i-image" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /> <circle cx="9" cy="9" r="2" /> <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></symbol>
  <symbol id="i-images" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" /> <path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" /> <circle cx="13" cy="7" r="1" fill="currentColor" /> <rect x="8" y="2" width="14" height="14" rx="2" /></symbol>
  <symbol id="i-gallery" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1" /> <rect width="7" height="7" x="14" y="3" rx="1" /> <rect width="7" height="7" x="14" y="14" rx="1" /> <rect width="7" height="7" x="3" y="14" rx="1" /></symbol>
  <symbol id="i-aperture" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <path d="m14.31 8 5.74 9.94" /> <path d="M9.69 8h11.48" /> <path d="m7.38 12 5.74-9.94" /> <path d="M9.69 16 3.95 6.06" /> <path d="M14.31 16H2.83" /> <path d="m16.62 12-5.74 9.94" /></symbol>
  <symbol id="i-focus" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /> <path d="M3 7V5a2 2 0 0 1 2-2h2" /> <path d="M17 3h2a2 2 0 0 1 2 2v2" /> <path d="M21 17v2a2 2 0 0 1-2 2h-2" /> <path d="M7 21H5a2 2 0 0 1-2-2v-2" /></symbol>
  <symbol id="i-crop" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" /> <path d="M18 22V8a2 2 0 0 0-2-2H2" /></symbol>
  <symbol id="i-film" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M7 3v18" /> <path d="M3 7.5h4" /> <path d="M3 12h18" /> <path d="M3 16.5h4" /> <path d="M17 3v18" /> <path d="M17 7.5h4" /> <path d="M17 16.5h4" /></symbol>
  <symbol id="i-video" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /> <rect x="2" y="6" width="14" height="12" rx="2" /></symbol>
  <symbol id="i-play" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></symbol>
  <symbol id="i-pause" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><rect x="14" y="3" width="5" height="18" rx="1" /> <rect x="5" y="3" width="5" height="18" rx="1" /></symbol>
  <symbol id="i-slideshow" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M2 3h20" /> <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /> <path d="m7 21 5-5 5 5" /></symbol>
  <symbol id="i-folder" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></symbol>
  <symbol id="i-folder-open" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></symbol>
  <symbol id="i-cloud-up" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M12 13v8" /> <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /> <path d="m8 17 4-4 4 4" /></symbol>
  <symbol id="i-cloud-down" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M12 13v8l-4-4" /> <path d="m12 21 4-4" /> <path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" /></symbol>
  <symbol id="i-drive" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M10 16h.01" /> <path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /> <path d="M21.946 12.013H2.054" /> <path d="M6 16h.01" /></symbol>
  <symbol id="i-palette" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></symbol>
  <symbol id="i-light" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M12 12v6" /> <path d="M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z" /> <path d="M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" /></symbol>
  <symbol id="i-frame" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><line x1="22" x2="2" y1="6" y2="6" /> <line x1="22" x2="2" y1="18" y2="18" /> <line x1="6" x2="6" y1="2" y2="22" /> <line x1="18" x2="18" y1="2" y2="22" /></symbol>
  <symbol id="i-select" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" /> <path d="m9 11 3 3L22 4" /></symbol>
  <symbol id="i-reopen" data-group="Photo et galerie (Selecta, le site)" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /> <path d="M3 3v5h5" /></symbol>
  <symbol id="i-cal-check" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="m9 15 2 2 4-4" /></symbol>
  <symbol id="i-cal-days" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></symbol>
  <symbol id="i-cal-plus" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M16 18h6" /> <path d="M16 2v3" /> <path d="M19 15v6" /> <path d="M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" /> <path d="M3 9h18" /> <path d="M8 2v3" /></symbol>
  <symbol id="i-ticket" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /> <path d="M13 5v2" /> <path d="M13 17v2" /> <path d="M13 11v2" /></symbol>
  <symbol id="i-map-pin" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /> <circle cx="12" cy="10" r="3" /></symbol>
  <symbol id="i-map" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /> <path d="M15 5.764v15" /> <path d="M9 3.236v15" /></symbol>
  <symbol id="i-phone" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></symbol>
  <symbol id="i-megaphone" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" /> <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" /> <path d="M8 6v8" /></symbol>
  <symbol id="i-newspaper" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M15 18h-5" /> <path d="M18 14h-8" /> <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" /> <rect width="8" height="4" x="10" y="6" rx="1" /></symbol>
  <symbol id="i-at" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /> <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></symbol>
  <symbol id="i-hash" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></symbol>
  <symbol id="i-inbox" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /> <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></symbol>
  <symbol id="i-quote" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" /> <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" /></symbol>
  <symbol id="i-trophy" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2" /> <path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2" /> <path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3" /> <path d="M4 22h16" /> <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /> <path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3" /></symbol>
  <symbol id="i-target" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="6" /> <circle cx="12" cy="12" r="2" /></symbol>
  <symbol id="i-activity" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></symbol>
  <symbol id="i-pie" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" /> <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /></symbol>
  <symbol id="i-bars" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></symbol>
  <symbol id="i-fall" data-group="Agenda, ateliers, réservations (Studio, le site)" viewBox="0 0 24 24"><path d="M16 17h6v-6" /> <path d="m22 17-8.5-8.5-5 5L2 7" /></symbol>
  <symbol id="i-card" data-group="Argent (Bank)" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /> <line x1="2" x2="22" y1="10" y2="10" /> <path d="M6 14h2" /></symbol>
  <symbol id="i-banknote" data-group="Argent (Bank)" viewBox="0 0 24 24"><rect width="20" height="12" x="2" y="6" rx="2" /> <circle cx="12" cy="12" r="2" /> <path d="M6 12h.01M18 12h.01" /></symbol>
  <symbol id="i-piggy" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" /> <path d="M16 10h.01" /> <path d="M2 8v1a2 2 0 0 0 2 2h1" /></symbol>
  <symbol id="i-bank" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></symbol>
  <symbol id="i-receipt" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M12 17V7" /> <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" /> <path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z" /></symbol>
  <symbol id="i-euro" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M4 10h12" /> <path d="M4 14h9" /> <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" /></symbol>
  <symbol id="i-percent" data-group="Argent (Bank)" viewBox="0 0 24 24"><line x1="19" x2="5" y1="5" y2="19" /> <circle cx="6.5" cy="6.5" r="2.5" /> <circle cx="17.5" cy="17.5" r="2.5" /></symbol>
  <symbol id="i-transfer" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M8 3 4 7l4 4" /> <path d="M4 7h16" /> <path d="m16 21 4-4-4-4" /> <path d="M20 17H4" /></symbol>
  <symbol id="i-calculator" data-group="Argent (Bank)" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></symbol>
  <symbol id="i-sheet" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /> <path d="M14 2v5a1 1 0 0 0 1 1h5" /> <path d="M8 13h2" /> <path d="M14 13h2" /> <path d="M8 17h2" /> <path d="M14 17h2" /></symbol>
  <symbol id="i-cart" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" /> <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" /> <circle cx="18" cy="20" r="2" /> <circle cx="8" cy="20" r="2" /></symbol>
  <symbol id="i-bag" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M16 10a4 4 0 0 1-8 0" /> <path d="M3.103 6.034h17.794" /> <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" /></symbol>
  <symbol id="i-store" data-group="Argent (Bank)" viewBox="0 0 24 24"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" /> <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" /> <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" /></symbol>
  <symbol id="i-food" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /> <path d="M7 2v20" /> <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></symbol>
  <symbol id="i-coffee" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M10 2v2" /> <path d="M14 2v2" /> <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /> <path d="M6 2v2" /></symbol>
  <symbol id="i-wine" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M8 22h8" /> <path d="M7 10h10" /> <path d="M12 15v7" /> <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" /></symbol>
  <symbol id="i-car" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /> <circle cx="7" cy="17" r="2" /> <path d="M9 17h6" /> <circle cx="17" cy="17" r="2" /></symbol>
  <symbol id="i-fuel" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" /> <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" /> <path d="M2 21h13" /> <path d="M3 9h11" /></symbol>
  <symbol id="i-train" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" /> <path d="m9 15-1-1" /> <path d="m15 15 1-1" /> <path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" /> <path d="m8 19-2 3" /> <path d="m16 19 2 3" /></symbol>
  <symbol id="i-bus" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M8 6v6" /> <path d="M15 6v6" /> <path d="M2 12h19.6" /> <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /> <circle cx="7" cy="18" r="2" /> <path d="M9 18h5" /> <circle cx="16" cy="18" r="2" /></symbol>
  <symbol id="i-bike" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><circle cx="18.5" cy="17.5" r="3.5" /> <circle cx="5.5" cy="17.5" r="3.5" /> <circle cx="15" cy="5" r="1" /> <path d="M12 17.5V14l-3-3 4-3 2 3h2" /></symbol>
  <symbol id="i-parking" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M9 12h4a2 2 0 0 0 0-4H9.5a.5.5 0 0 0-.5.5V16" /> <rect width="18" height="18" x="3" y="3" rx="2" /></symbol>
  <symbol id="i-bed" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /> <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /> <path d="M12 4v6" /> <path d="M2 18h20" /></symbol>
  <symbol id="i-zap" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></symbol>
  <symbol id="i-water" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></symbol>
  <symbol id="i-wifi" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M12 20h.01" /> <path d="M2 8.82a15 15 0 0 1 20 0" /> <path d="M5 12.859a10 10 0 0 1 14 0" /> <path d="M8.5 16.429a5 5 0 0 1 7 0" /></symbol>
  <symbol id="i-mobile" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /> <path d="M12 18h.01" /></symbol>
  <symbol id="i-insurance" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></symbol>
  <symbol id="i-health" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /> <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></symbol>
  <symbol id="i-pill" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /> <path d="m8.5 8.5 7 7" /></symbol>
  <symbol id="i-scissors" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /> <path d="M8.12 8.12 12 12" /> <path d="M20 4 8.12 15.88" /> <circle cx="6" cy="18" r="3" /> <path d="M14.8 14.8 20 20" /></symbol>
  <symbol id="i-paw" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><circle cx="11" cy="4" r="2" /> <circle cx="18" cy="8" r="2" /> <circle cx="20" cy="16" r="2" /> <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" /></symbol>
  <symbol id="i-baby" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /> <path d="M15 12h.01" /> <path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" /> <path d="M9 12h.01" /></symbol>
  <symbol id="i-school" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /> <path d="M22 10v6" /> <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></symbol>
  <symbol id="i-work" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /> <rect width="20" height="14" x="2" y="6" rx="2" /></symbol>
  <symbol id="i-music" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M21 16V3a1 1 0 0 0-1.28-.96l-10 2.917a1 1 0 0 0-.72.96V19" /> <circle cx="18" cy="16" r="3" /> <circle cx="6" cy="19" r="3" /></symbol>
  <symbol id="i-game" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><line x1="6" x2="10" y1="11" y2="11" /> <line x1="8" x2="8" y1="9" y2="13" /> <line x1="15" x2="15.01" y1="12" y2="12" /> <line x1="18" x2="18.01" y1="10" y2="10" /> <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></symbol>
  <symbol id="i-book-open" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M12 5v16" /> <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" /></symbol>
  <symbol id="i-ticket-film" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="m12.296 3.464 3.02 3.956" /> <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z" /> <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> <path d="m6.18 5.276 3.1 3.899" /></symbol>
  <symbol id="i-shirt" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></symbol>
  <symbol id="i-tools" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" /> <path d="m18 15 4-4" /> <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" /></symbol>
  <symbol id="i-plant" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3" /> <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" /> <path d="M5 21h14" /></symbol>
  <symbol id="i-cigarette" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14" /> <path d="M18 8c0-2.5-2-2.5-2-5" /> <path d="M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /> <path d="M22 8c0-2.5-2-2.5-2-5" /> <path d="M7 12v4" /></symbol>
  <symbol id="i-gov" data-group="Catégories de dépenses (Bank)" viewBox="0 0 24 24"><path d="M10 12h4" /> <path d="M10 8h4" /> <path d="M14 21v-3a2 2 0 0 0-4 0v3" /> <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" /> <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /></symbol>
  <symbol id="i-moon" data-group="Thème et réglages" viewBox="0 0 24 24"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></symbol>
  <symbol id="i-contrast" data-group="Thème et réglages" viewBox="0 0 24 24"><path d="M12 2v2" /> <path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715" /> <path d="M16 12a4 4 0 0 0-4-4" /> <path d="m19 5-1.256 1.256" /> <path d="M20 12h2" /></symbol>
  <symbol id="i-language" data-group="Thème et réglages" viewBox="0 0 24 24"><path d="m5 8 6 6" /> <path d="m4 14 6-6 2-3" /> <path d="M2 5h12" /> <path d="M7 2h1" /> <path d="m22 22-5-10-5 10" /> <path d="M14 18h6" /></symbol>
  <symbol id="i-eye-dropper" data-group="Thème et réglages" viewBox="0 0 24 24"><path d="m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12" /> <path d="m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z" /> <path d="m2 22 .414-.414" /></symbol>
  <symbol id="i-layout" data-group="Thème et réglages" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1" /> <rect width="7" height="5" x="14" y="3" rx="1" /> <rect width="7" height="9" x="14" y="12" rx="1" /> <rect width="7" height="5" x="3" y="16" rx="1" /></symbol>
  <symbol id="i-columns" data-group="Thème et réglages" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M12 3v18" /></symbol>
  <symbol id="i-rows" data-group="Thème et réglages" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M21 9H3" /> <path d="M21 15H3" /></symbol>
  <symbol id="i-power" data-group="Thème et réglages" viewBox="0 0 24 24"><path d="M12 2v10" /> <path d="M18.4 6.6a9 9 0 1 1-12.77.04" /></symbol>
  <symbol id="i-plug" data-group="Thème et réglages" viewBox="0 0 24 24"><path d="M12 22v-5" /> <path d="M15 8V2" /> <path d="M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z" /> <path d="M9 8V2" /></symbol>
  <symbol id="i-patreon" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46 3.765.047 4.326-4.804 6.068-7.141 1.24-1.662 2.836-2.132 4.801-2.618 3.376-.836 5.678-3.501 5.673-7.031Z"/></symbol>
  <symbol id="i-youtube" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></symbol>
  <symbol id="i-facebook" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></symbol>
  <symbol id="i-tiktok" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></symbol>
  <symbol id="i-threads" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z"/></symbol>
  <symbol id="i-whatsapp" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></symbol>
  <symbol id="i-pinterest" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></symbol>
  <symbol id="i-vimeo" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457a315.06 315.06 0 003.501-3.1279c1.579-1.368 2.765-2.085 3.5539-2.159 1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.5069.5389 2.45 1.1309 3.674 1.7759 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.8679 3.434-5.7568 6.7619-5.6368 2.4729.06 3.6279 1.664 3.4929 4.7969z"/></symbol>
  <symbol id="i-behance" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z"/></symbol>
  <symbol id="i-flickr" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M5.334 6.666C2.3884 6.666 0 9.055 0 12c0 2.9456 2.3884 5.334 5.334 5.334 2.9456 0 5.332-2.3884 5.332-5.334 0-2.945-2.3864-5.334-5.332-5.334zm13.332 0c-2.9456 0-5.332 2.389-5.332 5.334 0 2.9456 2.3864 5.334 5.332 5.334C21.6116 17.334 24 14.9456 24 12c0-2.945-2.3884-5.334-5.334-5.334Z"/></symbol>
  <symbol id="i-paypal" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"/></symbol>
  <symbol id="i-notion" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></symbol>
  <symbol id="i-google" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></symbol>
  <symbol id="i-gmail" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></symbol>
  <symbol id="i-spotify" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></symbol>
  <symbol id="i-mastodon" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></symbol>
  <symbol id="i-telegram" data-group="Réseaux et services" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" transform="translate(2.4 2.4) scale(.8)" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></symbol>
`;
  function put() {
    if (document.getElementById("ds-icons")) return;
    var holder = document.createElement("div");
    holder.innerHTML = '<svg id="ds-icons" width="0" height="0" style="position:absolute" aria-hidden="true">' + sprite + "</svg>";
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }
  // ds.js comes with defer: the page is there; loaded any other way, it waits for it
  if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
})();
/* Design system: the behaviour the apps share.
   ds.toast({type, text, action, duration}) shows a passing message at the bottom right (above the tab bar on a phone)
   and returns a handle to change it (update) or take it away (close).
   type: "good" (done, 4 s), "info" (5 s), "busy" (until changed), "bad" (stays until closed); an action keeps it 8 s.
   ds.confirm({title, text, ok, danger, value}) asks in a window instead of the browser's boxes (see below).
   ds.drawer(name, {onChange}) runs a page's filters drawer; ds.status(holder, {…}) draws the state of its sources;
   ds.when(t), ds.ago(t) and ds.soon(t) say a time in words, in Paris's time; ds.date(t, style) writes a date;
   ds.number(n) and ds.money(n) write figures; ds.api(method, url, body) asks the app's server; ds.jobs(holder, jobs)
   draws the syncs of a settings page; ds.busy runs the header's loading wheel; ds.trouble(key, {…}) tells a source that
   failed, once, with « Réessayer »; ds.h and ds.ico build nodes; ds.compact writes a short figure; ds.avatar a logo with its
   initial; ds.fold keeps foldable sections as left; ds.route and ds.seek follow the address after #. Rows that open, forms
   that ask before deleting and the messages left after a redirect work by themselves (see below).
   Their own words follow the page's language, <html lang>: English for "en…", French otherwise. */
(function () {
  "use strict";
  var LIFE = { good: 4000, info: 5000, busy: 0, bad: 0 };
  var WORDS = {
    fr: { close: "Fermer", cancel: "Annuler", confirm: "Confirmer", openFilters: "Ouvrir les filtres", closeFilters: "Fermer les filtres",
          never: "jamais", today: "aujourd'hui", yesterday: "hier", tomorrow: "demain", on: "le ", at: " à ", now: "à l’instant",
          ago: function (x) { return "il y a " + x; }, soon: "dans un instant", in: function (x) { return "dans " + x; },
          journal: "Journal", run: "Lancer", runNow: " maintenant", started: "Lancé", running: "En cours", allLogs: "Tout sur Render ↗",
          live: "En direct, passage en cours", lastRuns: "Derniers passages", loading: "Chargement…",
          nothing: "Rien d’écrit depuis le démarrage du serveur.", journalOf: function (x) { return "Journal : " + x; },
          retry: "Réessayer", tryingAgain: "nouvel essai…", stillFailing: "toujours impossible.", upToDate: "à jour" },
    en: { close: "Close", cancel: "Cancel", confirm: "Confirm", openFilters: "Open the filters", closeFilters: "Close the filters",
          never: "never", today: "today", yesterday: "yesterday", tomorrow: "tomorrow", on: "on ", at: " at ", now: "just now",
          ago: function (x) { return x + " ago"; }, soon: "in a moment", in: function (x) { return "in " + x; },
          journal: "Log", run: "Run", runNow: " now", started: "Started", running: "Running", allLogs: "All on Render ↗",
          live: "Live, running now", lastRuns: "Last runs", loading: "Loading…",
          nothing: "Nothing written since the server started.", journalOf: function (x) { return "Log: " + x; },
          retry: "Try again", tryingAgain: "trying again…", stillFailing: "still failing.", upToDate: "up to date" }
  };
  // read when a message or a window opens, so that a page that changes its language is followed
  function words() { return english() ? WORDS.en : WORDS.fr; }
  var stack = null, live = [];
  function holder() {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toasts";
      document.body.appendChild(stack);
    }
    return stack;
  }
  function toast(opts) {
    opts = opts || {};
    // the same words again change the message already there instead of piling up
    for (var i = 0; i < live.length; i++) if (live[i].text === opts.text) return live[i].update(opts);
    var el = document.createElement("div"), t = { el: el, text: opts.text, life: 0, timer: null, gone: false };
    el.innerHTML = '<span class="mark" aria-hidden="true"></span><span class="txt"></span>' +
      '<button type="button" class="act" hidden></button><button type="button" class="x" aria-label="' + words().close + '">×</button>';
    el.querySelector(".x").onclick = function () { t.close(); };
    // the countdown waits while the pointer or a finger is on the message
    el.addEventListener("pointerenter", function () { clearTimeout(t.timer); });
    el.addEventListener("pointerleave", function () { t.arm(); });
    t.arm = function () {
      clearTimeout(t.timer);
      if (t.life) t.timer = setTimeout(t.close, t.life);
    };
    t.update = function (o) {
      var type = o.type || "good", act = el.querySelector(".act");
      el.className = "toast is-" + type;
      el.setAttribute("role", type === "bad" ? "alert" : "status");
      el.querySelector(".txt").textContent = o.text || "";
      t.text = o.text;
      act.hidden = !o.action;
      if (o.action) {
        act.textContent = o.action.label;
        act.onclick = function () { t.close(); o.action.run(); };
      }
      t.life = o.duration != null ? o.duration : o.action ? 8000 : LIFE[type] || 0;
      t.arm();
      return t;
    };
    t.close = function () {
      if (t.gone) return;
      t.gone = true;
      clearTimeout(t.timer);
      live.splice(live.indexOf(t), 1);
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 200);
    };
    holder().appendChild(el);
    live.push(t);
    // three at most: the oldest goes
    while (live.length > 3) live[0].close();
    return t.update(opts);
  }
  // ds.confirm({title, text, ok, danger, value, placeholder, inputmode, autocomplete, maxlength}) asks in a window of the design
  // system and answers with a promise:
  // false when cancelled, true when confirmed, or the typed text when the window has a field (value).
  // A dangerous answer (danger) starts on « Annuler » (Cancel), so Enter never deletes by mistake.
  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (done) {
      var veil = document.createElement("div"), field = opts.value != null;
      veil.className = "dialog-veil";
      veil.innerHTML = '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-t"><h2 class="dialog-t" id="dialog-t"></h2>' +
        '<p class="dialog-x"></p>' + (field ? '<input class="dialog-in" type="text">' : "") +
        '<div class="dialog-b"><button type="button" class="btn dialog-no">' + words().cancel + '</button><button type="button" class="btn dialog-ok"></button></div></div>';
      var ok = veil.querySelector(".dialog-ok"), no = veil.querySelector(".dialog-no"), input = veil.querySelector(".dialog-in"), text = veil.querySelector(".dialog-x");
      veil.querySelector(".dialog-t").textContent = opts.title || "";
      text.textContent = opts.text || "";
      text.hidden = !opts.text;
      ok.textContent = opts.ok || words().confirm;
      ok.classList.add(opts.danger ? "is-danger" : "is-save");
      if (input) {
        input.value = opts.value;
        input.placeholder = opts.placeholder || "";
        // a code received by SMS: the figures' keyboard, and the phone offering the code it just got
        if (opts.inputmode) input.inputMode = opts.inputmode;
        if (opts.autocomplete) input.setAttribute("autocomplete", opts.autocomplete);
        if (opts.maxlength) input.maxLength = opts.maxlength;
      }
      var before = document.activeElement;
      function end(answer) {
        document.removeEventListener("keydown", key, true);
        veil.remove();
        if (before && before.focus) before.focus();
        done(answer);
      }
      function key(e) {
        if (e.key === "Escape") { e.preventDefault(); end(false); }
        else if (e.key === "Enter" && input && document.activeElement === input) { e.preventDefault(); end(input.value); }
      }
      ok.onclick = function () { end(input ? input.value : true); };
      no.onclick = function () { end(false); };
      veil.addEventListener("click", function (e) { if (e.target === veil) end(false); });
      document.addEventListener("keydown", key, true);
      document.body.appendChild(veil);
      if (input) { input.focus(); input.select(); } else (opts.danger ? no : ok).focus();
    });
  }
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }

  /* ds.drawer(name, {onChange}): the filters' drawer of a page. Its markup: the edge tab
     <button class="edgetab" data-drawer-toggle="name">, the layout <div class="side-layout" data-drawer="name"> with its
     .scrim, and a close button with data-drawer-close="name". The name is also the device's key that remembers whether it
     was left open. Escape closes the phone's drawer, which covers the page: opening it moves the focus into it, closing it
     gives the focus back to the tab. Returns {open, set(open), toggle(), mark(on)}: mark(true) puts the gold dot on the tab
     while a filter hides something. A page that draws itself again reads .open in onChange (its markup carries the same
     data- names, and the class open when .open). */
  var drawers = {};
  function phone() { return window.matchMedia("(max-width: 768px)").matches; }
  function paint(name) {
    var d = drawers[name], w = words();
    document.querySelectorAll('[data-drawer="' + name + '"]').forEach(function (el) { el.classList.toggle("open", d.open); });
    document.querySelectorAll('[data-drawer-toggle="' + name + '"]').forEach(function (tab) {
      tab.classList.toggle("on", d.open);
      // the gold dot on the tab while a filter hides something (mark)
      var dot = tab.querySelector(".fdot");
      if (d.marked && !dot) { dot = document.createElement("i"); dot.className = "fdot"; dot.setAttribute("aria-hidden", "true"); tab.appendChild(dot); }
      if (!d.marked && dot) dot.remove();
      tab.setAttribute("aria-expanded", d.open ? "true" : "false");
      tab.setAttribute("aria-label", d.open ? w.closeFilters : w.openFilters);
    });
  }
  function drawer(name, opts) {
    var d = drawers[name] = { open: false, onChange: (opts || {}).onChange };
    try { d.open = localStorage.getItem(name) === "1"; } catch (e) {}
    d.set = function (open) {
      var was = d.open;
      d.open = !!open;
      try { localStorage.setItem(name, d.open ? "1" : "0"); } catch (e) {}
      paint(name);
      if (was === d.open) return;
      if (d.onChange) d.onChange(d.open);
      if (!phone()) return;
      var to = d.open ? document.querySelector('[data-drawer="' + name + '"] .side') : document.querySelector('[data-drawer-toggle="' + name + '"]');
      if (to) { if (d.open) to.setAttribute("tabindex", "-1"); to.focus({ preventScroll: true }); }
    };
    d.toggle = function () { d.set(!d.open); };
    d.mark = function (on) { d.marked = !!on; paint(name); };
    paint(name);
    return d;
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-drawer-toggle], [data-drawer-close], [data-drawer] > .scrim") : null;
    if (!t) return;
    var name = t.getAttribute("data-drawer-toggle") || t.getAttribute("data-drawer-close") || t.parentNode.getAttribute("data-drawer");
    var d = drawers[name];
    if (!d) return;
    if (t.hasAttribute("data-drawer-toggle")) d.toggle(); else d.set(false);
  });
  document.addEventListener("keydown", function (e) {
    // a window of ds.confirm takes its own Escape first
    if (e.key !== "Escape" || e.defaultPrevented || !phone()) return;
    Object.keys(drawers).forEach(function (name) { if (drawers[name].open) drawers[name].set(false); });
  });

  /* ds.status(holder, {summary, late, rows, link}) draws the state of a page's sources in holder (its <footer>): one line
     that says it all (summary, a gold dot when late), opening on one row per source,
     rows: [{icon, name, state, every, ok, detail}] — what was read and when (state), how often (every), whether it is on
     time (ok) and, when not, why (detail) — then link: {href, text}. Whether it is open stays across redraws and visits. */
  function svgIcon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.setAttribute("class", "ico");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }
  function tag(name, cls, text) {
    var el = document.createElement(name);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }
  function status(holder, o) {
    var key = "ds-status " + location.pathname, det = tag("details", "status"), summary = tag("summary"), list = tag("ul");
    try { det.open = sessionStorage.getItem(key) === "1"; } catch (e) {}
    summary.append(tag("i", "dot" + (o.late ? " warn" : "")), o.summary || "");
    (o.rows || []).forEach(function (r) {
      var li = tag("li", r.ok ? "" : "late"), sn = tag("span", "sn"), sw = tag("span", "sw");
      sn.append(svgIcon(r.icon || "doc"), r.name || "");
      sw.append(svgIcon(r.ok ? "check" : "alert"), r.state || "");
      li.append(sn, sw, tag("span", "sf", r.every || ""));
      if (r.detail) li.append(tag("span", "sd", r.detail));
      list.append(li);
    });
    if (o.link) {
      var last = tag("li", "sl"), a = tag("a", "", o.link.text);
      a.href = o.link.href;
      last.append(a);
      list.append(last);
    }
    det.append(summary, list);
    det.addEventListener("toggle", function () { try { sessionStorage.setItem(key, det.open ? "1" : "0"); } catch (e) {} });
    holder.replaceChildren(det);
    return det;
  }

  /* ds.when(t): « aujourd'hui à 6h00 », « hier à 21h04 », « le 1er nov. à 9h00 » (« today at 6:00 »… in English);
     ds.ago(t): « à l’instant », « il y a 3 min », « il y a 2h05 », then as when; ds.soon(t): « dans 12 min », then as when.
     t: a Date, an ISO text, or a number of milliseconds (or of seconds, below 10^12). The days are Paris's days. */
  var TZ = "Europe/Paris";
  function date(t) { return t instanceof Date ? t : new Date(typeof t === "number" && t < 1e12 ? t * 1000 : t); }
  function dayKey(d) { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); }
  function clock(d) {
    var parts = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
    var h = +parts.find(function (p) { return p.type === "hour"; }).value, m = parts.find(function (p) { return p.type === "minute"; }).value;
    return english() ? h + ":" + m : h + "h" + m;
  }
  function day(d) {
    var w = words(), k = dayKey(d), now = Date.now();
    if (k === dayKey(new Date(now))) return w.today;
    if (k === dayKey(new Date(now - 864e5))) return w.yesterday;
    if (k === dayKey(new Date(now + 864e5))) return w.tomorrow;
    var text = new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: TZ, day: "numeric", month: "short" }).format(d);
    return w.on + (english() ? text : text.replace(/^1 /, "1er "));
  }
  function when(t) {
    if (!t) return words().never;
    var d = date(t);
    return day(d) + words().at + clock(d);
  }
  function ago(t) {
    if (!t) return words().never;
    var w = words(), s = (Date.now() - date(t)) / 1000;
    if (s < 60) return w.now;
    if (s < 3600) return w.ago(Math.round(s / 60) + " min");
    if (s < 6 * 3600) return w.ago(Math.floor(s / 3600) + "h" + String(Math.round(s % 3600 / 60)).padStart(2, "0"));
    return when(t);
  }
  function soon(t) {
    if (!t) return words().never;
    var w = words(), s = (date(t) - Date.now()) / 1000;
    if (s < 60) return w.soon;
    if (s < 3600) return w.in(Math.round(s / 60) + " min");
    return when(t);
  }

  /* ds.date(t, style): a date in words, Paris's day: "long" « 9 novembre 2026 » (the default), "weekday" « lundi 9 novembre »,
     "month" « novembre 2026 », "short" « 09/11/26 », "day" « 9 nov. », or Intl's own options; the first of a month is
     « 1er » in French. A day without its time ("2026-11-09", or a month "2026-11") stays that day wherever the device is. */
  var STYLES = { long: { day: "numeric", month: "long", year: "numeric" }, weekday: { weekday: "long", day: "numeric", month: "long" },
    month: { month: "long", year: "numeric" }, short: { day: "2-digit", month: "2-digit", year: "2-digit" }, day: { day: "numeric", month: "short" } };
  function dateText(t, style) {
    if (t == null || t === "") return "";
    var opts = Object.assign({}, typeof style === "object" ? style : STYLES[style || "long"]), d;
    var bare = typeof t === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(t);
    if (bare) { d = new Date(t.length === 7 ? t + "-15T12:00:00Z" : t + "T12:00:00Z"); opts.timeZone = "UTC"; }
    else { d = date(t); opts.timeZone = TZ; }
    var text = new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", opts).format(d);
    return english() || opts.day !== "numeric" ? text : text.replace(/(^|\s)1 (?=\D)/, "$11er ");
  }

  /* ds.number(n, decimals) and ds.money(n, {currency, signed, decimals}): French figures, the thousands set apart by a
     space the fonts draw (French uses a narrow one that Archivo and IBM Plex Mono do not); money: « −1 234,56€ », « +12€ »
     with signed, « 12,00 USD » for another currency, « — » for no figure. */
  function number(n, decimals) {
    if (n == null || isNaN(n)) return "—";
    var k = decimals || 0;
    return new Intl.NumberFormat(english() ? "en-GB" : "fr-FR", { minimumFractionDigits: k, maximumFractionDigits: k })
      .format(n).replace(/[\u202f\u00a0]/g, "\u00a0");
  }
  function money(n, o) {
    if (n == null || isNaN(n)) return "—";
    o = o || {};
    var cur = o.currency || "EUR", k = o.decimals == null ? 2 : o.decimals;
    return (n < 0 ? "−" : o.signed && n > 0 ? "+" : "") + number(Math.abs(n), k) + (cur === "EUR" ? "€" : "\u00a0" + cur);
  }

  /* ds.api(method, url, body): the app's server, as JSON. Its header against forged requests is the one its <html> names,
     data-api="X-Bank" (sent as X-Bank: 1). An ended session goes back to /login; an error says the server's own words. */
  /* ds.api(method, url, body, {retry}): besides the header named by <html data-api>, a Spring page's CSRF token
     (<meta name="_csrf"> under the header of <meta name="_csrf_header">) goes with everything but a GET. A GET that meets
     the server restarting (502, 503, 504, or no answer at all) tries again every 3 s for a minute, as a deploy takes;
     {retry: false} says no. An ended session (401, or a request sent on to a sign-in page, as Spring does) goes to the
     sign-in page, the page's address kept to come back to it after. An error says the server's own words (detail, or
     error.message) and carries err.status and err.code (the server's code, e.g. "tool_error"). */
  var AFTER_LOGIN = "ds-after-login";
  function wait(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function signIn(to) {
    try { sessionStorage.setItem(AFTER_LOGIN, location.pathname + location.search + location.hash); } catch (e) {}
    location.href = to;
  }
  function api(method, url, body, o) {
    o = o || {};
    var root = document.documentElement, name = root.getAttribute("data-api"), headers = { Accept: "application/json" };
    if (name) headers[name] = "1";
    var csrf = document.querySelector('meta[name="_csrf"]'), csrfHeader = document.querySelector('meta[name="_csrf_header"]');
    if (csrf && method !== "GET") headers[(csrfHeader && csrfHeader.content) || "X-CSRF-TOKEN"] = csrf.content;
    if (body) headers["Content-Type"] = "application/json";
    var left = method === "GET" && o.retry !== false ? 20 : 0;
    function once() {
      return fetch(url, { method: method, credentials: "same-origin", cache: "no-store", headers: headers, body: body ? JSON.stringify(body) : undefined })
        .then(function (r) {
          if (left > 0 && r.status >= 502 && r.status <= 504) { left -= 1; return wait(3000).then(once); }
          if (r.status === 401 || (r.redirected && /\/(login|signin)\b/i.test(r.url))) {
            signIn(r.redirected ? r.url : root.getAttribute("data-login") || "/login");
            var gone = new Error("session"); gone.status = 401; gone.code = "session"; throw gone;
          }
          return r.json().catch(function () { return null; }).then(function (d) {
            if (!r.ok) {
              var e = new Error((d && (d.detail || (d.error && d.error.message))) || "erreur " + r.status);
              e.status = r.status;
              e.code = (d && ((d.error && d.error.code) || d.code)) || null;
              throw e;
            }
            return d;
          });
        }, function (e) {
          // no answer at all: the server is down a moment, or the network
          if (left > 0) { left -= 1; return wait(3000).then(once); }
          throw e;
        });
    }
    return once();
  }
  // back from the sign-in page, the page opens where it was left
  function cameBack() {
    var was = null;
    try { was = sessionStorage.getItem(AFTER_LOGIN); sessionStorage.removeItem(AFTER_LOGIN); } catch (e) {}
    if (!was || location.hash) return;
    var hash = was.indexOf("#") >= 0 ? was.slice(was.indexOf("#")) : "";
    if (hash && was.split("#")[0] === location.pathname + location.search) {
      history.replaceState(null, "", hash);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  /* ds.jobs(holder, jobs, {logsLink, reload}) draws a settings page's syncs, one block per job:
     {key, label, state ("run", true, false or null: its dot), when, summary, bad (the summary in red), run (a function
     that starts it and returns a promise; no button without it), running, paused, own (a node: its switch),
     subs ([nodes]: more switches)}. « Journal » opens the job's last lines, read from GET /api/jobs/<key>/logs?after=<n>
     every 2 s while it is open and the page seen; the list follows its end unless one scrolls up. logsLink: where all
     the lines are; reload: what to call once a job was started. Call it again with the jobs' new state: the open logs stay.
     A job's block has the id « job-<key> »; ds.jobs.open(key) opens its journal as its button does, for a page's address
     that asks for it (/settings#patreon/journal). */
  var logs = {};
  function logState(key) { return logs[key] || (logs[key] = { open: false, lines: [], last: 0, stick: true, top: 0, list: null, loaded: false, busy: false }); }
  function el(name, cls, kids) {
    var e = tag(name, cls);
    (kids || []).forEach(function (k) { if (k != null) e.append(k); });
    return e;
  }
  function lineEl(x) {
    var bad = /^(ERROR|ERREUR|CRITICAL)$/.test(x.level) || x.text.indexOf("✖") >= 0;
    var warn = !bad && (/^(WARNING|ATTENTION)$/.test(x.level) || x.text.indexOf("⚠") >= 0);
    var at = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date(x.t));
    return el("div", "ll" + (/^=====/.test(x.text) ? " banner" : "") + (bad ? " lbad" : warn ? " lwarn" : ""), [tag("span", "lt", at), tag("span", "lx", x.text)]);
  }
  function fetchLogs(key) {
    var st = logState(key);
    if (st.busy) return;
    st.busy = true;
    api("GET", "/api/jobs/" + key + "/logs?after=" + st.last).then(function (d) {
      st.busy = false;
      var first = !st.loaded, list = st.list;
      st.loaded = true;
      if (!d.lines.length) { if (first && list) list.replaceChildren(tag("p", "none", words().nothing)); return; }
      st.lines = st.lines.concat(d.lines).slice(-800);
      st.last = d.last;
      if (!list || !list.isConnected) return;
      if (first) list.textContent = "";
      d.lines.forEach(function (x) { list.append(lineEl(x)); });
      while (list.children.length > 800) list.removeChild(list.firstChild);
      if (st.stick) list.scrollTop = list.scrollHeight;
    }).catch(function () { st.busy = false; });
  }
  setInterval(function () {
    if (document.visibilityState !== "visible") return;
    Object.keys(logs).forEach(function (k) { if (logs[k].open) fetchLogs(k); });
  }, 2000);
  var shownJobs = null;
  function jobs(holder, list, opts) {
    opts = opts || {};
    shownJobs = [holder, list, opts];
    var w = words();
    function draw() { jobs(holder, list, opts); }
    holder.replaceChildren.apply(holder, list.map(function (j) {
      var st = logState(j.key), dot = j.state === "run" ? "run" : j.state === true ? "ok" : j.state === false ? "bad" : "";
      var go = null;
      if (j.run) {
        go = tag("button", "go");
        go.type = "button";
        go.disabled = !!(j.paused || j.running);
        if (j.running) go.textContent = w.running;
        else go.append(el("span", "", [w.run, tag("span", "mx", w.runNow)]));
        go.addEventListener("click", function () {
          go.disabled = true;
          go.textContent = w.started;
          Promise.resolve().then(j.run).catch(function (e) { toast({ type: "bad", text: e.message }); })
            .then(function () { if (opts.reload) setTimeout(opts.reload, 800); });
        });
      }
      var jl = tag("button", "jl", w.journal);
      jl.type = "button";
      jl.setAttribute("aria-expanded", st.open ? "true" : "false");
      jl.addEventListener("click", function () {
        st.open = !st.open;
        draw();
        if (st.open) fetchLogs(j.key);
      });
      var panel = null;
      if (st.open) {
        var lines = tag("div", "logs");
        lines.setAttribute("role", "log");
        lines.setAttribute("aria-label", w.journalOf(j.label));
        lines.tabIndex = 0;
        if (st.lines.length) st.lines.forEach(function (x) { lines.append(lineEl(x)); });
        else lines.append(tag("p", "none", st.loaded ? w.nothing : w.loading));
        lines.addEventListener("scroll", function () {
          st.stick = lines.scrollTop + lines.clientHeight >= lines.scrollHeight - 8;
          st.top = lines.scrollTop;
        });
        st.list = lines;
        // drawn again with its job, the list keeps its place, or follows the end
        requestAnimationFrame(function () { lines.scrollTop = st.stick ? lines.scrollHeight : st.top; });
        var link = null;
        if (opts.logsLink) { link = tag("a", "", w.allLogs); link.href = opts.logsLink; link.target = "_blank"; link.rel = "noopener"; }
        var live = el("span", "live", [tag("i", "dot" + (j.running ? " run" : "")), j.running ? w.live : w.lastRuns]);
        live.firstChild.setAttribute("aria-hidden", "true");
        panel = el("div", "logbox", [el("div", "loghead", [live, link]), lines]);
      }
      var mark = tag("i", "dot " + dot);
      mark.setAttribute("aria-hidden", "true");
      var block = el("div", "job", [
        el("div", "name", [mark, j.label]),
        tag("div", "when", j.when || ""),
        j.summary ? tag("div", "sum" + (j.bad ? " bad" : ""), j.summary) : null,
        j.subs && j.subs.length ? el("div", "subs", j.subs) : null,
        el("div", "acts", [j.own || null, el("div", "btns", [jl, go])]),
        panel
      ]);
      block.id = "job-" + j.key;
      return block;
    }));
  }

  /* ds.busy: the loading's wheel in the header, <span class="busy"> in header.top with its .spin, .okc tick, .pc share
     and .bt words. start(text, {key, expected, header}) shows it at 0% (in header, or the page's header.top). The share
     climbs at an even speed, so as to reach 99% when this kind of loading (key) ends: as long as it took last time, or
     expected ms the first time. pct(p) says how much of the work is done (Studio: the rows read): the first time, with no
     length known, the end is then foreseen from the work too, and the speed bends towards it gently, never a jump.
     It never goes back, and waits at 99% for a loading longer than foreseen. done() runs on to 100% in a moment, then
     shows a green tick that fades, and remembers how long it took; done(false) just stops. say(word) shows a word in
     place of the share (Studio's « calcul… » once every read is in, while the page draws), until done(). While a first
     loading covers the page, its share (#boot-pc) is the same. */
  var STEP = 50;
  var bz = { shown: 0, speed: 0, work: 0, arrive: 0, known: false, tick: null, end: null, start: 0, key: null, expected: 3000, top: null, word: false };
  function busyTop() { return bz.top || document.querySelector("header.top"); }
  function busyText(text) {
    var top = busyTop(), pc = top && top.querySelector(".busy .pc"), boot = document.getElementById("boot-pc");
    if (pc) pc.textContent = text;
    if (boot) boot.textContent = text;
  }
  function busyTimes() { try { return JSON.parse(localStorage.getItem("ds-busy-ms") || "{}"); } catch (e) { return {}; } }
  // one step of the share: the speed that reaches 99% at the end foreseen (arrive), taken gently (a tenth of the change
  // at each step); between two words of the work the end stays put, so the speed stays even
  function busyStep() {
    var want = Math.max(0, (99 - bz.shown) / Math.max(bz.arrive - Date.now(), 300));
    bz.speed = bz.speed ? bz.speed + (want - bz.speed) * 0.1 : want;
    bz.shown = Math.min(99, bz.shown + bz.speed * STEP);
    busyText(Math.floor(bz.shown) + "%");
  }
  var busy = {
    start: function (text, o) {
      o = o || {};
      bz.top = o.header || null;
      var top = busyTop();
      if (!top) return;
      clearTimeout(bz.end); clearInterval(bz.tick);
      bz.shown = 0; bz.speed = 0; bz.work = 0; bz.start = Date.now(); bz.key = o.key || null; bz.word = false;
      bz.known = !!(bz.key && busyTimes()[bz.key]);
      bz.expected = (bz.key && busyTimes()[bz.key]) || o.expected || 3000;
      bz.arrive = bz.start + bz.expected;
      top.classList.remove("loading-done");
      top.classList.add("loading");
      var bt = top.querySelector(".busy .bt");
      if (bt) bt.textContent = text || words().loading;
      busyText("0%");
      bz.tick = setInterval(busyStep, STEP);
    },
    pct: function (p) {
      var w = Math.min(1, (p || 0) / 100);
      if (w <= bz.work) return;
      bz.work = w;
      // a loading whose length is known keeps its even speed: the work read says little of the time left (Studio's rows
      // are not as long to read as one another); only the first time, with no length known, does it guide the end
      if (bz.known) return;
      // the end foreseen again: the work left times a total between last time's and the one the pace so far gives
      // (elapsed / w), the latter weighing more as the work goes on
      var now = Date.now(), elapsed = now - bz.start;
      bz.arrive = now + (1 - w) * (bz.expected * (1 - w) + elapsed);
    },
    done: function (ok) {
      var top = busyTop();
      clearInterval(bz.tick); bz.tick = null;
      if (!top) return;
      if (ok === false) { top.classList.remove("loading"); busyText(""); return; }
      if (bz.key) { var t = busyTimes(); t[bz.key] = Math.max(500, Date.now() - bz.start); try { localStorage.setItem("ds-busy-ms", JSON.stringify(t)); } catch (e) {} }
      // what is left runs on to 100% in a quarter of a second, evenly, then the tick
      var from = bz.word ? 100 : bz.shown, steps = 5, n = 0;
      bz.tick = setInterval(function () {
        n++;
        if (!bz.word) busyText(Math.floor(from + (100 - from) * n / steps) + "%");
        if (n < steps) return;
        clearInterval(bz.tick); bz.tick = null;
        bz.end = setTimeout(function () {
          top.classList.remove("loading");
          busyText("");
          // the tick's animation starts again even when it played a moment ago
          void top.offsetWidth;
          top.classList.add("loading-done");
          bz.end = setTimeout(function () { top.classList.remove("loading-done"); }, 2000);
        }, 100);
      }, STEP);
    },
    say: function (word) {
      var top = busyTop();
      if (!top || !top.classList.contains("loading")) return;
      clearInterval(bz.tick); bz.tick = null;
      bz.word = true;
      busyText(word);
    },
    active: function () { var top = busyTop(); return !!top && top.classList.contains("loading"); }
  };

  /* ds.trouble(key, {name, text, retry, check, link}): a source that could not be read says so once a visit, in an error
     bubble « name : text », with « Réessayer » when retry is given (or a link: {label, href} instead, to sign in again).
     Closed, it stays closed until ds.trouble.ok(key) says the source works again: its next failure is told. Réessayer turns
     to « name : nouvel essai… », awaits retry(), then asks check(): nothing when it works (« name : à jour »), true or why
     when it still fails (« name : toujours impossible. why », with Réessayer again). Without check, retry() not throwing
     is enough. */
  var troubles = {};
  function troubleAction(key, o) {
    if (o.link) return { label: o.link.label, run: function () { location.href = o.link.href; } };
    return o.retry ? { label: words().retry, run: function () { retryTrouble(key, o); } } : null;
  }
  function retryTrouble(key, o) {
    var t = troubles[key] || (troubles[key] = {}), w = words();
    t.trying = true;
    var said = toast({ type: "busy", text: o.name + " : " + w.tryingAgain });
    Promise.resolve().then(o.retry)
      .then(function () { return o.check ? o.check() : null; },
            function (e) { return o.check ? o.check() : { why: String((e && e.message) || "") }; })
      .then(function (r) {
        t.trying = false;
        // check() answers nothing when it works, true or why when it does not; a retry that threw, without check, failed
        if (r) {
          var why = typeof r === "object" ? r.why : r === true ? "" : String(r);
          t.shown = true;
          said.update({ type: "bad", text: o.name + " : " + w.stillFailing + (why ? " " + why : ""), action: troubleAction(key, o) });
        } else {
          t.shown = false;
          said.update({ type: "good", text: o.name + " : " + w.upToDate });
        }
      });
  }
  function trouble(key, o) {
    var t = troubles[key] || (troubles[key] = {});
    if (t.shown || t.trying) return null;
    t.shown = true;
    return toast({ type: "bad", text: o.name + " : " + o.text, action: troubleAction(key, o) });
  }
  trouble.ok = function (key) { var t = troubles[key]; if (t && !t.trying) t.shown = false; };

  /* ds.h(tag, attrs, kids) builds a node: attrs.class, attrs.text, attrs.style, on… as real listeners (an inline handler
     would be blocked by a strict page), anything else as an attribute; null and false are skipped, strings become text.
     ds.ico(name) is an icon of the sprite. Studio drew its whole page so; ds's own parts can too. */
  var SVGNS = "http://www.w3.org/2000/svg";
  function h(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "style") node.setAttribute("style", v);
      else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return node;
  }
  function ico(name, cls) {
    var svg = document.createElementNS(SVGNS, "svg"), use = document.createElementNS(SVGNS, "use");
    svg.setAttribute("class", "ico" + (cls ? " " + cls : ""));
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  /* ds.compact(n): a figure that must stay short, « 9 850 », « 57,9k », « 578k », « 1,2M » (« 57.9k » in English). */
  function compact(n) {
    if (n == null || isNaN(n)) return "";
    var a = Math.abs(n), lang = english() ? "en-GB" : "fr-FR";
    function f(x, d) { return new Intl.NumberFormat(lang, { maximumFractionDigits: d }).format(x).replace(/ /g, " "); }
    if (a < 10000) return number(n, 0);
    if (a < 100000) return f(n / 1000, 1) + "k";
    if (a < 1000000) return f(n / 1000, 0) + "k";
    return f(n / 1000000, a < 10000000 ? 1 : 0) + "M";
  }

  /* ds.avatar(name, src): a merchant's or a person's logo, its initial underneath while the image comes, or if it never does. */
  function avatar(name, src, cls) {
    var span = h("span", { class: "avatar" + (cls ? " " + cls : ""), "aria-hidden": "true" }, [String(name || "?").trim().charAt(0).toUpperCase() || "?"]);
    if (src) {
      var img = h("img", { src: src, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { img.remove(); });
      span.appendChild(img);
    }
    return span;
  }

  /* Foldable sections: <details class="fold" data-fold="key"> open as the device left them, each change remembered under
     ds-fold:<key>. On loading, and again with ds.fold(holder) once a page draws them anew. */
  function fold(root) {
    (root || document).querySelectorAll("details[data-fold]").forEach(function (d) {
      var v = null;
      try { v = localStorage.getItem("ds-fold:" + d.getAttribute("data-fold")); } catch (e) {}
      if (v != null) d.open = v === "1";
    });
  }
  document.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d.matches || !d.matches("details[data-fold]")) return;
    try { localStorage.setItem("ds-fold:" + d.getAttribute("data-fold"), d.open ? "1" : "0"); } catch (x) {}
  }, true);

  /* Whole rows that open: a row (tr.is-link, or any [data-row-link]) holding a link a.row-link, or a data-href, opens it on a
     click anywhere in it, but not on its own buttons, fields or links, not at the end of a text selection; Ctrl, ⌘ or the
     middle button open it in a new tab, as a link would. By delegation: rows drawn later work too. A row with neither link
     nor data-href is left to the page (Bank opens its sheet). On iPhone a stretched link does not cover a table row: hence this. */
  var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, [role="button"]';
  function rowHref(e) {
    var row = e.target.closest && e.target.closest("tr.is-link, [data-row-link]");
    if (!row || e.target.closest(INTERACTIVE)) return null;
    var sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed) return null;
    var link = row.querySelector("a.row-link");
    return { link: link, href: row.getAttribute("data-href") || (link && link.href) };
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.altKey || e.shiftKey) return;
    var r = rowHref(e);
    if (!r || !r.href) return;
    if (e.metaKey || e.ctrlKey) { window.open(r.href, "_blank", "noopener"); return; }
    if (r.link) r.link.click(); else location.href = r.href;
  });
  document.addEventListener("auxclick", function (e) {
    if (e.button !== 1) return;
    var r = rowHref(e);
    if (r && r.href) { e.preventDefault(); window.open(r.href, "_blank", "noopener"); }
  });

  /* ds.route(onRoute): the address after # as the page's state. « #analyse/patreon-alexis/derniers-membres?compte=hb » gives
     onRoute({parts: ["analyse", "patreon-alexis", "derniers-membres"], query: {compte: "hb"}}), at once and at every change
     (back, a link). ds.route.go(parts, query, {push}) writes it without the page jumping, replacing by default so that Back
     does not walk through every filter. ds.seek(anchor) brings [data-anchor="anchor"] into view, opens the foldable sections
     around it, and lights it a moment. Back from the sign-in page, the address left is found again (ds.api keeps it). */
  function parseRoute() {
    var raw = decodeURIComponent(location.hash.replace(/^#/, "")), q = raw.indexOf("?"), query = {};
    (q >= 0 ? raw.slice(q + 1) : "").split("&").forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf("=");
      query[i < 0 ? pair : pair.slice(0, i)] = i < 0 ? "" : pair.slice(i + 1);
    });
    return { parts: (q >= 0 ? raw.slice(0, q) : raw).split("/").filter(Boolean), query: query };
  }
  function route(onRoute) {
    window.addEventListener("hashchange", function () { onRoute(parseRoute()); });
    onRoute(parseRoute());
  }
  route.go = function (parts, query, o) {
    var q = Object.keys(query || {}).filter(function (k) { return query[k] != null && query[k] !== ""; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]); }).join("&");
    var hash = "#" + (parts || []).map(encodeURIComponent).join("/") + (q ? "?" + q : "");
    if (hash === location.hash) return;
    history[(o && o.push) ? "pushState" : "replaceState"](null, "", hash === "#" ? location.pathname + location.search : hash);
  };
  route.read = parseRoute;
  function seek(anchor) {
    var el = null;
    try { el = document.querySelector('[data-anchor="' + (window.CSS && CSS.escape ? CSS.escape(anchor) : anchor) + '"]'); } catch (e) {}
    if (!el) return false;
    for (var d = el.parentElement; d; d = d.parentElement) if (d.tagName === "DETAILS") d.open = true;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
    el.classList.remove("is-lit");
    void el.offsetWidth;
    el.classList.add("is-lit");
    setTimeout(function () { el.classList.remove("is-lit"); }, 2600);
    return true;
  }

  /* A form that deletes for good asks first: <form data-confirm="Supprimer ce client ? Cette action est irréversible."
     data-confirm-ok="Supprimer"> asks in ds.confirm (the question up to « ? » as its title, the rest as its text), never in
     the browser's box. Any form sent then shows its button busy (.btn.is-busy) until the page changes, so that a second
     click sends nothing twice; a form the page sends itself (its own submit listener stopped it) is left alone. */
  document.addEventListener("submit", function (e) {
    var form = e.target, message = form.getAttribute && form.getAttribute("data-confirm");
    if (message && form.getAttribute("data-confirmed") !== "true") {
      e.preventDefault();
      var by = e.submitter, parts = /^([\s\S]*?\?)\s+([\s\S]+)$/.exec(message);
      confirm({ title: parts ? parts[1] : message, text: parts ? parts[2] : "", ok: form.getAttribute("data-confirm-ok") || undefined, danger: true })
        .then(function (yes) {
          if (!yes) return;
          form.setAttribute("data-confirmed", "true");
          if (form.requestSubmit) form.requestSubmit(by); else form.submit();
        });
      return;
    }
    if (e.defaultPrevented) return;
    var button = e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    if (button) { button.classList.add("is-busy"); button.disabled = true; }
  });
  // back with the browser's Back, the page comes from its cache: its buttons are no longer busy
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    document.querySelectorAll(".btn.is-busy").forEach(function (b) { b.classList.remove("is-busy"); b.disabled = false; });
    document.querySelectorAll("form[data-confirmed]").forEach(function (f) { f.removeAttribute("data-confirmed"); });
  });

  /* The messages a server leaves for the page after a redirect, as <template data-toast data-type="good" data-text="…"
     data-action-label="Rouvrir" data-action-form="reopen">, shown on arrival in the bubble; the action, if any, sends that
     form of the page. Selecta's way, for any app that answers forms with a redirect. */
  function arrivals() {
    document.querySelectorAll("template[data-toast]").forEach(function (m) {
      var form = m.getAttribute("data-action-form") ? document.getElementById(m.getAttribute("data-action-form")) : null;
      toast({ type: m.getAttribute("data-type") || "good", text: m.getAttribute("data-text") || "",
              action: form ? { label: m.getAttribute("data-action-label"), run: function () { form.requestSubmit ? form.requestSubmit() : form.submit(); } } : undefined });
      m.remove();
    });
  }
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  onReady(function () { fold(); arrivals(); cameBack(); });

  window.ds = window.ds || {};
  window.ds.toast = toast;
  window.ds.confirm = confirm;
  window.ds.drawer = drawer;
  window.ds.status = status;
  window.ds.when = when;
  window.ds.ago = ago;
  window.ds.soon = soon;
  window.ds.date = dateText;
  window.ds.number = number;
  window.ds.money = money;
  window.ds.api = api;
  // a job's journal opened from outside its button: drawn again with the jobs last shown, then read
  jobs.open = function (key) {
    var st = logState(key);
    if (st.open) return;
    st.open = true;
    if (shownJobs) jobs.apply(null, shownJobs);
    fetchLogs(key);
  };
  window.ds.jobs = jobs;
  window.ds.busy = busy;
  window.ds.trouble = trouble;
  window.ds.h = h;
  window.ds.ico = ico;
  window.ds.compact = compact;
  window.ds.avatar = avatar;
  window.ds.fold = fold;
  window.ds.route = route;
  window.ds.seek = seek;
})();
/* ds.sheet(el, {onOpen, onClose}): the sheet of src/sheet.css, its veil el (<div class="sheet" hidden>) around its
   .sheet-panel. Returns {open(from), close(), toggle(), isOpen}; called again on the same el, it gives the same sheet.
   Opening it moves the focus into the panel, and Tab stays there; closing gives the focus back to what had it (or to
   from, e.g. the row that opened it). Escape, a click on the veil, its cross (.sheet-x) or a [data-sheet-close] close
   it: the last one opened first, and a window of ds.confirm over it keeps its own Escape. On a phone the page behind
   does not scroll while it is open (sheet.css). */
(function () {
  "use strict";
  var WORDS = { fr: { close: "Fermer" }, en: { close: "Close" } };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  // the sheets open, the last one on top
  var stack = [];
  function focusables(panel) {
    return [].filter.call(panel.querySelectorAll(FOCUSABLE), function (x) { return x.getClientRects().length > 0; });
  }
  function sheet(el, opts) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) return null;
    if (el._dsSheet) { if (opts) el._dsSheet.opts = opts; return el._dsSheet; }
    var panel = el.querySelector(".sheet-panel") || el, s = { el: el, panel: panel, opts: opts || {}, isOpen: false, before: null };
    el._dsSheet = s;
    panel.setAttribute("tabindex", "-1");
    el.querySelectorAll(".sheet-x").forEach(function (x) { if (!x.hasAttribute("aria-label")) x.setAttribute("aria-label", words().close); });
    s.open = function (from) {
      if (s.isOpen) return s;
      s.isOpen = true;
      s.before = from || document.activeElement;
      el.hidden = false;
      stack.push(s);
      panel.scrollTop = 0;
      panel.focus({ preventScroll: true });
      if (s.opts.onOpen) s.opts.onOpen(s);
      return s;
    };
    s.close = function () {
      if (!s.isOpen) return s;
      s.isOpen = false;
      el.hidden = true;
      stack.splice(stack.indexOf(s), 1);
      var back = s.before;
      s.before = null;
      // what opened it may be gone, drawn again while the sheet was open: then the focus stays where the page puts it
      if (back && back.focus && back.isConnected) back.focus({ preventScroll: true });
      if (s.opts.onClose) s.opts.onClose(s);
      return s;
    };
    s.toggle = function (from) { return s.isOpen ? s.close() : s.open(from); };
    el.addEventListener("click", function (e) {
      if (e.target === el || (e.target.closest && e.target.closest(".sheet-x, [data-sheet-close]"))) s.close();
    });
    return s;
  }
  // on <html>, so that a field inside the sheet (a picker's search) takes its own Escape first, and before the
  // drawer's, which listens on the document: Escape closes what is on top, and only that
  document.documentElement.addEventListener("keydown", function (e) {
    var top = stack[stack.length - 1];
    if (!top || e.defaultPrevented || document.querySelector(".dialog-veil")) return;
    if (e.key === "Escape") { e.preventDefault(); top.close(); return; }
    if (e.key !== "Tab") return;
    // Tab goes round inside the sheet, as long as the focus is in it
    var panel = top.panel, list = focusables(panel), at = document.activeElement;
    if (!list.length || !panel.contains(at)) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (at === first || at === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  });
  window.ds = window.ds || {};
  window.ds.sheet = sheet;
})();
/* The behaviour of the table of src/table.css.
   ds.sortable(table, {by, up, key, menu, onSort}) sorts it by its column titles, <th><button class="sort"
   data-sort="date">Date</button></th>. A click on a title sorts by that column; again, the other way. A new column
   starts the way one expects: names from A, figures and dates from the biggest and latest (or as its data-first says,
   "up" or "down"). The th in use carries aria-sort, which draws its arrow.
     by, up: the column and the way to start with (up: from the smallest, A, the oldest), unless the device remembers
     another choice under key (localStorage, as [by, up]); menu: a <select> that sorts too, the phone's menu, whose
     options say "by|1" (up) or "by|0" (down); it follows the titles and the titles follow it.
     onSort(by, up): the page sorts its own list and draws it again (it holds more rows than are shown, say); without
     it, the rows of the tbody are put in order here, by each cell's data-value or else its text, figures as figures,
     names in French order, empty cells last whichever the way.
   Returns {by, up, set(by, up)}; called again on the same table it gives the same, so a page that draws its table anew
   (Studio) calls it again on the new one and finds its choice under key.
   ds.selection(holder, {bar, count, onChange}) picks rows: each row of holder with a data-key and its box
   <input type="checkbox" class="sel-box">; a click on a box picks or drops its row, a shift-click the rows since the
   last box; the box .sel-all picks every row shown, half-ticked when some are. A picked row is .is-selected. bar: the
   .selbar (else the one in holder), shown while something is picked, its .selbar-n saying how many (count(n), in
   words), its [data-sel-clear] dropping all. The choice is kept by key, so a list drawn again keeps it: call paint().
   Returns {keys(), has(key), set(key, on), clear(), paint()}; onChange(keys) after each change. */
(function () {
  "use strict";
  var WORDS = {
    fr: { picked: function (n) { return n + (n > 1 ? " lignes choisies" : " ligne choisie"); } },
    en: { picked: function (n) { return n + (n > 1 ? " rows selected" : " row selected"); } }
  };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  function find(el) { return typeof el === "string" ? document.querySelector(el) : el; }
  function store(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function stored(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }

  // a cell's place in its row, its colspans counted, and the cell at that place in another row
  function place(cell) {
    var at = 0, c = cell.parentNode.firstElementChild;
    for (; c && c !== cell; c = c.nextElementSibling) at += c.colSpan || 1;
    return at;
  }
  function cellAt(row, at) {
    for (var c = row.firstElementChild, n = 0; c; c = c.nextElementSibling) {
      n += c.colSpan || 1;
      if (n > at) return c;
    }
    return null;
  }
  // what a cell holds: its data-value, else its text; « −1 234,50€ » and « 12% » are figures
  function value(cell) {
    if (!cell) return null;
    var raw = cell.hasAttribute("data-value") ? cell.getAttribute("data-value") : cell.textContent;
    raw = raw.trim();
    if (!raw) return null;
    var n = raw.replace(/[\s  €%]/g, "").replace(/^\+/, "").replace(/^[−–]/, "-").replace(",", ".");
    return /^-?\d+(\.\d+)?$/.test(n) ? parseFloat(n) : raw;
  }
  var collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });
  var ISO = /^\d{4}-\d{2}(-\d{2})?/;

  function sortable(table, o) {
    table = find(table);
    if (!table) return null;
    if (table._dsSort) { if (o) table._dsSort.o = o; return table._dsSort; }
    var s = { table: table, o: o || {}, by: null, up: false };
    table._dsSort = s;
    var saved = s.o.key ? stored(s.o.key) : null;
    if (saved && saved.length === 2) { s.by = saved[0]; s.up = !!saved[1]; }
    else if (s.o.by) { s.by = s.o.by; s.up = !!s.o.up; }
    function buttons() { return [].slice.call(table.querySelectorAll("thead .sort[data-sort]")); }
    function button(by) { return buttons().filter(function (b) { return b.getAttribute("data-sort") === by; })[0]; }
    function rows() { return [].slice.call(table.tBodies).reduce(function (all, b) { return all.concat([].slice.call(b.rows)); }, []); }
    // a new column's first way: its data-first, else from the biggest for figures and dates, from A for words
    function first(b) {
      var f = b.getAttribute("data-first");
      if (f) return f === "up";
      var at = place(b.closest("th")), list = rows();
      for (var i = 0; i < list.length; i++) {
        var v = value(cellAt(list[i], at));
        if (v != null) return typeof v === "string" && !ISO.test(v);
      }
      return false;
    }
    function mark() {
      buttons().forEach(function (b) {
        var on = b.getAttribute("data-sort") === s.by;
        b.closest("th").setAttribute("aria-sort", on ? (s.up ? "ascending" : "descending") : "none");
      });
      var menu = find(s.o.menu), v = s.by + "|" + (s.up ? 1 : 0);
      if (menu && [].some.call(menu.options, function (x) { return x.value === v; })) {
        menu.value = v;
        if (window.ds.pills && menu.closest(".pill")) window.ds.pills(menu.closest(".pill"));
      }
    }
    function order() {
      var b = button(s.by);
      if (!b) return;
      var at = place(b.closest("th")), way = s.up ? 1 : -1;
      [].forEach.call(table.tBodies, function (body) {
        var list = [].slice.call(body.rows).map(function (r, i) { return { r: r, v: value(cellAt(r, at)), i: i }; });
        list.sort(function (a, z) {
          if (a.v == null || z.v == null) return a.v == null && z.v == null ? a.i - z.i : a.v == null ? 1 : -1;
          var c = typeof a.v === "number" && typeof z.v === "number" ? a.v - z.v : collator.compare(String(a.v), String(z.v));
          // the same value: as they came
          return c ? c * way : a.i - z.i;
        });
        list.forEach(function (x) { body.appendChild(x.r); });
      });
    }
    s.set = function (by, up) {
      s.by = by;
      s.up = !!up;
      if (s.o.key) store(s.o.key, [s.by, s.up]);
      mark();
      if (s.o.onSort) s.o.onSort(s.by, s.up); else order();
      return s;
    };
    table.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("thead .sort[data-sort]");
      if (!b || !table.contains(b)) return;
      var by = b.getAttribute("data-sort");
      s.set(by, by === s.by ? !s.up : first(b));
    });
    // the menu sorts the last table given to it: a page that draws its table anew keeps one menu, and one listener
    var menu = find(s.o.menu);
    if (menu) {
      if (!menu._dsSort) menu.addEventListener("change", function () {
        var parts = menu.value.split("|");
        if (parts[0]) menu._dsSort.set(parts[0], parts[1] === "1");
      });
      menu._dsSort = s;
    }
    // drawn as chosen from the start; a page that sorts itself has drawn its list already
    mark();
    if (s.by && !s.o.onSort) order();
    return s;
  }

  function selection(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    if (holder._dsSel) { if (o) holder._dsSel.o = o; return holder._dsSel; }
    var sel = { o: o || {}, picked: new Set(), last: null };
    holder._dsSel = sel;
    function bar() { return find(sel.o.bar) || holder.querySelector(".selbar"); }
    function rows() { return [].filter.call(holder.querySelectorAll("[data-key]"), function (r) { return r.querySelector(".sel-box"); }); }
    function changed() { sel.paint(); if (sel.o.onChange) sel.o.onChange(sel.keys()); }
    sel.keys = function () { return Array.from(sel.picked); };
    sel.has = function (key) { return sel.picked.has(String(key)); };
    sel.set = function (key, on) { if (on) sel.picked.add(String(key)); else sel.picked.delete(String(key)); changed(); return sel; };
    sel.clear = function () { sel.picked.clear(); sel.last = null; changed(); return sel; };
    sel.paint = function () {
      var list = rows(), shown = 0;
      list.forEach(function (r) {
        var on = sel.picked.has(r.getAttribute("data-key"));
        r.classList.toggle("is-selected", on);
        r.querySelector(".sel-box").checked = on;
        if (on) shown++;
      });
      var all = holder.querySelector(".sel-all");
      if (all) { all.checked = list.length > 0 && shown === list.length; all.indeterminate = shown > 0 && shown < list.length; }
      var b = bar(), n = sel.picked.size;
      if (b) {
        b.hidden = !n;
        var count = b.querySelector(".selbar-n");
        if (count) count.textContent = (sel.o.count || words().picked)(n);
      }
      return sel;
    };
    holder.addEventListener("click", function (e) {
      var box = e.target.closest && e.target.closest(".sel-box");
      if (!box || !holder.contains(box)) return;
      var list = rows(), row = box.closest("[data-key]"), keys = list.map(function (r) { return r.getAttribute("data-key"); });
      var i = list.indexOf(row), j = sel.last == null ? -1 : keys.indexOf(sel.last);
      // shift-click picks, or drops, the whole range since the last box
      var span = e.shiftKey && j >= 0 ? list.slice(Math.min(i, j), Math.max(i, j) + 1) : [row];
      span.forEach(function (r) { if (box.checked) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key")); });
      sel.last = row.getAttribute("data-key");
      changed();
    });
    holder.addEventListener("change", function (e) {
      if (!e.target.classList || !e.target.classList.contains("sel-all")) return;
      rows().forEach(function (r) { if (e.target.checked) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key")); });
      changed();
    });
    // « Annuler » in the bar, wherever the bar is
    document.addEventListener("click", function (e) {
      var b = bar(), x = e.target.closest && e.target.closest("[data-sel-clear]");
      if (x && b && b.contains(x)) sel.clear();
    });
    sel.paint();
    return sel;
  }
  window.ds = window.ds || {};
  window.ds.sortable = sortable;
  window.ds.selection = selection;
})();
/* The behaviour of src/pick.css.
   ds.pills(root): each pill of root (or the page, or root itself when it is one) says its menu's choice in its .pv,
   and a .pill.is-filter is lit (.is-on) while its menu holds a value. Done on its own when the page is ready and on
   every change of a pill's menu; a page that sets a menu itself (select.value = …) calls it after.
   ds.picker(holder, {items, value, first, limit, placeholder, label, empty, onPick, opener}) draws a search picker in
   holder: a field, then the choices that match what is typed, accents and capitals aside, every word of it.
     items: [{value, label, sub (a word in small after it), group (its heading), color (its --n), initial or icon,
     cta (what a tap does), href (a link: a tap goes there), keywords (more words it is found by)}], or null while they
     are read (« Chargement… »); value: the current choice, in gold; first: the values shown before anything is typed
     (the banks most people have), else every choice; limit: how many at most (12); empty: the words when nothing
     matches; onPick(item) on a tap or Enter; opener: a button that shows and hides it (aria-expanded), the search
     taking the focus. ↑ and ↓ go through the choices, Enter takes one, Escape empties the search, then closes it.
     Returns {open(), close(), toggle(), set(items), draw(), input}. */
(function () {
  "use strict";
  var WORDS = {
    fr: { search: "Chercher…", none: "Rien ne correspond.", loading: "Chargement de la liste…" },
    en: { search: "Search…", none: "Nothing matches.", loading: "Loading the list…" }
  };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  function find(el) { return typeof el === "string" ? document.querySelector(el) : el; }
  function tag(name, cls, text) {
    var e = document.createElement(name);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function pills(root) {
    root = find(root) || document;
    var list = root.matches && root.matches(".pill") ? [root] : root.querySelectorAll(".pill");
    [].forEach.call(list, function (p) {
      var sel = p.querySelector("select");
      if (!sel) return;
      var pv = p.querySelector(".pv");
      if (!pv) { pv = tag("span", "pv"); p.insertBefore(pv, p.firstChild); }
      var o = sel.options[sel.selectedIndex];
      pv.textContent = o ? o.textContent : "";
      if (p.classList.contains("is-filter")) p.classList.toggle("is-on", !!sel.value);
    });
  }
  document.addEventListener("change", function (e) {
    var p = e.target.closest && e.target.closest(".pill");
    if (p) pills(p);
  });
  // now, for what is on the page already, and once it is all there, for what a page's first script drew
  pills();
  document.addEventListener("DOMContentLoaded", function () { pills(); });

  var made = 0;
  function fold(t) { return String(t == null ? "" : t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function picker(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    o = o || {};
    var w = words(), id = "ds-picker-" + (++made), p = { items: o.items === undefined ? [] : o.items, shown: [], active: -1 };
    holder.classList.add("picker");
    var input = tag("input", "picker-q"), list = tag("div", "picker-list");
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = o.placeholder || w.search;
    input.setAttribute("aria-label", o.label || input.placeholder);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", id);
    list.id = id;
    list.setAttribute("role", "listbox");
    holder.replaceChildren(input, list);
    p.input = input;

    function matches() {
      var items = p.items || [], q = fold(input.value.trim()), limit = o.limit || 12;
      if (!q) {
        var start = o.first ? o.first.map(function (v) { return items.filter(function (x) { return fold(x.value) === fold(v); })[0]; }).filter(Boolean) : items;
        return start.slice(0, limit);
      }
      var parts = q.split(/\s+/);
      return items.filter(function (x) {
        var text = fold([x.label, x.sub, x.group, x.keywords].join(" "));
        return parts.every(function (part) { return text.indexOf(part) >= 0; });
      }).slice(0, limit);
    }
    function option(x, i) {
      var opt = tag(x.href ? "a" : "button", "picker-opt");
      if (x.href) opt.href = x.href; else opt.type = "button";
      opt.id = id + "-" + i;
      opt.tabIndex = -1;
      opt.setAttribute("role", "option");
      opt.setAttribute("aria-selected", o.value != null && String(x.value) === String(o.value) ? "true" : "false");
      if (x.initial || x.icon || x.color) {
        var av = tag("span", "picker-av" + (x.initial || x.icon ? "" : " is-dot"), x.initial || null);
        av.setAttribute("aria-hidden", "true");
        if (x.color) av.style.setProperty("--n", x.color);
        if (x.icon) {
          var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), use = document.createElementNS("http://www.w3.org/2000/svg", "use");
          svg.setAttribute("class", "ico");
          use.setAttribute("href", "#i-" + x.icon);
          svg.appendChild(use);
          av.appendChild(svg);
        }
        opt.appendChild(av);
      }
      var name = tag("span", "picker-name", x.label);
      if (x.sub) { name.append(" "); name.appendChild(tag("small", "", x.sub)); }
      opt.appendChild(name);
      if (x.cta) opt.appendChild(tag("span", "picker-cta", x.cta));
      opt.addEventListener("click", function () { pick(x); });
      return opt;
    }
    p.draw = function () {
      p.shown = p.items ? matches() : [];
      p.active = -1;
      input.removeAttribute("aria-activedescendant");
      var kids = [], group = null;
      if (!p.items) kids.push(tag("p", "picker-none", w.loading));
      else if (!p.shown.length) kids.push(tag("p", "picker-none", o.empty || w.none));
      p.shown.forEach(function (x, i) {
        // a heading each time the group changes: a category, then its subcategories
        if (x.group && x.group !== group) kids.push(tag("p", "picker-g", x.group));
        group = x.group || null;
        kids.push(option(x, i));
      });
      list.replaceChildren.apply(list, kids);
      return p;
    };
    function light(i) {
      var opts = list.querySelectorAll(".picker-opt");
      if (!opts.length) return;
      p.active = (i + opts.length) % opts.length;
      [].forEach.call(opts, function (x, k) { x.classList.toggle("is-active", k === p.active); });
      input.setAttribute("aria-activedescendant", opts[p.active].id);
      opts[p.active].scrollIntoView({ block: "nearest" });
    }
    function pick(x) {
      o.value = x.value;
      if (o.onPick) o.onPick(x);
      if (x.href) return;
      p.draw();
    }
    input.addEventListener("input", p.draw);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); light(p.active < 0 && e.key === "ArrowUp" ? -1 : p.active + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter") {
        // Enter takes the lit choice, or the first one once something is typed
        var x = p.shown[p.active >= 0 ? p.active : input.value.trim() ? 0 : -1];
        if (!x) return;
        e.preventDefault();
        if (x.href) { if (o.onPick) o.onPick(x); location.href = x.href; } else pick(x);
      } else if (e.key === "Escape") {
        // first the search, then the picker itself; with nothing left to do, Escape goes on to the sheet around it
        if (input.value) { e.preventDefault(); input.value = ""; p.draw(); }
        else if (opener && !holder.hidden) { e.preventDefault(); p.close(); opener.focus(); }
      }
    });
    var opener = find(o.opener);
    p.open = function () {
      holder.hidden = false;
      if (opener) opener.setAttribute("aria-expanded", "true");
      p.draw();
      input.focus();
      return p;
    };
    p.close = function () {
      holder.hidden = true;
      if (opener) opener.setAttribute("aria-expanded", "false");
      return p;
    };
    p.toggle = function () { return holder.hidden ? p.open() : p.close(); };
    p.set = function (items) { p.items = items; return p.draw(); };
    if (opener) {
      opener.setAttribute("aria-controls", holder.id || (holder.id = id + "-box"));
      opener.setAttribute("aria-expanded", holder.hidden ? "false" : "true");
      opener.addEventListener("click", p.toggle);
    }
    return p.draw();
  }
  window.ds = window.ds || {};
  window.ds.pills = pills;
  window.ds.picker = picker;
})();
/* ds.reorder(list, {item, handle, onEnd}): the items of list, put in another order by their grip (src/reorder.css).
   item: what an item is among list's children (a selector; all of them by default); handle: its grip (".grip").
   With the mouse or a finger, the item follows the pointer and the others make room for it; near the top or the
   bottom of the screen the page scrolls along. With the keyboard, ↑ and ↓ on a grip move its item by one.
   A list inside an item (the accounts of a bank) is a list of its own: call ds.reorder on it too; each grip moves the
   item of its own list only. onEnd(items, item) once an item has landed somewhere else: the items in their new order
   (read their data-key), and the one that moved. Returns {items()}; called again on the same list it gives the same. */
(function () {
  "use strict";
  var WORDS = { fr: { move: "Déplacer" }, en: { move: "Move" } };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  function find(el) { return typeof el === "string" ? document.querySelector(el) : el; }
  // the neighbours move at once in the page, then slide from where they were to where they are
  function slide(els, move) {
    var before = els.map(function (el) { return el.offsetTop; });
    move();
    els.forEach(function (el, i) {
      var delta = before[i] - el.offsetTop;
      if (!delta) return;
      el.classList.remove("is-shifting");
      el.style.transform = "translateY(" + delta + "px)";
      void el.offsetWidth;
      el.classList.add("is-shifting");
      el.style.transform = "";
      clearTimeout(el._dsSlide);
      el._dsSlide = setTimeout(function () { el.classList.remove("is-shifting"); }, 450);
    });
  }
  function reorder(list, o) {
    list = find(list);
    if (!list) return null;
    if (list._dsReorder) { if (o) list._dsReorder.o = o; return list._dsReorder; }
    var r = { o: o || {} }, d = null;
    list._dsReorder = r;
    list.setAttribute("data-reorder", "");
    function handle() { return r.o.handle || ".grip"; }
    function isItem(c) { return c && c.parentNode === list && (!r.o.item || c.matches(r.o.item)); }
    r.items = function () { return [].filter.call(list.children, isItem); };
    function next(it) { var c = it.nextElementSibling; while (c && !isItem(c)) c = c.nextElementSibling; return c; }
    function prev(it) { var c = it.previousElementSibling; while (c && !isItem(c)) c = c.previousElementSibling; return c; }
    // a grip of this list, not of a list inside one of its items
    function grip(target) {
      var h = target.closest && target.closest(handle());
      return h && h.closest("[data-reorder]") === list ? h : null;
    }
    function itemOf(h) { var c = h; while (c && c.parentNode !== list) c = c.parentNode; return isItem(c) ? c : null; }
    function name() {
      list.querySelectorAll(handle()).forEach(function (h) { if (h.closest("[data-reorder]") === list && !h.hasAttribute("aria-label")) h.setAttribute("aria-label", words().move); });
    }
    function done(it) { if (r.o.onEnd) r.o.onEnd(r.items(), it); }
    // where the dragged item should be: under the pointer, within the list; the neighbours it passed go the other way
    function place() {
      var it = d.it, all = r.items(), h = it.offsetHeight;
      var want = d.top + (d.last + window.scrollY) - (d.y + d.sy);
      var low = Math.min.apply(null, all.map(function (x) { return x.offsetTop; }));
      var high = Math.max.apply(null, all.map(function (x) { return x.offsetTop + x.offsetHeight; })) - h;
      want = Math.max(low, Math.min(high, want));
      // a neighbour gives way once the item's far edge passes its middle, whatever their heights (a bank and its
      // accounts past a bank with a single one)
      var sib;
      while ((sib = next(it)) && want + h > sib.offsetTop + sib.offsetHeight / 2) slide([sib], function () { list.insertBefore(sib, it); });
      while ((sib = prev(it)) && want < sib.offsetTop + sib.offsetHeight / 2) slide([sib], function () { list.insertBefore(sib, it.nextSibling); });
      it.style.transform = "translateY(" + (want - it.offsetTop) + "px)";
    }
    function move(e) { if (d && e.pointerId === d.id) { d.last = e.clientY; place(); } }
    // near an edge of the screen, the page scrolls along with the item
    function edge() {
      if (!d) return;
      var zone = 56, v = 0;
      if (d.last < zone) v = -Math.ceil((zone - d.last) / 4);
      else if (d.last > window.innerHeight - zone) v = Math.ceil((d.last - window.innerHeight + zone) / 4);
      if (v) { window.scrollBy(0, v); place(); }
      d.raf = requestAnimationFrame(edge);
    }
    function end() {
      if (!d) return;
      var x = d;
      d = null;
      cancelAnimationFrame(x.raf);
      ["pointermove", "pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { x.h.removeEventListener(t, t === "pointermove" ? move : end); });
      x.it.classList.remove("is-dragging");
      x.it.classList.add("is-shifting");
      x.it.style.transform = "";
      setTimeout(function () { x.it.classList.remove("is-shifting"); }, 450);
      document.documentElement.classList.remove("is-reordering");
      var now = r.items();
      if (now.some(function (it, i) { return it !== x.order[i]; })) done(x.it);
    }
    list.addEventListener("pointerdown", function (e) {
      if (d || (e.pointerType === "mouse" && e.button !== 0)) return;
      var h = grip(e.target), it = h && itemOf(h);
      if (!it) return;
      e.preventDefault();
      d = { it: it, h: h, id: e.pointerId, y: e.clientY, last: e.clientY, sy: window.scrollY, top: it.offsetTop, order: r.items(), raf: 0 };
      try { h.setPointerCapture(e.pointerId); } catch (err) {}
      it.classList.remove("is-shifting");
      it.classList.add("is-dragging");
      document.documentElement.classList.add("is-reordering");
      h.addEventListener("pointermove", move);
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { h.addEventListener(t, end); });
      d.raf = requestAnimationFrame(edge);
    });
    list.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      var h = grip(e.target), it = h && itemOf(h);
      if (!it) return;
      e.preventDefault();
      var up = e.key === "ArrowUp", sib = up ? prev(it) : next(it);
      if (!sib) return;
      // the neighbour moves, not the item, so that its grip keeps the focus
      slide([sib, it], function () { list.insertBefore(sib, up ? it.nextSibling : it); });
      done(it);
    });
    list.addEventListener("focusin", name);
    name();
    return r;
  }
  window.ds = window.ds || {};
  window.ds.reorder = reorder;
})();
/* Calendar, taken from Studio's agenda: ds.calendar(holder, opts) draws the period head (the month's name, which opens a
   month picker, ds.datePick on months; the views; ‹ Aujourd’hui ›) and under it one of three views: a month of day
   cells, with the panel of the selected day below; a week of columns; a list of days, each in its panel.
   opts: view ("month", "week" or "list"), day (the selected day, "2026-11-09": today by default), items(key) (the day's
   items, in the order they are shown), panel(key, items) (what the day's panel holds under its title: one or more nodes;
   by default one row per item), row(item, key) (a row of a week's column or of the default panel), body (where the view
   goes: holder by default, after the head; a page may put it beside its filters), lines (lines in a cell, 8 by default),
   years ([first, last] in the picker), today (the day taken as today, for a page's checks), onChange(state),
   ready(state) (false while the page has yet to read the days asked for: the calendar keeps showing what it showed,
   with what the page now holds, and moves once a later draw() finds them ready; without it, it moves at once).
   An item: {title, color ("--c-bleu": its mark), mark ("square", "dot", "bar" or "thick"), open (an empty mark: not done
   yet), codes ([{text, color, title}] or "IG": small coloured labels), count ("2/4": a group, one title on several codes,
   which gives its title first and its codes last, the ones a narrow cell drops), time ("10h00": in a cell for a bar
   only), place, href, done (greyed), late (in red; lateText adds a red badge to its row), note (said on hover)}.
   On a phone, a cell shows a dot per item, three at most, then « +N ».
   Returns {draw(), set({view, day}), go(step), today(), state()}: state() is {view, day, from, to}, the days shown
   (to excluded), what a page reads to load them; onChange receives it after each move, then the page calls draw()
   once it has what those days hold. ds.calendar.row(item) and ds.calendar.mark(item) build a default row and a mark,
   for a page that fills the panels itself. */
(function () {
  "use strict";
  var TZ = "Europe/Paris", DOTS = 3, VIEWS = ["month", "week", "list"];
  var WORDS = {
    fr: { month: "Mois", week: "Semaine", list: "Liste", prev: "Précédent", next: "Suivant", today: "Aujourd’hui", pick: "Aller à un autre mois",
          view: "Vue", before: "Jours précédents", hideBefore: "Masquer les jours précédents", none: "Rien ce jour-là.",
          count: function (n) { return n + (n > 1 ? " éléments" : " élément"); } },
    en: { month: "Month", week: "Week", list: "List", prev: "Previous", next: "Next", today: "Today", pick: "Go to another month",
          view: "View", before: "Days before", hideBefore: "Hide the days before", none: "Nothing on that day.",
          count: function (n) { return n + (n > 1 ? " items" : " item"); } }
  };
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }
  function words() { return english() ? WORDS.en : WORDS.fr; }
  function el(name, cls, text) {
    var e = document.createElement(name);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  // the days are Paris's days, written "2026-11-09", counted at noon UTC so that no clock change moves them
  function parisToday() { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
  function at(key) { return new Date(key + "T12:00:00Z"); }
  function addDays(key, n) { var d = at(key); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function weekStart(key) { return addDays(key, -((at(key).getUTCDay() + 6) % 7)); }
  function fmt(key, o) { return new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", Object.assign({ timeZone: "UTC" }, o)).format(at(key)); }
  function longDay(key) { return window.ds.date(key, "weekday"); }
  function shortDay(key) { return window.ds.date(key, "day"); }
  // a colour given as a token's name ("--c-bleu") or as a value
  function tone(c) { return /^--/.test(c) ? "var(" + c + ")" : c; }

  function mark(it) {
    var m = el("i", "cal-mark" + (it.mark && it.mark !== "square" ? " is-" + it.mark : "") + (it.open ? " is-open" : ""));
    m.setAttribute("aria-hidden", "true");
    if (it.color) m.style.setProperty("--n", tone(it.color));
    return m;
  }
  function codes(it) {
    var list = it.codes == null ? [] : [].concat(it.codes);
    return list.map(function (c) {
      if (typeof c === "string") c = { text: c, color: it.color };
      var s = el("span", "cal-code", c.text);
      if (c.color) s.style.setProperty("--n", tone(c.color));
      if (c.title) s.title = c.title;
      return s;
    });
  }
  function isBar(it) { return it.mark === "bar" || it.mark === "thick"; }
  // a cell's line: its mark, its codes, its title, its count; on a phone the mark alone, for the first three
  function line(it, i) {
    var ln = el("span", "cal-line" + (isBar(it) ? " is-bar" : "") + (it.done ? " is-done" : "") + (it.late ? " is-late" : "") + (i >= DOTS ? " is-extra" : ""));
    ln.title = it.note || it.title || "";
    ln.append(mark(it));
    // a group's codes come after its title and its count: in a narrow cell they would otherwise hide the title
    if (!it.count) codes(it).forEach(function (c) { ln.append(c); });
    // a cell is narrow: only what happens at an hour (a bar) gives it there; the rows say every time
    ln.append(el("span", "cal-lt", (it.time && isBar(it) ? it.time + " " : "") + (it.title || "")));
    if (it.count) {
      ln.append(el("span", "cal-count", it.count));
      codes(it).forEach(function (c) { ln.append(c); });
    }
    return ln;
  }
  // a row of a day: its time, its mark and codes, its title (a link when it has one), its place
  function defaultRow(it) {
    var li = el("li", it.done ? "is-done" : "");
    li.append(el("span", "t", it.time || "—"), mark(it));
    codes(it).forEach(function (c) { li.append(c); });
    var t = el(it.href ? "a" : "span", "ttl", it.title || "");
    if (it.href) { t.href = it.href; t.target = "_blank"; t.rel = "noopener"; }
    li.append(t);
    if (it.place) li.append(el("span", "pl", it.place));
    if (it.late && it.lateText) li.append(el("span", "late", it.lateText));
    return li;
  }

  function calendar(holder, opts) {
    opts = opts || {};
    var st = { view: VIEWS.indexOf(opts.view) >= 0 ? opts.view : "month", day: opts.day || null, before: false };
    var lines = opts.lines || 8;
    function today() { return opts.today || parisToday(); }
    if (!st.day) st.day = today();
    function itemsOf(key) { var x = opts.items ? opts.items(key) : null; return Array.isArray(x) ? x : []; }
    function rowOf(it, key) { var r = opts.row ? opts.row(it, key) : null; return r || defaultRow(it); }

    // the head, made once: a redraw keeps the focus on the button just used
    var w = words(), root = el("div", "cal"), head = el("div", "periodhead cal-head"), left = el("div", "periodleft");
    var title = el("button", "periodtitle"), h3 = el("h3"), pop = el("div", "cal-jump");
    title.type = "button";
    title.title = w.pick;
    title.append(h3, el("span", "caret", "▾"));
    var first = +today().slice(0, 4) - 10, last = +today().slice(0, 4) + 2;
    if (opts.years) { first = opts.years[0]; last = opts.years[1]; }
    left.append(title, pop);
    // the month picker is the design system's date picker on months alone: the year's menu between its arrows, then the
    // twelve months, which keep the name the calendar gave them (.cal-months); a month leads there, Escape or a tap
    // elsewhere closes it
    var jump = window.ds.datePick(pop, { modes: ["month"], value: window.ds.datePick.of("month", st.day), years: [first, last], today: opts.today, label: w.pick,
      opener: title, onPick: function (v) { move(v.from); },
      onDraw: function (box) { var g = box.querySelector(".dp-grid"); if (g) g.classList.add("cal-months"); } });
    var nav = el("div", "periodnav cal-nav"), tabs = el("div", "tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", w.view);
    VIEWS.forEach(function (v) {
      var b = el("button", "", w[v]);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.dataset.view = v;
      b.addEventListener("click", function () { if (st.view !== v) { st.view = v; changed(); } });
      tabs.append(b);
    });
    var prev = el("button", "btn is-icon", "‹"), now = el("button", "btn", w.today), next = el("button", "btn is-icon", "›");
    [prev, now, next].forEach(function (b) { b.type = "button"; });
    prev.setAttribute("aria-label", w.prev);
    next.setAttribute("aria-label", w.next);
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    now.addEventListener("click", goToday);
    // the arrows and « Aujourd’hui » stay together when a narrow row sends them under the views
    var arrows = el("span", "cal-arrows");
    arrows.append(prev, now, next);
    nav.append(tabs, arrows);
    head.append(left, nav);
    var body = opts.body || el("div");
    body.classList.add("cal-body");
    root.append(head);
    if (!opts.body) root.append(body);
    holder.replaceChildren(root);

    function state() {
      var from, to;
      if (st.view === "month") { from = weekStart(st.day.slice(0, 8) + "01"); to = addDays(from, 42); }
      else if (st.view === "week") { from = weekStart(st.day); to = addDays(from, 7); }
      else { from = addDays(st.day, st.before ? -7 : 0); to = addDays(st.day, 8); }
      return { view: st.view, day: st.day, from: from, to: to };
    }
    function changed() {
      draw();
      if (opts.onChange) opts.onChange(state());
    }
    function move(key) { st.day = key; changed(); }
    // a step: a month in the month view (to its first day), a week otherwise
    function go(step) {
      if (st.view === "month") {
        var y = +st.day.slice(0, 4), mo = +st.day.slice(5, 7) - 1 + step;
        y += Math.floor(mo / 12);
        mo = ((mo % 12) + 12) % 12;
        move(y + "-" + String(mo + 1).padStart(2, "0") + "-01");
      } else move(addDays(st.day, 7 * step));
    }
    function goToday() { move(today()); }

    function titleText() {
      if (st.view === "month") return [fmt(st.day, { month: "long" }), el("span", "yr", " " + st.day.slice(0, 4))];
      var a = st.view === "week" ? weekStart(st.day) : st.day;
      return [shortDay(a) + " – " + shortDay(addDays(a, st.view === "week" ? 6 : 7))];
    }
    function panel(key) {
      var items = itemsOf(key), sec = el("section", "cal-day" + (key === today() ? " is-today" : ""));
      sec.dataset.day = key;
      sec.append(el("h2", "cal-day-t", longDay(key)));
      var inside = opts.panel ? opts.panel(key, items) : null;
      if (inside == null) {
        if (items.length) { var ul = el("ul", "rows"); items.forEach(function (it) { ul.append(rowOf(it, key)); }); inside = ul; }
        else inside = el("p", "empty", words().none);
      }
      [].concat(inside).forEach(function (n) { if (n) sec.append(n); });
      return sec;
    }
    function cell(key, inMonth) {
      var items = itemsOf(key), t = today(), b = el("button", "cal-cell" + (inMonth ? "" : " is-off") + (key === t ? " is-today" : "") + (key === st.day ? " is-sel" : ""));
      b.type = "button";
      b.dataset.day = key;
      b.setAttribute("aria-pressed", key === st.day ? "true" : "false");
      // what the cell holds is told in the panel it opens: the cell says its day and how much is on it
      b.setAttribute("aria-label", longDay(key) + (items.length ? ", " + words().count(items.length) : ""));
      if (key === t) b.setAttribute("aria-current", "date");
      b.append(el("span", "cal-n", String(+key.slice(8))));
      items.slice(0, lines).forEach(function (it, i) { b.append(line(it, i)); });
      if (items.length > lines) b.append(el("span", "cal-more", "+" + (items.length - lines)));
      if (items.length > DOTS) b.append(el("span", "cal-more-dots", "+" + (items.length - DOTS)));
      b.addEventListener("click", function () {
        st.day = key;
        changed();
        var again = body.querySelector('.cal-cell[data-day="' + key + '"]');
        if (again) again.focus({ preventScroll: true });
      });
      return b;
    }
    function month() {
      var dow = el("div", "cal-dow"), grid = el("div", "cal-grid"), start = weekStart(st.day.slice(0, 8) + "01"), mo = st.day.slice(0, 7);
      for (var i = 0; i < 7; i++) dow.append(el("span", "", fmt(addDays(start, i), { weekday: "short" }).replace(".", "")));
      for (var j = 0; j < 42; j++) {
        var key = addDays(start, j);
        // five weeks are enough for most months: a sixth row only when the month reaches it, and then a whole week,
        // its last days those of the next month, as on the rows above
        if (j === 35 && key.slice(0, 7) !== mo) break;
        grid.append(cell(key, key.slice(0, 7) === mo));
      }
      return [dow, grid, panel(st.day)];
    }
    function week() {
      var ws = weekStart(st.day), t = today(), out = el("div", "cal-week");
      for (var i = 0; i < 7; i++) {
        var key = addDays(ws, i), items = itemsOf(key), col = el("div", "cal-wcol" + (key === t ? " is-today" : "")), h = el("h3", "", fmt(key, { weekday: "long" }));
        col.dataset.day = key;
        h.append(el("span", "cal-wdate", shortDay(key)));
        col.append(h);
        if (items.length) { var ul = el("ul", "rows"); items.forEach(function (it) { ul.append(rowOf(it, key)); }); col.append(ul); }
        else col.append(el("p", "empty", "—"));
        out.append(col);
      }
      return [out];
    }
    // the list starts on the selected day and runs a week ahead; the week before stays folded above
    function list() {
      var w = words(), out = [], toggle = el("button", "cal-prev");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", st.before ? "true" : "false");
      toggle.append(el("span", "caret", st.before ? "▾" : "▸"), st.before ? w.hideBefore : w.before);
      toggle.addEventListener("click", function () {
        st.before = !st.before;
        changed();
        var again = body.querySelector(".cal-prev");
        if (again) again.focus({ preventScroll: true });
      });
      out.push(toggle);
      for (var i = st.before ? -7 : 0; i < 8; i++) out.push(panel(addDays(st.day, i)));
      return out;
    }
    // what is on screen; a page still reading the days asked for (ready) keeps it there, drawn again with what it holds
    var shown = null;
    function draw() {
      var want = st, hold = shown && opts.ready && !opts.ready(state());
      if (hold) st = shown;
      try { paint(); } finally {
        if (hold) st = want;
        else shown = { view: st.view, day: st.day, before: st.before };
      }
    }
    function paint() {
      h3.replaceChildren.apply(h3, titleText());
      [].forEach.call(tabs.children, function (b) { b.setAttribute("aria-selected", b.dataset.view === st.view ? "true" : "false"); });
      // the month picker follows the day while it is shut; open, it keeps what one is looking at
      if (pop.hidden) jump.set(window.ds.datePick.of("month", st.day));
      body.dataset.view = st.view;
      body.replaceChildren.apply(body, st.view === "month" ? month() : st.view === "week" ? week() : list());
    }
    function set(o) {
      o = o || {};
      if (VIEWS.indexOf(o.view) >= 0) st.view = o.view;
      if (o.day) st.day = o.day;
      draw();
    }
    draw();
    return { draw: draw, set: set, go: go, today: goToday, state: state, el: root };
  }

  // a day's default row, for a page that fills its panels itself (panel) and still wants the calendar's rows
  calendar.row = defaultRow;
  calendar.mark = mark;
  window.ds = window.ds || {};
  window.ds.calendar = calendar;
})();
/* Charts, taken from Studio's analysis. Each one draws into holder (its content replaced) and returns its element; with
   holder null it only returns it, for a page that builds its own tree. The colour of a series is a token, given as its
   name (color: "--c-bleu") and set as --n on the chart; the lines, labels and grounds come from the theme.
   ds.chart.line(holder, points, {color, label, value}): a curve, its highest and lowest values on its right, its first
     and last days under it. points: [{x: "2026-11-09", v: 1240}]; label(x) and value(v) write them (a short date and a
     figure by default).
   ds.chart.bars(holder, rows, {color, average, unit, short, selected, pick}): bars on a round scale (0, 500, 1 000…),
     the figure on each bar, a dashed line at the average. rows: [{key, label, value, parts: [{value, color}], live,
     title}]: parts stack their colours in the bar; live hatches a period still running; a "2026-11" key is named by its
     month. pick(key) makes the bars buttons, the selected one lit.
     Paired, with pairs: [{key, label, color}] (Bank's money in and out), each row carries one value per series under its
     key ({key: "2026-11", income: 3200, spending: 2104}): a bar per series side by side, their figures stacked over
     them on hover or when chosen, and a legend that adds each series up, written by format(v) (the figure and unit by
     default).
   ds.chart.heat(holder, counts, {color, to, from, weeks, steps, title, below, legend, note}): a year of days, one square
     per day, a column per week, Monday on top, pale on a day with nothing, coloured from steps[0] (1), full from
     steps[1] (2); the days before from fade, those after to (today) are left out; below(weekStart) writes a figure
     under a week (what it gained), or {text, title} to say more on hover. counts: {"2026-11-09": 2}. In a card narrower than a year (740px, a phone) it
     scrolls sideways, opened on its last weeks.
   ds.chart.spark(holder, values, {color, top, title}): small bars side by side, as tall as their value against top
     (a story's views against the best story shown).
   ds.chart.split(holder, parts, {format}): one bar split by share, then its legend. parts: [{label, value, color}].
   ds.chart.donut(holder, rows, {format, selected, pick, center}): a ring split by share, the total in its hole, and its
     legend beside it (under it on a phone), a row per slice: its colour, its name, its share, its amount. rows: [{key,
     label, value, color}] (nothing at or under 0 is drawn); center: the word under the total (« dépensés »), or
     {value, label}; pick(key) makes the slices and the rows buttons: a tap chooses one, which the hole then says,
     another tap lets it go (pick(null)); the slices are one stop of the keyboard, the arrows go round them. */
(function () {
  "use strict";
  var SVG = "http://www.w3.org/2000/svg";
  var WORDS = {
    fr: { none: "rien", one: "1", many: function (n) { return n + " et plus"; }, live: "en cours" },
    en: { none: "none", one: "1", many: function (n) { return n + " or more"; }, live: "running" }
  };
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }
  function words() { return english() ? WORDS.en : WORDS.fr; }
  function el(name, cls, text) {
    var e = document.createElement(name);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function svg(name, attrs) {
    var e = document.createElementNS(SVG, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function tone(c) { return /^--/.test(c) ? "var(" + c + ")" : c; }
  function paint(e, color) { if (color) e.style.setProperty("--n", tone(color)); return e; }
  function put(holder, e) { if (holder) holder.replaceChildren.apply(holder, e ? [e] : []); return e; }
  function num(v) { return window.ds.number(v); }
  // big figures made short where room is tight: 1 240 → 1,2k, 12 500 → 13k
  function short(v) {
    var a = Math.abs(v);
    if (a < 1000) return num(Math.round(v));
    return (a < 10000 ? window.ds.number(Math.round(v / 100) / 10, Math.round(v / 100) % 10 ? 1 : 0) : num(Math.round(v / 1000))) + "k";
  }
  function at(key) { return new Date(key + "T12:00:00Z"); }
  function addDays(key, n) { var d = at(key); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function weekStart(key) { return addDays(key, -((at(key).getUTCDay() + 6) % 7)); }
  function monthShort(m) { return new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: "UTC", month: "short" }).format(at(m + "-15")).replace(".", ""); }
  function parisToday() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }

  /* the curve: drawn in a 100 × 30 box stretched to the chart's width, its lines kept thin whatever the stretch */
  function line(holder, points, o) {
    o = o || {};
    var pts = (points || []).filter(function (p) { return p && typeof p.v === "number"; });
    if (pts.length < 2) return put(holder, null);
    var label = o.label || function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(x) ? window.ds.date(x, "day") : String(x); };
    var value = o.value || num;
    var vals = pts.map(function (p) { return p.v; }), lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), span = hi - lo || 1;
    var s = svg("svg", { viewBox: "0 0 100 30", preserveAspectRatio: "none", "aria-hidden": "true", "class": "chart-line-svg" });
    [2, 28].forEach(function (y) { s.append(svg("line", { x1: "0", x2: "100", y1: String(y), y2: String(y), "class": "chart-rule", "vector-effect": "non-scaling-stroke" })); });
    s.append(svg("polyline", { "class": "chart-path", "vector-effect": "non-scaling-stroke",
      points: vals.map(function (v, i) { return (i / (vals.length - 1) * 100).toFixed(2) + "," + (28 - (v - lo) / span * 26).toFixed(2); }).join(" ") }));
    var first = pts[0], last = pts[pts.length - 1];
    var box = paint(el("div", "chart-line"), o.color), ys = el("div", "chart-line-y"), xs = el("div", "chart-line-x");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", value(first.v) + " (" + label(first.x) + ") → " + value(last.v) + " (" + label(last.x) + ")");
    box.title = box.getAttribute("aria-label");
    ys.append(el("span", "", value(hi)));
    if (hi !== lo) ys.append(el("span", "", value(lo)));
    xs.append(el("span", "", label(first.x)), el("span", "", label(last.x)));
    box.append(s, ys, xs);
    return put(holder, box);
  }

  /* a round scale of four or five steps (500, 1 000, 2 000…), its top step above the tallest bar and the average */
  function scale(max) {
    var raw = Math.max(max, 1) / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * p; }).filter(function (v) { return v >= raw; })[0];
    var top = Math.ceil(Math.max(max, 1) / step) * step, ticks = [];
    for (var t = 0; t <= top + 1e-6; t += step) ticks.push(t);
    return { top: top, ticks: ticks };
  }
  /* months must never touch: up to a year every month is named, up to two one in three, beyond only each January's year.
     The year goes with January, and with the first month unless a January follows right after it */
  function monthLabel(key, i, n) {
    var mo = +key.slice(5, 7), yr = key.slice(0, 4);
    if (n > 24) return mo === 1 ? yr : "";
    if (n > 12) return mo === 1 ? yr : (mo - 1) % 3 === 0 ? monthShort(key) : "";
    return [monthShort(key), mo === 1 || (i === 0 && mo < 11) ? " " + yr.slice(2) : ""];
  }
  function bars(holder, rows, o) {
    o = o || {};
    rows = rows || [];
    if (!rows.length) return put(holder, null);
    var n = rows.length, fig = o.short || short, unit = o.unit || "", avg = typeof o.average === "number" ? o.average : null;
    var pairs = o.pairs && o.pairs.length ? o.pairs : null, say = o.format || function (v) { return fig(v) + unit; };
    // paired, the scale is the tallest of every series
    function top(r) { return pairs ? Math.max.apply(null, pairs.map(function (q) { return r[q.key] || 0; })) : r.value || 0; }
    var sc = scale(Math.max.apply(null, rows.map(top).concat([avg || 0])));
    function pc(v) { return (Math.max(0, v) / sc.top * 100).toFixed(2) + "%"; }
    var box = paint(el("div", "chart-bars" + (n > 12 ? " is-dense" : "") + (pairs ? " is-pairs" : "")), o.color), axis = el("div", "chart-bars-axis"), grid = el("div", "chart-bars-grid"), cols = el("div", "chart-bars-cols");
    if (pairs) box.style.setProperty("--pairs", String(pairs.length));
    var labels = sc.ticks.map(function (v) { return v ? fig(v) + unit : "0"; });
    // the scale's gutter is as wide as its longest figure, in the figures' own characters
    box.style.setProperty("--axc", String(Math.max.apply(null, labels.map(function (s) { return s.length; }))));
    box.style.setProperty("--cols", String(n));
    axis.setAttribute("aria-hidden", "true");
    grid.setAttribute("aria-hidden", "true");
    sc.ticks.forEach(function (v, i) {
      var s = el("span", "", labels[i]);
      s.style.bottom = pc(v);
      axis.append(s);
      if (v) { var g = el("i"); g.style.bottom = pc(v); grid.append(g); }
    });
    box.append(axis, grid);
    if (avg != null) {
      var a = el("div", "chart-bars-avg"), ai = el("i");
      a.setAttribute("aria-hidden", "true");
      ai.style.bottom = pc(avg);
      a.append(ai);
      box.append(a);
    }
    // a column's bars side by side, one per series; their figures stacked over the tallest, in each series' colour
    function pair(area, r) {
      var high = 0, vs = el("span", "chart-bar-vs");
      pairs.forEach(function (q) {
        var v = r[q.key] || 0, fill = paint(el("span", "chart-bar-fill"), q.color), stack = el("span", "chart-bar-stack");
        // a bar of nothing still shows as a line on the base
        fill.style.height = pc(Math.max(v, sc.top / 200));
        stack.append(el("i"));
        fill.append(stack);
        area.append(fill);
        vs.append(paint(el("span", "chart-bar-v", fig(v)), q.color));
        high = Math.max(high, v);
      });
      vs.style.bottom = pc(high);
      area.append(vs);
    }
    rows.forEach(function (r, i) {
      var c = el(o.pick ? "button" : "div", "chart-bar" + (r.key === o.selected ? " is-on" : "") + (r.live ? " is-live" : "") + ((n - 1 - i) % 2 ? " is-alt" : ""));
      var area = el("span", "chart-bar-area");
      if (pairs) pair(area, r);
      else {
        var fill = el("span", "chart-bar-fill"), stack = el("span", "chart-bar-stack");
        // a bar of nothing still shows as a line on the base
        fill.style.height = pc(Math.max(r.value || 0, sc.top / 200));
        var parts = r.parts && r.parts.length ? r.parts : [{ value: r.value || 0 }], whole = parts.reduce(function (s, p) { return s + (p.value > 0 ? p.value : 0); }, 0) || 1;
        parts.forEach(function (p) {
          if (!(p.value > 0) && parts.length > 1) return;
          var part = el("i");
          part.style.flex = String((p.value > 0 ? p.value : 1) / whole);
          if (p.color) part.style.backgroundColor = tone(p.color);
          stack.append(part);
        });
        fill.append(el("span", "chart-bar-v", fig(r.value || 0)), stack);
        area.append(fill);
      }
      // a month's year is its own span: a phone leaves it out, where the names would touch
      var name = r.label != null ? [String(r.label), ""] : /^\d{4}-\d{2}$/.test(r.key || "") ? [].concat(monthLabel(r.key, i, n), "").slice(0, 2) : [String(r.key), ""];
      var lab = el("span", "chart-bar-l", name[0]);
      if (name[1]) lab.append(el("span", "chart-bar-yr", name[1]));
      name = name[0] + name[1];
      c.append(area, lab);
      var figs = pairs ? pairs.map(function (q) { return q.label + " " + say(r[q.key] || 0); }).join(" · ") : fig(r.value || 0) + unit;
      c.title = r.title || (name + " · " + figs + (r.live ? " (" + words().live + ")" : ""));
      if (o.pick) {
        c.type = "button";
        c.setAttribute("aria-pressed", r.key === o.selected ? "true" : "false");
        c.addEventListener("click", function () {
          [].forEach.call(cols.children, function (x) { x.classList.toggle("is-on", x === c); x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
          o.pick(r.key);
        });
      }
      cols.append(c);
    });
    box.append(cols);
    if (pairs) {
      // the series under the bars: a colour, a name, what they add up to
      var legend = el("div", "chart-bars-legend");
      pairs.forEach(function (q) {
        var s = el("span"), sum = rows.reduce(function (t, r) { return t + (r[q.key] || 0); }, 0);
        s.append(paint(el("i", "chart-key"), q.color), q.label, el("b", "", say(sum)));
        legend.append(s);
      });
      box.append(legend);
    }
    return put(holder, box);
  }

  function heat(holder, counts, o) {
    o = o || {};
    counts = counts || {};
    var w = words(), to = o.to || parisToday(), steps = o.steps || [1, 2], weeks = o.weeks || 53, from = o.from || null;
    var title = o.title || function (key, n) { return window.ds.date(key, "day") + " · " + n; };
    var lastWeek = weekStart(to), blocks = Math.max(1, Math.ceil(weeks / 53)), box = paint(el("div", "chart-heat"), o.color), scroll = el("div", "chart-heat-scroll");
    // always whole years of 53 weeks, so that the squares keep their size; a longer span stacks them, the latest first
    for (var b = 0; b < blocks; b++) {
      var year = el("div", "chart-heat-year"), dow = el("div", "chart-heat-dow"), main = el("div", "chart-heat-main");
      var mos = el("div", "chart-heat-months"), days = el("div", "chart-heat-days"), below = o.below ? el("div", "chart-heat-below") : null;
      ["", 1, "", 3, "", 5, "", 7].forEach(function (d) {
        dow.append(el("span", "", d ? new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: "UTC", weekday: "short" }).format(at(addDays("2026-11-08", d))).replace(".", "") : ""));
      });
      if (below) dow.append(el("span"));
      for (var k = 52; k >= 0; k--) {
        var ws = addDays(lastWeek, -7 * (k + 53 * b)), lab = "";
        // a month is named over the week that holds its first day
        for (var j = 0; j < 7; j++) { var dj = addDays(ws, j); if (dj.slice(8) === "01") lab = monthShort(dj.slice(0, 7)) + (dj.slice(5, 7) === "01" ? " " + dj.slice(2, 4) : ""); }
        mos.append(el("span", "", lab));
        // what the week brought: a figure, or {text, title} for a word on hover
        if (below) {
          var g = from && addDays(ws, 6) < from ? null : o.below(ws), gs = el("span", "", g == null ? "" : String(g && typeof g === "object" ? g.text : g));
          if (g && typeof g === "object" && g.title) gs.title = g.title;
          below.append(gs);
        }
        for (var i = 0; i < 7; i++) {
          var day = addDays(ws, i), c = day > to ? 0 : counts[day] || 0;
          var sq = el("i", "heat-day" + (c >= steps[1] ? " is-2" : c >= steps[0] ? " is-1" : "") + (day > to ? " is-future" : "") + (from && day < from ? " is-out" : ""));
          sq.dataset.day = day;
          if (day <= to) sq.title = title(day, c);
          days.append(sq);
        }
      }
      main.append(mos, days);
      if (below) { main.append(below); year.classList.add("has-below"); }
      year.append(dow, main);
      scroll.append(year);
    }
    var lg = o.legend || [w.none, w.one, w.many(steps[1])], legend = el("div", "chart-heat-legend");
    ["", "is-1", "is-2"].forEach(function (cls, i) { var s = el("span"), k = el("i", "heat-day " + cls); s.append(k, lg[i]); legend.append(s); });
    if (o.note) legend.append(el("span", "chart-heat-note", o.note));
    box.append(scroll, legend);
    // opened on the latest weeks when the year is wider than the screen
    requestAnimationFrame(function () { scroll.scrollLeft = scroll.scrollWidth; });
    return put(holder, box);
  }

  function spark(holder, values, o) {
    o = o || {};
    values = values || [];
    var top = o.top || Math.max.apply(null, values.concat([1])), box = paint(el("span", "chart-spark"), o.color);
    box.setAttribute("aria-hidden", "true");
    values.forEach(function (v) {
      var b = el("i");
      // the smallest still shows
      b.style.height = Math.max(8, Math.round(v / top * 100)) + "%";
      b.title = o.title ? o.title(v) : num(v);
      box.append(b);
    });
    return put(holder, box);
  }

  function split(holder, parts, o) {
    o = o || {};
    var format = o.format || num, all = (parts || []).filter(function (p) { return p.value > 0; }), total = all.reduce(function (s, p) { return s + p.value; }, 0);
    if (!total) return put(holder, null);
    var box = el("div", "chart-split"), bar = el("div", "chart-split-bar"), legend = el("div", "chart-split-legend");
    all.forEach(function (p) {
      var share = p.value / total, piece = el("i"), key = el("span"), dot = paint(el("i", "chart-key"), p.color);
      piece.style.width = (share * 100).toFixed(2) + "%";
      if (p.color) piece.style.background = tone(p.color);
      piece.title = p.label + " · " + format(p.value);
      bar.append(piece);
      key.append(dot, p.label, el("b", "", format(p.value)), el("em", "", Math.round(share * 100) + "%"));
      legend.append(key);
    });
    box.append(bar, legend);
    return put(holder, box);
  }

  /* the donut, taken from Bank's spending: a ring drawn in a 200 × 200 box from the top, clockwise, a hair of room between
     its slices; a figure in its hole, the legend beside it */
  function donut(holder, rows, o) {
    o = o || {};
    var format = o.format || num, all = (rows || []).filter(function (x) { return x && x.value > 0; });
    var total = all.reduce(function (s, x) { return s + x.value; }, 0);
    if (!total) return put(holder, null);
    var R = 90, r = 60, gap = all.length > 1 ? 0.02 : 0, angle = -Math.PI / 2;
    var box = el("div", "chart-donut" + (o.pick ? " is-pick" : "")), ring = el("div", "chart-donut-ring"), legend = el("ul", "chart-donut-legend");
    var s = svg("svg", { viewBox: "0 0 200 200", "class": "chart-donut-svg" }), mid = el("div", "chart-donut-c"), big = el("b"), word = el("small");
    var c = o.center == null ? {} : typeof o.center === "object" ? o.center : { label: String(o.center) };
    var keys = all.map(function (x) { return String(x.key != null ? x.key : x.label); }), on = o.selected == null ? null : String(o.selected);
    var slices = [], items = [], told = [];
    function pt(a, rad) { return (100 + rad * Math.cos(a)).toFixed(2) + " " + (100 + rad * Math.sin(a)).toFixed(2); }
    all.forEach(function (x, i) {
      var sweep = x.value / total * Math.PI * 2, a0 = angle + gap / 2, a1 = all.length > 1 ? angle + sweep - gap / 2 : angle + Math.PI * 2 - 0.0001;
      // the smallest share still shows as a sliver
      if (a1 - a0 < 0.004) a1 = a0 + 0.004;
      var arc = a1 - a0 > Math.PI ? 1 : 0, half = angle + sweep / 2, pct = Math.round(x.value / total * 100);
      angle += sweep;
      var said = x.label + " · " + format(x.value) + " · " + pct + "%";
      told.push(said);
      var path = paint(svg("path", { "class": "chart-donut-slice",
        d: "M " + pt(a0, R) + " A " + R + " " + R + " 0 " + arc + " 1 " + pt(a1, R) + " L " + pt(a1, r) + " A " + r + " " + r + " 0 " + arc + " 0 " + pt(a0, r) + " Z" }), x.color);
      // chosen or under the pointer, a slice moves out a little along its middle
      path.style.setProperty("--dx", (Math.cos(half) * 5).toFixed(2));
      path.style.setProperty("--dy", (Math.sin(half) * 5).toFixed(2));
      var tip = svg("title");
      tip.textContent = said;
      path.append(tip);
      s.append(path);
      slices.push(path);
      var li = el("li"), row = el(o.pick ? "button" : "div", "chart-donut-row");
      row.append(paint(el("i", "chart-key"), x.color), el("span", "chart-donut-l", x.label), el("em", "", pct + "%"), el("b", "", format(x.value)));
      li.append(row);
      legend.append(li);
      items.push(row);
      if (!o.pick) return;
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", said);
      path.addEventListener("click", function () { choose(i, true); });
      // the slices are one stop of the keyboard: the arrows go round the ring, Enter or Space takes one
      path.addEventListener("keydown", function (e) {
        var n = slices.length, to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
        if (to != null) { e.preventDefault(); rove((to + n) % n, true); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(i, true); }
      });
      row.type = "button";
      row.addEventListener("click", function () { choose(i, true); });
    });
    if (o.pick) s.setAttribute("role", "group");
    else {
      s.setAttribute("role", "img");
      s.setAttribute("aria-label", told.join(", "));
    }
    function rove(i, focus) {
      if (!o.pick) return;
      slices.forEach(function (p, k) { p.setAttribute("tabindex", k === i ? "0" : "-1"); });
      if (focus) slices[i].focus();
    }
    // a tap chooses a slice, another tap on it lets it go; the hole says the chosen one, else the total
    function choose(i, user) {
      var k = i == null ? null : keys[i];
      if (user) on = on === k ? null : k;
      var at = on == null ? -1 : keys.indexOf(on);
      box.classList.toggle("has-on", at >= 0);
      slices.forEach(function (p, j) { p.classList.toggle("is-on", j === at); if (o.pick) p.setAttribute("aria-pressed", j === at ? "true" : "false"); });
      items.forEach(function (b, j) { b.classList.toggle("is-on", j === at); if (o.pick) b.setAttribute("aria-pressed", j === at ? "true" : "false"); });
      big.textContent = at >= 0 ? format(all[at].value) : c.value != null ? String(c.value) : format(total);
      word.textContent = at >= 0 ? all[at].label : c.label || "";
      word.hidden = !word.textContent;
      if (user) { rove(i, false); o.pick(on); }
    }
    mid.setAttribute("aria-live", "polite");
    mid.append(big, word);
    ring.append(s, mid);
    box.append(ring, legend);
    choose(null, false);
    rove(Math.max(0, on == null ? 0 : keys.indexOf(on)), false);
    return put(holder, box);
  }

  window.ds = window.ds || {};
  window.ds.chart = { line: line, bars: bars, heat: heat, spark: spark, split: split, donut: donut };
})();
/* Figures read at a glance, taken from Studio's analysis; each builder returns an element for the page to place.
   ds.rank(rows, {title, note, empty, plain}): a ranking, one row per name: its place (the first three in gold), the name
     (a link with href) and a grey line under it (sub), and on the right its value (a text, or a node such as a verdict);
     with share (0 to 1, against the first) a thin bar under the name. plain leaves the places out. Rankings side by side
     go in <div class="ranks">.
   ds.minitiles(items): small tiles of reference figures at the top of a card. items: [{label, value, unit, note}].
   ds.verdict(ratio, {words, high, low}): a judgement of a figure against the usual one: « ×1,4 », green from high (1.2),
     yellow from low (0.8), red under it; with words, « fort », « moyen » or « faible » under it. null keeps its room.
   ds.periodPick(options, current, pick, {label}): a period selector: buttons on a computer, a list on a phone (768px and
     less). options: [[value, label]]; pick(value) is called with the chosen one, the selector lights it itself. */
(function () {
  "use strict";
  var WORDS = {
    fr: { strong: "fort", average: "moyen", weak: "faible", against: "par rapport à la médiane", period: "Période", empty: "Rien sur cette période." },
    en: { strong: "strong", average: "average", weak: "weak", against: "against the median", period: "Period", empty: "Nothing over this period." }
  };
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }
  function words() { return english() ? WORDS.en : WORDS.fr; }
  function el(name, cls, kids) {
    var e = document.createElement(name);
    if (cls) e.className = cls;
    [].concat(kids == null ? [] : kids).forEach(function (k) { if (k != null) e.append(k); });
    return e;
  }
  function safe(u) { return typeof u === "string" && /^(https?:\/\/|\/|#)[^\s"'<>]*$/.test(u) ? u : null; }

  function rank(rows, o) {
    o = o || {};
    var col = el("div", "rank-col"), head = el("p", "rank-head", o.title || "");
    if (o.note) head.append(el("span", "rank-note", o.note));
    col.append(head);
    if (!rows || !rows.length) { col.append(el("p", "empty", o.empty || words().empty)); return col; }
    var list = el("ol", "rank" + (o.plain ? " is-plain" : ""));
    rows.forEach(function (r, i) {
      var li = el("li", i < 3 ? "is-top" : ""), name = el("div", "rank-name"), href = safe(r.href);
      var t = typeof r.name === "string" || r.name == null ? el(href ? "a" : "span", "rank-t", r.name || "") : el("span", "rank-t", r.name);
      if (href) { t.href = href; if (/^https?:/.test(href)) { t.target = "_blank"; t.rel = "noopener"; } }
      name.append(t);
      if (r.sub != null) name.append(el("small", "", r.sub));
      if (typeof r.share === "number") {
        var bar = el("i", "rank-bar");
        bar.style.setProperty("--share", Math.max(0, Math.min(1, r.share)).toFixed(3));
        bar.setAttribute("aria-hidden", "true");
        name.append(bar);
      }
      if (!o.plain) li.append(el("span", "rank-n", String(i + 1)));
      li.append(name);
      if (r.value != null) li.append(typeof r.value === "string" || typeof r.value === "number" ? el("span", "rank-v", String(r.value)) : r.value);
      list.append(li);
    });
    col.append(list);
    return col;
  }

  function minitiles(items) {
    var box = el("div", "minitiles");
    (items || []).filter(Boolean).forEach(function (x) {
      box.append(el("div", "minitile", [el("small", "", x.label), el("div", "", [el("b", "", x.value), x.unit != null ? el("span", "", x.unit) : null]),
        x.note ? el("em", "", x.note) : null]));
    });
    return box;
  }

  function verdict(ratio, o) {
    o = o || {};
    var w = words(), high = o.high || 1.2, low = o.low || 0.8;
    if (ratio == null || isNaN(ratio)) return el("span", "verdict is-none" + (o.words ? " is-tall" : ""));
    var level = ratio >= high ? "good" : ratio >= low ? "mid" : "weak";
    var v = el("span", "verdict is-" + level + (o.words ? " is-tall" : ""), "×" + window.ds.number(Math.round(ratio * 10) / 10, Math.round(ratio * 10) % 10 ? 1 : 0));
    v.title = w.against;
    // short words of the same length, so that every verdict reads the same
    if (o.words) v.append(el("small", "", level === "good" ? w.strong : level === "mid" ? w.average : w.weak));
    return v;
  }

  function periodPick(options, current, pick, o) {
    o = o || {};
    var label = o.label || words().period, box = el("span", "periodpick"), group = el("div", "tabs"), list = el("select", "periodpick-list");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    list.setAttribute("aria-label", label);
    function light(v) {
      [].forEach.call(group.children, function (b) { b.setAttribute("aria-pressed", b.dataset.value === String(v) ? "true" : "false"); });
      list.value = String(v);
    }
    function choose(v) {
      var opt = options.filter(function (x) { return String(x[0]) === String(v); })[0];
      if (!opt) return;
      light(opt[0]);
      if (pick) pick(opt[0]);
    }
    options.forEach(function (x) {
      var b = el("button", "", x[1]), op = el("option", "", x[1]);
      b.type = "button";
      b.dataset.value = String(x[0]);
      b.addEventListener("click", function () { choose(x[0]); });
      op.value = String(x[0]);
      group.append(b);
      list.append(op);
    });
    list.addEventListener("change", function () { choose(list.value); });
    light(current);
    box.append(group, list);
    return box;
  }

  window.ds = window.ds || {};
  window.ds.rank = rank;
  window.ds.minitiles = minitiles;
  window.ds.verdict = verdict;
  window.ds.periodPick = periodPick;
})();
/* Keeping up with the server, taken from Studio.
   ds.keep: a copy of the last data kept on the device (IndexedDB has room for all of it), so that a page opens at once on
     it, then refreshes. ds.keep.get(key), put(key, value) and del(key) answer with promises that never fail: where the
     device keeps nothing (IndexedDB missing, refused, or not answering within 3 s, as in some private windows), get
     answers null and put false, and the page simply waits for the server, as on a first visit. ds.keep.ok() says
     whether copies are kept. ds.keep.open(name) is a store of its own (a database name; "ds" for ds.keep itself).
     ds.keep.fresh(key, load, draw): draws the copy at once if there is one, draw(value, {copy: true, at}), unless the
     server answers first; then draws what load() answers, draw(value, {copy: false}), and keeps it.
   ds.stream(url, events, {open, poll, every, retry}): follows the server live through its event stream (EventSource):
     events {name: function (data)} receive each named event, its data read as JSON when it is. A dropped stream comes
     back by itself; one the server closed (it was restarting) is opened again after retry ms (2 s, doubling up to a
     minute), and at once when the page is seen again (a phone closes it in the background). open() is called at each
     connection, to catch up on what was missed; poll(), if given, every `every` ms (5 min) while the page is seen, as a
     backup, or instead of the stream where the browser has none. Returns {close(), source()}.
   ds.version(button, {mine, text}): the « new version » light on a page's reload button (.newver): seen(v) lights it when
     the server says a version other than this page's own (mine, or <meta name="version">); the button reloads the page. */
(function () {
  "use strict";
  var WORDS = {
    fr: { reload: "Recharger la page", newer: "Nouvelle version du site : recharger la page" },
    en: { reload: "Reload the page", newer: "A new version is on line: reload the page" }
  };
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }
  function words() { return english() ? WORDS.en : WORDS.fr; }

  var stores = {};
  function open(name) {
    if (stores[name]) return stores[name];
    var db = null;
    function base() {
      if (!db) db = new Promise(function (res, rej) {
        // a browser that neither opens nor refuses (some private windows) is taken as one that keeps nothing
        var late = setTimeout(function () { rej(new Error("timeout")); }, 3000);
        try {
          var r = indexedDB.open(name, 1);
          r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
          r.onsuccess = function () { clearTimeout(late); res(r.result); };
          r.onerror = r.onblocked = function () { clearTimeout(late); rej(r.error || new Error("blocked")); };
        } catch (e) { clearTimeout(late); rej(e); }
      });
      return db;
    }
    // one transaction, answered once it is written (or read): its request, or a refusal
    function ask(mode, run) {
      return base().then(function (d) {
        return new Promise(function (res, rej) {
          try {
            var tx = d.transaction("kv", mode), req = run(tx.objectStore("kv"));
            tx.oncomplete = function () { res(req); };
            tx.onerror = tx.onabort = function () { rej(tx.error); };
          } catch (e) { rej(e); }
        });
      });
    }
    var s = stores[name] = {
      get: function (key) { return ask("readonly", function (st) { return st.get(key); }).then(function (req) { return req.result === undefined ? null : req.result; }, function () { return null; }); },
      // a full device (its quota reached) or a value that cannot be kept answers false too: the page keeps working on
      // what the server sends
      put: function (key, value) { return ask("readwrite", function (st) { return st.put(value, key); }).then(function () { return true; }, function () { return false; }); },
      del: function (key) { return ask("readwrite", function (st) { return st.delete(key); }).then(function () { return true; }, function () { return false; }); },
      ok: function () { return base().then(function () { return true; }, function () { return false; }); },
      fresh: function (key, load, draw) {
        var served = false;
        var copy = s.get(key).then(function (c) {
          if (c && !served && c.at != null) draw(c.value, { copy: true, at: c.at });
        });
        return Promise.resolve().then(load).then(function (value) {
          served = true;
          draw(value, { copy: false });
          return s.put(key, { at: Date.now(), value: value }).then(function () { return value; });
        }, function (e) { return copy.then(function () { throw e; }); });
      }
    };
    return s;
  }
  var keep = open("ds");
  keep.open = open;

  function stream(url, events, o) {
    o = o || {};
    events = events || {};
    var src = null, wait = o.retry || 2000, timer = null, closed = false;
    function connect() {
      clearTimeout(timer);
      if (closed || !window.EventSource) return;
      if (src) src.close();
      src = new EventSource(url);
      src.onopen = function () { wait = o.retry || 2000; if (o.open) o.open(); };
      src.onerror = function () {
        // EventSource tries again by itself while it is CONNECTING; CLOSED means the server refused it (a restart)
        if (src.readyState !== 2 || closed) return;
        clearTimeout(timer);
        timer = setTimeout(connect, wait);
        wait = Math.min(wait * 2, 60000);
      };
      Object.keys(events).forEach(function (name) {
        src.addEventListener(name, function (e) {
          var data = e.data;
          try { data = JSON.parse(e.data); } catch (x) {}
          events[name](data, e);
        });
      });
    }
    function seen() { return document.visibilityState === "visible"; }
    document.addEventListener("visibilitychange", function () {
      if (seen() && src && src.readyState === 2 && !closed) connect();
    });
    var every = null;
    if (o.poll) every = setInterval(function () { if (seen() && !closed) o.poll(); }, o.every || 300000);
    connect();
    return {
      close: function () { closed = true; clearTimeout(timer); clearInterval(every); if (src) src.close(); },
      source: function () { return src; }
    };
  }

  function version(button, o) {
    o = o || {};
    var meta = document.querySelector('meta[name="version"]'), mine = o.mine || (meta && meta.content) || null, w = words();
    if (!button.querySelector(".newver-pip")) {
      var pip = document.createElement("i");
      pip.className = "newver-pip";
      pip.setAttribute("aria-hidden", "true");
      button.appendChild(pip);
    }
    button.classList.add("newver");
    if (!button.getAttribute("aria-label")) button.setAttribute("aria-label", w.reload);
    if (!button.title) button.title = w.reload;
    button.addEventListener("click", function () { location.reload(); });
    var light = {
      on: false,
      seen: function (v) {
        if (!v || !mine || String(v) === String(mine) || light.on) return light.on;
        light.on = true;
        button.classList.add("is-on");
        button.title = o.text || w.newer;
        button.setAttribute("aria-label", o.text || w.newer);
        return true;
      }
    };
    return light;
  }

  window.ds = window.ds || {};
  window.ds.keep = keep;
  window.ds.stream = stream;
  window.ds.version = version;
})();
/* ds.viewer(items, {start, onChange, onClose, label, el, from}): the photo viewer of src/viewer.css, opened on
   items[start]. An item is {src, srcset, sizes, alt, caption, thumb, el}, a plain address, or a function that returns one
   (or a promise of one), called when the photo is first needed: Selecta asks its server for a signed address then.
   thumb is shown, blurred, while the photo loads; el is the page's element for that photo (a grid's link), where the
   focus goes back on closing.
   The cross, a click beside the photo (the veil), Escape or a finger pulled down close it; the arrows, ← → and a finger
   swiped sideways turn the photos, round and round; « 3 / 24 » says where one is; the two neighbours load ahead; the
   spinner turns while a photo loads. Opening moves the focus into it, Tab stays in it, closing gives the focus back to
   what opened it (or to the photo one ended on); the page behind does not scroll meanwhile (viewer-behaviour.css).
   It drives the page's own .viewer when there is one (opts.el, or a .viewer at the top of <body>: Selecta's, with its
   bar under the photo) and adds the parts it lacks; otherwise it builds one. onChange(index, item, viewer) tells each
   photo shown, onClose(index, viewer) the closing. Returns {el, index, isOpen, go(i), next(), prev(), close()}.
   ds.viewer.bind(container, {item, label, onChange, onClose}): a grid of links (item, "a[href]" by default) opens the
   viewer on a click, each link's href as its photo (data-srcset, data-sizes and data-caption for more, its image as
   thumb and alt). The markup <div data-viewer> does the same with no code at all; data-viewer="selector" names the
   items, data-viewer-label the viewer. Nothing here is written inline, so a page served with script-src 'self' works. */
(function () {
  "use strict";
  var WORDS = {
    fr: { label: "Photos", close: "Fermer", prev: "Photo précédente", next: "Photo suivante", failed: "Cette photo n’a pas pu s’ouvrir." },
    en: { label: "Photos", close: "Close", prev: "Previous photo", next: "Next photo", failed: "This photo could not be opened." }
  };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  // how far a finger travels to turn the photo, and to close the viewer when pulled down (the site's 50px)
  var SWIPE = 50, DROP = 90, START = 8;
  var open = null;
  function reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function make(name, cls, parent) {
    var x = document.createElement(name);
    x.className = cls;
    if (parent) parent.appendChild(x);
    return x;
  }
  function button(el, cls, label) {
    var b = el.querySelector("." + cls);
    if (!b) { b = make("button", "viewer-btn " + cls, el); b.type = "button"; }
    if (!b.hasAttribute("aria-label")) b.setAttribute("aria-label", label);
    return b;
  }

  // the parts the viewer needs, taken from its markup or added: veil, stage and photo, spinner, count, the three buttons
  function setup(el) {
    if (el._dsViewer) return el._dsViewer;
    var w = words(), veil = el.querySelector(".viewer-veil"), stage = el.querySelector(".viewer-stage");
    if (!veil) { veil = make("div", "viewer-veil"); el.insertBefore(veil, el.firstChild); }
    if (!stage) { stage = make("div", "viewer-stage"); el.insertBefore(stage, veil.nextSibling); }
    var img = stage.querySelector("img") || make("img", "", stage);
    img.draggable = false;
    img.decoding = "async";
    var spin = stage.querySelector(".spinner") || make("span", "spinner is-medium on-photo", stage);
    spin.setAttribute("aria-hidden", "true");
    // in the stage, the count sits over the photo's foot, above an app's bar when there is one
    var count = el.querySelector(".viewer-count") || make("div", "viewer-count", stage);
    count.setAttribute("aria-live", "polite");
    var c = { el: el, veil: veil, stage: stage, img: img, spin: spin, count: count, items: [], at: 0, opts: {}, token: 0, cache: {}, keep: [], before: null, isOpen: false,
      close: button(el, "viewer-close", w.close), prev: button(el, "viewer-prev", w.prev), next: button(el, "viewer-next", w.next) };
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.tabIndex = -1;
    el.hidden = true;
    c.handle = { el: el, index: 0, isOpen: false,
      go: function (i) { show(c, i); return c.handle; },
      next: function () { show(c, c.at + 1); return c.handle; },
      prev: function () { show(c, c.at - 1); return c.handle; },
      close: function () { shut(c); return c.handle; } };
    el._dsViewer = c;
    el.addEventListener("click", function (e) {
      if (!c.isOpen) return;
      var t = e.target;
      if (t.closest(".viewer-close")) shut(c);
      else if (t.closest(".viewer-prev")) show(c, c.at - 1);
      else if (t.closest(".viewer-next")) show(c, c.at + 1);
      // the stage covers the veil around the photo: a click there is a click on the veil
      else if (t === c.veil || t === c.stage) shut(c);
    });
    swipes(c);
    return c;
  }

  // an item, asked once per opening (a function may ask a server), as {src, …}
  function item(c, i) {
    if (!c.cache[i]) {
      // in a promise from the start, so that a function that throws is a photo that failed, not a viewer that stops
      var x = c.items[i], p = new Promise(function (ok) { ok(typeof x === "function" ? x(i) : x); }).then(function (it) {
        if (typeof it === "string") it = { src: it };
        if (!it || !it.src) throw new Error("no photo");
        return it;
      });
      c.cache[i] = p;
      // a refusal is asked again next time
      p.catch(function () { if (c.cache[i] === p) delete c.cache[i]; });
    }
    return c.cache[i];
  }
  function fill(img, it) {
    if (it.srcset) { img.sizes = it.sizes || "100vw"; img.srcset = it.srcset; } else img.removeAttribute("srcset");
    img.src = it.src;
  }
  function fetchPhoto(it) {
    return new Promise(function (ok, ko) {
      var im = new Image();
      im.onload = function () { ok(im); };
      im.onerror = ko;
      fill(im, it);
    });
  }
  // the neighbours load ahead, so that turning to them shows them at once
  function ahead(c, j) {
    var n = c.items.length;
    j = ((j % n) + n) % n;
    item(c, j).then(function (it) {
      var im = new Image();
      fill(im, it);
      c.keep = c.keep.slice(-3).concat(im);
    }).catch(function () {});
  }
  function caption(c, text) {
    var cap = c.el.querySelector(".viewer-caption");
    // once a photo of this opening has a caption, its line stays for all, even empty, so that the photos keep their
    // size from one to the next
    if (text) c.captioned = true;
    if (!cap && !c.captioned) return;
    if (!cap) {
      var bar = c.el.querySelector(".viewer-bar");
      if (!bar) { bar = make("div", "viewer-bar", c.el); bar._dsOwn = true; }
      cap = make("p", "viewer-caption", bar);
    }
    cap.textContent = text;
    cap.hidden = !c.captioned;
    // a bar of ds's own goes with its captions; an app's bar stays
    if (cap.parentNode._dsOwn) cap.parentNode.hidden = !c.captioned;
  }
  // what an item says before it is asked for: a function's item says it once it comes
  function known(x) { return x && typeof x === "object" ? x : {}; }

  function show(c, i) {
    var n = c.items.length;
    if (!n || !c.isOpen) return;
    i = ((i % n) + n) % n;
    c.at = c.handle.index = i;
    c.prev.hidden = c.next.hidden = c.count.hidden = n < 2;
    c.count.textContent = (i + 1) + " / " + n;
    var token = ++c.token, img = c.img;
    img.classList.add("is-loading");
    img.classList.remove("is-placeholder");
    c.spin.hidden = false;
    // the caption changes with the count, not a moment later
    caption(c, known(c.items[i]).caption || "");
    function done() {
      if (token !== c.token) return;
      img.classList.remove("is-loading", "is-placeholder");
      c.spin.hidden = true;
    }
    item(c, i).then(function (it) {
      if (token !== c.token) return;
      img.alt = it.alt || it.caption || "";
      caption(c, it.caption || "");
      if (it.thumb) {
        img.removeAttribute("srcset");
        img.src = it.thumb;
        img.classList.add("is-placeholder");
        img.classList.remove("is-loading");
      }
      return fetchPhoto(it).then(function () {
        if (token !== c.token) return;
        fill(img, it);
        // shown once decoded, so that the photo never blinks white or half drawn
        if (img.decode) img.decode().then(done, done); else done();
      });
    }).catch(function () {
      if (token !== c.token) return;
      done();
      if (window.ds && window.ds.toast) window.ds.toast({ type: "bad", text: words().failed });
    });
    if (n > 1) ahead(c, i + 1);
    if (n > 2) ahead(c, i - 1);
    if (c.opts.onChange) c.opts.onChange(i, c.items[i], c.handle);
  }

  function shut(c) {
    if (!c.isOpen) return;
    c.isOpen = c.handle.isOpen = false;
    if (open === c) open = null;
    c.token++;
    c.el.hidden = true;
    c.el.classList.remove("is-open", "is-dragging");
    // the last photo must not flash on the next opening
    c.img.removeAttribute("srcset");
    c.img.removeAttribute("src");
    c.img.style.transform = "";
    c.veil.style.opacity = "";
    var it = c.items[c.at], own = it && it.el && it.el.isConnected ? it.el : null, back = own || c.before;
    c.before = null;
    if (back && back.focus && back.isConnected) {
      back.focus({ preventScroll: true });
      // the photo one ended on comes into sight in its grid
      if (own && own.scrollIntoView) own.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
    }
    if (c.opts.onClose) c.opts.onClose(c.at, c.handle);
  }

  // a finger: sideways turns the photo, down closes; the photo follows it meanwhile. Two fingers zoom, as the browser does.
  function swipes(c) {
    var t = null, el = c.el;
    function reset() {
      t = null;
      el.classList.remove("is-dragging");
      c.img.style.transform = "";
      c.veil.style.opacity = "";
    }
    el.addEventListener("touchstart", function (e) {
      t = null;
      if (!c.isOpen || e.touches.length !== 1 || e.target.closest(".viewer-bar, .viewer-btn")) return;
      // zoomed in, a finger moves around the photo instead
      if (window.visualViewport && window.visualViewport.scale > 1.01) return;
      t = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, dy: 0, axis: "" };
    }, { passive: true });
    el.addEventListener("touchmove", function (e) {
      if (!t) return;
      if (e.touches.length !== 1) { reset(); return; }
      var dx = e.touches[0].clientX - t.x, dy = e.touches[0].clientY - t.y;
      if (!t.axis) {
        if (Math.abs(dx) < START && Math.abs(dy) < START) return;
        t.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        el.classList.add("is-dragging");
      }
      t.dx = dx;
      t.dy = dy;
      if (t.axis === "x") { c.img.style.transform = "translateX(" + dx + "px)"; return; }
      var down = Math.max(0, dy);
      c.img.style.transform = "translateY(" + down + "px)";
      c.veil.style.opacity = String(Math.max(0.35, 1 - down / Math.max(1, el.clientHeight) * 1.6));
    }, { passive: true });
    el.addEventListener("touchend", function () {
      if (!t) return;
      var s = t;
      reset();
      if (s.axis === "x" && Math.abs(s.dx) > SWIPE && c.items.length > 1) show(c, c.at + (s.dx < 0 ? 1 : -1));
      else if (s.axis === "y" && s.dy > DROP) shut(c);
    });
    el.addEventListener("touchcancel", reset);
  }

  function viewer(items, opts) {
    opts = opts || {};
    var el = opts.el ? (typeof opts.el === "string" ? document.querySelector(opts.el) : opts.el) : document.querySelector("body > .viewer");
    if (!el) { el = make("div", "viewer", document.body); el.hidden = true; el._dsBuilt = true; }
    var c = setup(el);
    if (open && open !== c) shut(open);
    c.items = [].slice.call(items || []);
    c.opts = opts;
    c.cache = {};
    c.captioned = c.items.some(function (x) { return !!known(x).caption; });
    if (!c.items.length) return c.handle;
    var from = opts.from || document.activeElement;
    if (!c.isOpen) c.before = from;
    // a viewer ds built takes the theme of what opened it (the showcase has one per column); an app's has its page's
    if (el._dsBuilt) {
      var th = from && from.closest ? from.closest("[data-theme]") : null;
      if (th && th !== document.documentElement) el.setAttribute("data-theme", th.getAttribute("data-theme"));
      else el.removeAttribute("data-theme");
    }
    el.setAttribute("aria-label", opts.label || words().label);
    if (!c.isOpen) {
      c.isOpen = c.handle.isOpen = true;
      open = c;
      el.hidden = false;
      el.classList.add("is-open");
    }
    show(c, opts.start || 0);
    el.focus({ preventScroll: true });
    return c.handle;
  }

  // on <html> and before the page's own keys: Escape closes the viewer only, and a window of ds.confirm over it
  // (which listens on the document, earlier still) keeps its own
  document.documentElement.addEventListener("keydown", function (e) {
    var c = open;
    if (!c || e.defaultPrevented || document.querySelector(".dialog-veil")) return;
    if (e.key === "Escape") { e.preventDefault(); shut(c); return; }
    // in a field of the app's bar (Selecta's note), the keys belong to the field
    if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (c.items.length > 1) { e.preventDefault(); show(c, c.at + (e.key === "ArrowRight" ? 1 : -1)); }
      return;
    }
    if (e.key !== "Tab") return;
    // Tab goes round inside the viewer
    var list = [].filter.call(c.el.querySelectorAll(FOCUSABLE), function (x) { return x.getClientRects().length > 0; });
    var at = document.activeElement, first = list[0], last = list[list.length - 1];
    if (!list.length) { e.preventDefault(); return; }
    if (!c.el.contains(at)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && (at === first || at === c.el)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  }, true);

  // a link of a grid as an item
  function linkItem(a) {
    var im = a.querySelector("img");
    return { src: a.getAttribute("data-src") || a.href || (im && (im.currentSrc || im.src)) || "",
      srcset: a.getAttribute("data-srcset") || "", sizes: a.getAttribute("data-sizes") || "",
      alt: (im && im.getAttribute("alt")) || a.getAttribute("aria-label") || "", caption: a.getAttribute("data-caption") || "",
      thumb: im ? im.currentSrc || im.src : "", el: a };
  }
  function clicker(box, o) {
    return function (e) {
      // a click with a key held, or the middle button, still opens the photo in a new tab
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var sel = o.item || "a[href]", a = e.target.closest ? e.target.closest(sel) : null;
      if (!a || !box.contains(a)) return;
      // the photos one can see: those a filter hides are skipped
      var all = [].filter.call(box.querySelectorAll(sel), function (x) { return x.getClientRects().length > 0; }), at = all.indexOf(a);
      if (at < 0) return;
      e.preventDefault();
      viewer(all.map(linkItem), { start: at, from: a, label: o.label, onChange: o.onChange, onClose: o.onClose, el: o.el });
    };
  }
  function bind(box, o) {
    if (typeof box === "string") box = document.querySelector(box);
    if (!box) return null;
    var fn = clicker(box, o || {});
    box._dsViewerBound = true;
    box.addEventListener("click", fn);
    return { unbind: function () { box.removeEventListener("click", fn); box._dsViewerBound = false; } };
  }
  document.addEventListener("click", function (e) {
    var box = e.target.closest ? e.target.closest("[data-viewer]") : null;
    if (!box || box._dsViewerBound) return;
    clicker(box, { item: box.getAttribute("data-viewer") || "", label: box.getAttribute("data-viewer-label") || "" })(e);
  });

  viewer.bind = bind;
  viewer.close = function () { if (open) shut(open); };
  window.ds = window.ds || {};
  window.ds.viewer = viewer;
})();
/* ds.photogrid(grid, {sizes, size, key, slider, masonry}): the photo grid of src/photogrid.css, Selecta's masonry made
   generic. Each child of grid is a tile holding an image (a link, a figure…); the tiles fall in columns of even height,
   each one into the shortest column, as tall as its photo's shape: the <img>'s width and height, or its own size once
   loaded (the grid lays itself out again then). It follows the grid's width, tiles added, removed or hidden, and a class
   set on the grid (a filter); after any other change, layout() lays it out again.
   sizes: the widths a column may have, in px ([140, 190, 240, 300]); size: the one to start with (190); key: the device
   remembers the size chosen under it; slider: an <input type="range" class="zoom-slider"> that picks among the sizes,
   from small to large, offering only those that change the grid (a phone has fewer); masonry: false for even rows,
   each photo cut to a square-ish tile. The tiles slide to their new places when the size changes, unless the device
   asks for less motion. Returns {el, size, columns, masonry, layout(), set({size, masonry})}; called again on the same
   grid, it gives the same one. */
(function () {
  "use strict";
  var WORDS = {
    fr: { size: "Taille des photos", columns: function (n) { return n + (n > 1 ? " colonnes" : " colonne"); } },
    en: { size: "Photo size", columns: function (n) { return n + (n > 1 ? " columns" : " column"); } }
  };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  function reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  // a duration token as milliseconds: ".3s", "400ms"
  function ms(text) {
    var v = parseFloat(text);
    if (isNaN(v)) return 300;
    return /ms\s*$/.test(text) ? v : v * 1000;
  }
  function clear(t) { ["left", "top", "width", "height"].forEach(function (p) { t.style.removeProperty(p); }); }

  function photogrid(grid, o) {
    if (typeof grid === "string") grid = document.querySelector(grid);
    if (!grid) return null;
    if (grid._dsPhotogrid) return grid._dsPhotogrid;
    o = o || {};
    var sizes = (o.sizes && o.sizes.length ? o.sizes : [140, 190, 240, 300]).map(Number).sort(function (a, b) { return a - b; });
    var slider = typeof o.slider === "string" ? document.querySelector(o.slider) : o.slider || null;
    var want = sizes.indexOf(+o.size), steps = [], lastW = -1, frame = 0;
    if (want < 0) want = Math.min(1, sizes.length - 1);
    if (o.key) { try { var kept = sizes.indexOf(+localStorage.getItem(o.key)); if (kept >= 0) want = kept; } catch (e) {} }
    var g = { el: grid, size: sizes[want], columns: 1, masonry: o.masonry !== false };
    grid._dsPhotogrid = g;
    grid.classList.add("photogrid");

    function gap() { return parseFloat(getComputedStyle(grid).columnGap) || 0; }
    function cols(px, w, s) { return Math.max(1, Math.floor((w + s) / (px + s))); }
    function tiles() { return [].filter.call(grid.children, function (t) { return !t.hidden && getComputedStyle(t).display !== "none"; }); }
    // a tile's height for its width: the <img>'s width and height say it before it loads; a square until then without them
    function ratio(t) {
      var im = t.tagName === "IMG" ? t : t.querySelector("img"), w = 0, h = 0;
      if (im) { w = +im.getAttribute("width"); h = +im.getAttribute("height"); }
      if (!(w && h) && im && im.naturalWidth) { w = im.naturalWidth; h = im.naturalHeight; }
      return w && h ? h / w : 1;
    }
    // the sizes the slider offers: one for each number of columns, the smallest of those that give it, so that every step
    // changes the grid (a phone, with room for two columns at most, has two)
    function stepsFor(w, s) {
      var out = [], last = 0;
      sizes.forEach(function (px, i) { var n = cols(px, w, s); if (n !== last) { out.push(i); last = n; } });
      return out;
    }
    function paint(j, n) {
      if (!slider) return;
      var top = steps.length - 1;
      slider.min = "0";
      slider.step = "1";
      slider.max = String(top);
      if (+slider.value !== j) slider.value = String(j);
      slider.disabled = top === 0;
      slider.setAttribute("aria-valuetext", words().columns(n));
    }
    function layout() {
      var w = grid.clientWidth, s = gap();
      if (!w) return g;
      lastW = w;
      steps = stepsFor(w, s);
      // the size chosen shows as the step with its number of columns (300px on a phone is 190px's single column)
      var n = cols(sizes[want], w, s), j = 0;
      while (j < steps.length - 1 && cols(sizes[steps[j]], w, s) > n) j++;
      var px = sizes[steps[j]];
      g.size = px;
      g.columns = n;
      grid.style.setProperty("--tile", px + "px");
      paint(j, n);
      if (grid.classList.contains("is-masonry") !== g.masonry) grid.classList.toggle("is-masonry", g.masonry);
      if (!g.masonry) { grid.style.removeProperty("height"); [].forEach.call(grid.children, clear); return g; }
      var cw = (w - s * (n - 1)) / n, bottoms = [];
      for (var c = 0; c < n; c++) bottoms.push(0);
      tiles().forEach(function (t) {
        var k = 0;
        for (var c = 1; c < n; c++) if (bottoms[c] < bottoms[k]) k = c;
        // whole pixels, the columns meeting exactly, so that no hairline shows between two photos
        var x = Math.round(k * (cw + s)), x2 = Math.round(k * (cw + s) + cw), h = Math.round((x2 - x) * ratio(t));
        t.style.left = x + "px";
        t.style.top = bottoms[k] + "px";
        t.style.width = (x2 - x) + "px";
        t.style.height = h + "px";
        bottoms[k] += h + s;
      });
      grid.style.height = Math.max(0, Math.max.apply(null, bottoms) - s) + "px";
      return g;
    }
    // the tiles near the screen slide from where they were to their new place (a FLIP, as Selecta's)
    function move(change) {
      if (reduced() || !grid.animate) { change(); return; }
      var vh = window.innerHeight, list = tiles().filter(function (t) { var r = t.getBoundingClientRect(); return r.bottom > -vh && r.top < 2 * vh; });
      var before = list.map(function (t) { return t.getBoundingClientRect(); });
      list.forEach(function (t) { if (t.getAnimations) t.getAnimations().forEach(function (a) { a.cancel(); }); });
      change();
      var time = ms(getComputedStyle(grid).getPropertyValue("--t-mid"));
      list.forEach(function (t, k) {
        var a = before[k], b = t.getBoundingClientRect();
        if (!a.width || !b.width) return;
        var dx = a.left - b.left, dy = a.top - b.top, sx = a.width / b.width, sy = a.height / b.height;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
        t.animate([{ transform: "translate(" + dx + "px, " + dy + "px) scale(" + sx + ", " + sy + ")" }, { transform: "none" }],
          { duration: time, easing: "cubic-bezier(.22, 1, .36, 1)" });
      });
    }
    function soon() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    }
    g.layout = layout;
    g.set = function (x) {
      x = x || {};
      var i = x.size != null ? sizes.indexOf(+x.size) : -1;
      if (i >= 0) {
        want = i;
        if (o.key) { try { localStorage.setItem(o.key, String(sizes[i])); } catch (e) {} }
      }
      if (x.masonry != null) g.masonry = !!x.masonry;
      move(layout);
      return g;
    };

    if (slider) {
      if (!slider.hasAttribute("aria-label") && !(slider.labels && slider.labels.length && slider.labels[0].textContent.trim())) slider.setAttribute("aria-label", words().size);
      slider.addEventListener("input", function () { var i = steps[+slider.value]; if (i != null) g.set({ size: sizes[i] }); });
    }
    if (window.ResizeObserver) new ResizeObserver(function () { if (grid.clientWidth !== lastW) soon(); }).observe(grid);
    else window.addEventListener("resize", soon);
    // a photo without its width and height takes its shape once loaded
    grid.addEventListener("load", function (e) {
      var im = e.target;
      if (im.tagName === "IMG" && !(im.getAttribute("width") && im.getAttribute("height"))) soon();
    }, true);
    if (window.MutationObserver) {
      new MutationObserver(function (list) {
        for (var i = 0; i < list.length; i++) {
          var m = list[i];
          if (m.target === grid || (m.attributeName === "hidden" && m.target.parentNode === grid)) { soon(); return; }
        }
      }).observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
    }
    return layout();
  }
  window.ds = window.ds || {};
  window.ds.photogrid = photogrid;
})();
/* The date and period picker, taken from Bank's operations (ds.datePick): the quick periods, then the units it offers as
   tabs (a day, a month, a year, two dates), then a grid of days, months or years under a head that steps through them.
   ds.datePick(holder, {value, quick, modes, min, max, years, today, label, onPick, onDraw, opener}) draws it in holder.
     value: the period, {from, to} as "2026-11-09": one day twice, a month's or a year's first and last days, or any two
     days; none (or {}) for every date. quick: [{label, from, to}], the periods one tap away (« Ce mois-ci »); the one
     equal to value is lit. modes: among "day", "month", "year" and "range" (all four by default, in that order), as tabs
     when there are several. min, max: the first and last days that can be chosen, the others greyed. years: [first,
     last], the years offered (min's and max's by default, else ten years back and two ahead). today: the day taken as
     today (Paris's by default). label: the picker's name for screen readers. onPick({from, to, mode, quick, label}) on a
     choice: quick is the quick period taken (or equal to it), label the words for a title. onDraw(holder) after each
     drawing, for a page that marks it. opener: the button that opens it, in the period head's popover (period.css),
     closed again by a choice, Escape or a tap elsewhere; without one, the picker stays in the page (.is-inline).
   Two dates take two taps, the first day then the last (the same one twice for a single day); while the last is sought
   the days between follow the pointer. The arrows of the keyboard move through a grid, Page Up and Page Down by its head's
   step (with Shift, by a year), Home and End to a row's ends, Enter or Space take; Escape forgets a first day, then
   closes. Returns {open(), close(), toggle(), set(value), get(), step(dir), canStep(dir), label(), draw(), el}:
   step(±1) moves the period by its own length (a day, a month, a year, as many months or days as it spans) and tells
   onPick, for the arrows beside a period's title; canStep(dir) says whether there is a period that way (else hide its arrow).
   Without a picker: ds.datePick.of(mode, day) is the day, month or year that holds day; ds.datePick.step(value, dir)
   moves a period; ds.datePick.label(value) names it (« novembre 2026 », « 3 nov. → 9 nov. 2026 »); ds.datePick.kind(value)
   says "all", "day", "month", "year" or "range". The days are Paris's days, written "2026-11-09", whatever the device. */
(function () {
  "use strict";
  var TZ = "Europe/Paris", MODES = ["day", "month", "year", "range"], PAGE = 12;
  var WORDS = {
    fr: { day: "Jour", month: "Mois", year: "Année", range: "Dates", all: "Toutes les dates", pick: "Choisir la période", modes: "Choisir par",
          prev: { day: "Mois précédent", month: "Année précédente", year: "Années précédentes" },
          next: { day: "Mois suivant", month: "Année suivante", year: "Années suivantes" },
          first: "Choisissez le premier jour, puis le dernier.", last: function (d) { return "Du " + d + " : choisissez le dernier jour."; },
          since: function (d) { return "depuis le " + d; }, until: function (d) { return "jusqu’au " + d; } },
    en: { day: "Day", month: "Month", year: "Year", range: "Dates", all: "All dates", pick: "Choose the period", modes: "Choose by",
          prev: { day: "Previous month", month: "Previous year", year: "Earlier years" },
          next: { day: "Next month", month: "Next year", year: "Later years" },
          first: "Pick the first day, then the last.", last: function (d) { return "From " + d + ": pick the last day."; },
          since: function (d) { return "since " + d; }, until: function (d) { return "until " + d; } }
  };
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }
  function words() { return english() ? WORDS.en : WORDS.fr; }
  function find(e) { return typeof e === "string" ? document.querySelector(e) : e; }
  function el(name, cls, text) {
    var e = document.createElement(name);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(cls, text, dp) {
    var b = el("button", cls, text);
    b.type = "button";
    if (dp) b.setAttribute("data-dp", dp);
    return b;
  }

  // the days are Paris's days, counted at noon UTC so that no clock change moves them
  function parisToday() { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function at(key) { return new Date(key + "T12:00:00Z"); }
  function addDays(key, n) { var d = at(key); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function daysBetween(a, b) { return Math.round((at(b) - at(a)) / 864e5); }
  function monthLen(ym) { return new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)).getUTCDate(); }
  function monthIndex(ym) { return +ym.slice(0, 4) * 12 + +ym.slice(5, 7) - 1; }
  function addMonths(ym, n) { var m = monthIndex(ym) + n; return Math.floor(m / 12) + "-" + pad(m % 12 + 1); }
  function fmt(key, opts) { return new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", Object.assign({ timeZone: "UTC" }, opts)).format(at(key)); }
  function date(t, style) { return window.ds.date(t, style); }
  function dayText(key, year) { return date(key, year ? { day: "numeric", month: "short", year: "numeric" } : "day"); }

  // the period of a unit that holds a day: the day itself, its month, its year
  function of(mode, key) {
    if (mode === "month") { var ym = key.slice(0, 7); return { from: ym + "-01", to: ym + "-" + pad(monthLen(ym)), mode: "month" }; }
    if (mode === "year") return { from: key.slice(0, 4) + "-01-01", to: key.slice(0, 4) + "-12-31", mode: "year" };
    return { from: key, to: key, mode: "day" };
  }
  function wholeMonths(v) { return !!(v.from && v.to) && v.from.slice(8) === "01" && v.to === of("month", v.to).to; }
  function kind(v) {
    if (!v || (!v.from && !v.to)) return "all";
    if (!v.from || !v.to) return "range";
    if (MODES.indexOf(v.mode) >= 0) return v.mode;
    if (v.from === v.to) return "day";
    if (v.from.slice(5) === "01-01" && v.to === v.from.slice(0, 4) + "-12-31") return "year";
    if (wholeMonths(v) && v.from.slice(0, 7) === v.to.slice(0, 7)) return "month";
    return "range";
  }
  function norm(v) {
    var f = (v && v.from) || null, t = (v && v.to) || null;
    if (f && t && t < f) { var x = f; f = t; t = x; }
    return { from: f, to: t, mode: kind({ from: f, to: t, mode: v && v.mode }) };
  }
  // a period moved by its own length: a day, a month, a year; a span of whole months by as many months (a quarter by a
  // quarter), any other span by as many days. Every date, or a span open at one end, does not move
  function step(v, dir) {
    v = norm(v);
    if (!v.from || !v.to) return null;
    if (!dir) return v;
    if (v.mode === "day") return of("day", addDays(v.from, dir));
    if (v.mode === "month") return of("month", addMonths(v.from.slice(0, 7), dir) + "-01");
    if (v.mode === "year") return of("year", (+v.from.slice(0, 4) + dir) + "-01-01");
    if (wholeMonths(v)) {
      var n = (monthIndex(v.to.slice(0, 7)) - monthIndex(v.from.slice(0, 7)) + 1) * dir;
      return { from: addMonths(v.from.slice(0, 7), n) + "-01", to: of("month", addMonths(v.to.slice(0, 7), n) + "-01").to, mode: "range" };
    }
    var d = (daysBetween(v.from, v.to) + 1) * dir;
    return { from: addDays(v.from, d), to: addDays(v.to, d), mode: "range" };
  }
  function label(v) {
    v = norm(v);
    var w = words();
    if (v.mode === "all") return w.all;
    if (!v.to) return w.since(dayText(v.from, true));
    if (!v.from) return w.until(dayText(v.to, true));
    // two taps on the same day are that day
    if (v.mode === "day" || v.from === v.to) return date(v.from, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (v.mode === "month") return date(v.from.slice(0, 7), "month");
    if (v.mode === "year") return v.from.slice(0, 4);
    var same = v.from.slice(0, 4) === v.to.slice(0, 4);
    // whole months are named by their months: « septembre → novembre 2026 »
    if (wholeMonths(v)) return (same ? date(v.from, { month: "long" }) : date(v.from.slice(0, 7), "month")) + " → " + date(v.to.slice(0, 7), "month");
    return dayText(v.from, !same) + " → " + dayText(v.to, true);
  }

  var made = 0;
  function datePick(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    o = o || {};
    var id = "ds-datepick-" + (++made), opener = find(o.opener), quick = o.quick || [];
    var modes = (o.modes || MODES).filter(function (m) { return MODES.indexOf(m) >= 0; });
    if (!modes.length) modes = MODES.slice();
    function today() { return o.today || parisToday(); }
    var ty = +today().slice(0, 4), years = o.years || [o.min ? +o.min.slice(0, 4) : ty - 10, o.max ? +o.max.slice(0, 4) : ty + 2];
    // the first and last days that can be chosen: min and max, within the years offered
    var lo = years[0] + "-01-01", hi = years[1] + "-12-31";
    if (o.min && o.min > lo) lo = o.min;
    if (o.max && o.max < hi) hi = o.max;
    var st = { value: norm(o.value), mode: null, view: null, focus: null, anchor: null, hover: null };
    var p = { el: holder };

    holder.classList.add("periodpop", "datepick");
    holder.classList.toggle("is-inline", !opener);
    if (!holder.id) holder.id = id;
    holder.setAttribute("role", opener ? "dialog" : "group");
    holder.setAttribute("aria-label", o.label || words().pick);

    function clampDay(k) { return k < lo ? lo : k > hi ? hi : k; }
    // what a grid's cells are: days for a day or two dates, else months or years
    function unit() { return st.mode === "range" ? "day" : st.mode; }
    function unitKey(u, day) { return u === "day" ? day : u === "month" ? day.slice(0, 7) : day.slice(0, 4); }
    function span(u, k) { return u === "day" ? { from: k, to: k } : of(u, u === "month" ? k + "-01" : k + "-01-01"); }
    function enabled(u, k) { var s = span(u, k); return s.to >= lo && s.from <= hi; }
    function clampUnit(u, k) { var a = unitKey(u, lo), b = unitKey(u, hi); return k < a ? a : k > b ? b : k; }
    // the period shown again when the picker opens or is set: its own unit when offered, else the months
    function reset() {
      var v = st.value;
      st.mode = modes.indexOf(v.mode) >= 0 ? v.mode : modes.indexOf("month") >= 0 ? "month" : modes[0];
      st.view = clampDay(v.mode === "range" ? v.to || v.from : v.from || today());
      st.focus = null; st.anchor = null; st.hover = null;
    }
    function matchQuick() {
      var v = st.value;
      return quick.filter(function (q) { return (q.from || null) === v.from && (q.to || null) === v.to; })[0] || null;
    }
    // a title's words: a quick period's own name for a span or every date (« 3 derniers mois »), else the period's
    p.label = function () {
      var q = matchQuick();
      return q && (st.value.mode === "range" || st.value.mode === "all") ? q.label : label(st.value);
    };
    p.get = function () { return { from: st.value.from, to: st.value.to, mode: st.value.mode }; };

    // the cells of the grid shown: the view's month of days, its year of months, or its page of twelve years
    function yearPage() {
      var y1 = +hi.slice(0, 4), y0 = +lo.slice(0, 4), vy = +st.view.slice(0, 4);
      var end = y1 - PAGE * Math.floor((y1 - vy) / PAGE);
      return { from: Math.max(y0, end - PAGE + 1), to: end };
    }
    function cells() {
      var u = unit(), out = [], i;
      if (u === "day") { var ym = st.view.slice(0, 7), n = monthLen(ym); for (i = 1; i <= n; i++) out.push(ym + "-" + pad(i)); }
      else if (u === "month") { for (i = 1; i <= 12; i++) out.push(st.view.slice(0, 4) + "-" + pad(i)); }
      else { var pg = yearPage(); for (i = pg.from; i <= pg.to; i++) out.push(String(i)); }
      return out;
    }
    function chosen(u, k) {
      var v = st.value;
      if (st.mode === "range") return st.anchor ? k === st.anchor : !!(v.from && v.to) && (k === v.from || k === v.to);
      return v.mode === st.mode && unitKey(u, v.from) === k;
    }
    // the days between two dates: those of the period, or while the last day is sought, those up to the pointer
    function between(k) {
      if (st.mode !== "range") return false;
      var a = st.anchor ? st.anchor : st.value.from, b = st.anchor ? st.hover : st.value.to;
      if (!a || !b) return false;
      if (b < a) { var x = a; a = b; b = x; }
      return k > a && k < b;
    }
    function defaultFocus(list) {
      var u = unit(), ok = list.filter(function (k) { return enabled(u, k); });
      var sel = ok.filter(function (k) { return chosen(u, k); })[0], t = unitKey(u, today());
      return sel || (ok.indexOf(t) >= 0 ? t : ok[0] || null);
    }
    function pageAt(d) {
      var u = unit(), y = +st.view.slice(0, 4);
      if (u === "day") return clampDay(addMonths(st.view.slice(0, 7), d) + "-01");
      if (u === "month") return clampDay((y + d) + "-" + st.view.slice(5, 7) + "-01");
      return clampDay((y + PAGE * d) + "-01-01");
    }
    function canPage(d) {
      var u = unit();
      if (u === "day") { var ym = addMonths(st.view.slice(0, 7), d); return enabled("month", ym); }
      if (u === "month") return enabled("year", String(+st.view.slice(0, 4) + d));
      var pg = yearPage();
      return d < 0 ? pg.from > +lo.slice(0, 4) : pg.to < +hi.slice(0, 4);
    }
    function page(d) {
      if (!canPage(d)) return;
      st.view = pageAt(d);
      st.focus = null;
      draw(d < 0 ? "prev" : "next");
    }
    function headText() {
      var u = unit();
      if (u === "day") return date(st.view.slice(0, 7), "month");
      if (u === "month") return st.view.slice(0, 4);
      var pg = yearPage();
      return pg.from === pg.to ? String(pg.from) : pg.from + " – " + pg.to;
    }

    function setMode(m) {
      if (st.mode === m) return;
      st.mode = m; st.focus = null; st.anchor = null; st.hover = null;
      draw("t-" + m);
    }
    function choose(k) {
      var u = unit();
      if (st.mode !== "range") return pick(of(st.mode, u === "day" ? k : u === "month" ? k + "-01" : k + "-01-01"));
      // two dates: the first tap keeps a day, the second closes the span (in either order)
      if (!st.anchor) { st.anchor = k; st.hover = k; st.focus = k; return draw("c:" + k); }
      var a = st.anchor < k ? st.anchor : k, b = st.anchor < k ? k : st.anchor;
      pick({ from: a, to: b, mode: "range" });
    }
    function pick(v, q) {
      st.value = norm(v);
      st.anchor = null; st.hover = null;
      var out = p.get(), inside = holder.contains(document.activeElement);
      out.quick = q || matchQuick();
      out.label = p.label();
      if (opener && !holder.hidden) { p.close(); if (inside) opener.focus(); } else { reset(); draw(inside ? "cell" : null); }
      if (o.onPick) o.onPick(out);
      return out;
    }

    function quickRow() {
      var box = el("div", "dp-quick"), lit = matchQuick();
      quick.forEach(function (q, i) {
        var b = btn(q === lit ? "on" : "", q.label, "q" + i);
        b.setAttribute("aria-pressed", q === lit ? "true" : "false");
        b.addEventListener("click", function () { pick({ from: q.from, to: q.to }, q); });
        box.append(b);
      });
      return box;
    }
    function tabRow() {
      var w = words(), box = el("div", "tabs dp-tabs");
      box.setAttribute("role", "tablist");
      box.setAttribute("aria-label", w.modes);
      box.style.setProperty("--dp-tabs", String(modes.length));
      modes.forEach(function (m) {
        var on = m === st.mode, b = btn(on ? "on" : "", w[m], "t-" + m);
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("aria-controls", id + "-grid");
        b.tabIndex = on ? 0 : -1;
        b.addEventListener("click", function () { setMode(m); });
        box.append(b);
      });
      return box;
    }
    function headRow() {
      var w = words(), u = unit(), h = el("div", "dp-head"), prev = btn("dp-step", "‹", "prev"), next = btn("dp-step", "›", "next"), mid;
      prev.setAttribute("aria-label", w.prev[u]);
      next.setAttribute("aria-label", w.next[u]);
      prev.disabled = !canPage(-1);
      next.disabled = !canPage(1);
      prev.addEventListener("click", function () { page(-1); });
      next.addEventListener("click", function () { page(1); });
      // the month, the year or the years, written between the arrows, as Bank had it: the arrows go a step at a time
      mid = el("span", "dp-title", headText());
      h.append(prev, mid, next);
      return h;
    }
    function cell(u, k, focusKey) {
      var t = unitKey(u, today()), text = u === "day" ? String(+k.slice(8)) : u === "month" ? fmt(k + "-15", { month: "short" }) : k;
      var on = chosen(u, k), b = btn((on ? "on" : "") + (between(k) ? " is-in" : "") + (k === t ? " is-today" : ""), text, "c:" + k);
      b.dataset.key = k;
      b.tabIndex = k === focusKey ? 0 : -1;
      b.disabled = !enabled(u, k);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", u === "day" ? date(k, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : u === "month" ? date(k, "month") : k);
      if (k === t) b.setAttribute("aria-current", "date");
      b.addEventListener("click", function () { choose(k); });
      return b;
    }
    function gridBox() {
      var u = unit(), list = cells(), g = el("div", "dp-grid is-" + u + "s");
      g.id = id + "-grid";
      g.setAttribute("role", "group");
      g.setAttribute("aria-label", headText());
      var focusKey = st.focus && list.indexOf(st.focus) >= 0 && enabled(u, st.focus) ? st.focus : defaultFocus(list);
      st.focus = focusKey;
      if (u === "day") {
        // the days of the week from Monday, then as many blanks as the month's first day is late
        for (var i = 0; i < 7; i++) {
          var wd = el("span", "dp-wd", fmt(addDays("2026-11-09", i), { weekday: "narrow" }));
          wd.setAttribute("aria-hidden", "true");
          g.append(wd);
        }
        for (var j = (at(list[0]).getUTCDay() + 6) % 7; j > 0; j--) g.append(el("span"));
      }
      list.forEach(function (k) { g.append(cell(u, k, focusKey)); });
      return g;
    }
    function draw(focus) {
      var act = document.activeElement, had = act && holder.contains(act) && act.getAttribute ? act.getAttribute("data-dp") : null;
      if (!st.mode) reset();
      var kids = [];
      if (quick.length) kids.push(quickRow());
      if (modes.length > 1) kids.push(tabRow());
      kids.push(headRow(), gridBox());
      if (st.mode === "range") kids.push(el("p", "dp-hint", st.anchor ? words().last(dayText(st.anchor)) : words().first));
      holder.replaceChildren.apply(holder, kids);
      // the focus stays on what had it, or goes where the keys sent it
      var want = focus || had, t = want === "cell" ? holder.querySelector('.dp-grid [tabindex="0"]') : want ? holder.querySelector('[data-dp="' + want + '"]') : null;
      if (t && !t.disabled && !holder.hidden) t.focus({ preventScroll: true });
      if (o.onDraw) o.onDraw(holder);
      return p;
    }
    // while the last day is sought, the days between follow the pointer, without drawing the grid again
    function paint() {
      [].forEach.call(holder.querySelectorAll(".dp-grid.is-days button"), function (b) { b.classList.toggle("is-in", between(b.dataset.key)); });
    }

    // the keys: in a grid, the arrows, Home and End, Page Up and Page Down; between the tabs, the arrows
    function moved(u, k, e) {
      var key = e.key, d;
      if (u === "day") {
        d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[key];
        if (d) return addDays(k, d);
        if (key === "Home") return addDays(k, -((at(k).getUTCDay() + 6) % 7));
        if (key === "End") return addDays(k, 6 - (at(k).getUTCDay() + 6) % 7);
        if (key === "PageUp" || key === "PageDown") {
          var ym = addMonths(k.slice(0, 7), (key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1));
          return ym + "-" + pad(Math.min(+k.slice(8), monthLen(ym)));
        }
        return null;
      }
      if (u === "month") {
        d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -12, PageDown: 12 }[key];
        if (d) return addMonths(k, d);
        if (key === "Home" || key === "End") return k.slice(0, 4) + (key === "Home" ? "-01" : "-12");
        return null;
      }
      d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -PAGE, PageDown: PAGE }[key];
      if (d) return String(+k + d);
      if (key === "Home" || key === "End") { var pg = yearPage(); return String(key === "Home" ? pg.from : pg.to); }
      return null;
    }
    holder.addEventListener("keydown", function (e) {
      if (e.defaultPrevented) return;
      if (e.key === "Escape") {
        // first the day kept for two dates, then the picker itself; inline, Escape goes on to what holds it
        if (st.anchor) { e.preventDefault(); st.anchor = null; st.hover = null; draw(); }
        else if (opener && !holder.hidden) { e.preventDefault(); p.close(); opener.focus(); }
        return;
      }
      var dp = e.target.getAttribute && e.target.getAttribute("data-dp");
      if (!dp) return;
      if (dp.slice(0, 2) === "t-" && /^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        var i = modes.indexOf(dp.slice(2)), n = modes.length;
        e.preventDefault();
        setMode(modes[e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowLeft" ? -1 : 1) + n) % n]);
        return;
      }
      if (dp.slice(0, 2) !== "c:" || e.altKey || e.ctrlKey || e.metaKey) return;
      var u = unit(), k = moved(u, dp.slice(2), e);
      if (k == null) return;
      e.preventDefault();
      k = clampUnit(u, k);
      st.focus = k;
      st.view = clampDay(u === "day" ? k : u === "month" ? k + "-01" : k + "-01-01");
      if (st.anchor) st.hover = k;
      draw("c:" + k);
    });
    holder.addEventListener("pointerover", function (e) {
      var c = st.anchor && e.target.closest ? e.target.closest(".dp-grid.is-days button") : null;
      if (!c || c.disabled || c.dataset.key === st.hover) return;
      st.hover = c.dataset.key;
      paint();
    });

    p.open = function () {
      reset();
      holder.hidden = false;
      if (opener) opener.setAttribute("aria-expanded", "true");
      return draw("cell");
    };
    p.close = function () {
      holder.hidden = true;
      st.anchor = null; st.hover = null;
      if (opener) opener.setAttribute("aria-expanded", "false");
      return p;
    };
    p.toggle = function () { return holder.hidden ? p.open() : p.close(); };
    p.set = function (v) { st.value = norm(v); reset(); return draw(); };
    p.draw = function () { return draw(); };
    function within(v) { return !!v && (!v.to || v.to >= lo) && (!v.from || v.from <= hi); }
    p.canStep = function (dir) { return within(step(st.value, dir)); };
    p.step = function (dir) { var v = step(st.value, dir); return within(v) ? pick(v) : null; };

    if (opener) {
      opener.setAttribute("aria-haspopup", "dialog");
      opener.setAttribute("aria-controls", holder.id);
      opener.addEventListener("click", p.toggle);
      // pressed, not clicked: a tap inside that draws the picker again must not look like a tap elsewhere
      document.addEventListener("pointerdown", function (e) {
        if (!holder.hidden && !holder.contains(e.target) && !opener.contains(e.target)) p.close();
      });
      opener.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !holder.hidden && !e.defaultPrevented) { e.preventDefault(); p.close(); }
      });
      holder.hidden = true;
      opener.setAttribute("aria-expanded", "false");
    }
    reset();
    return draw();
  }
  datePick.of = of;
  datePick.step = step;
  datePick.label = label;
  datePick.kind = kind;
  datePick.today = parisToday;
  window.ds = window.ds || {};
  window.ds.datePick = datePick;
})();
