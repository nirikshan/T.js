// Generated by CoffeeScript 1.4.0

T.def('main', function(game) {
  return [
    '.gameviewer.size-21', T('banner', game), T('board', game), T('toolbar', game), T('point-label', game), T('right-panel', game), {
      languageChanged: function(e, language) {
        return console.log("Language is changed to " + language);
      },
      afterRender: function(el) {
        return game.element = el;
      }
    }
  ];
});

T.def('banner', function(game) {
  return [
    '.banner', ['.banner-overlay'], [
      '.banner-left', T('language-switcher').process(), '&nbsp;&nbsp;', t('whose_turn'), "&nbsp;", [
        'img.next-player', {
          src: 'images/default.gif'
        }
      ]
    ], T('move-number', game), T('resign', game), ['.banner-overlay', T('banner-prisoners', game), T('window-opener', game)]
  ];
});

T.def('language-switcher', function() {
  return [
    [
      'a.localization', {
        href: 'javascript:void(0)',
        click: function() {
          return $(this).trigger('languageChanged', ['cn']);
        }
      }, '中文'
    ], ' | ', [
      'a.localization', {
        href: 'javascript:void(0)',
        click: function() {
          return $(this).trigger('languageChanged', ['en']);
        }
      }, 'EN'
    ]
  ];
});

T.def('move-number', function(game) {
  return [
    '.button.move-number-outer', [
      'a.thickbox', {
        href: '#TB_inline?test=0&width=250&height=56&inlineId=1_goTo&focus=1_goToInput&modal=true&test1=0',
        title: "" + (t('jump_to_xx')) + " [Alt Shift G]"
      }, t('move_number_before'), '&nbsp;', ['span.control-text.move-number', 0], '&nbsp;', t('move_number_after')
    ]
  ];
});

T.def('resign', function(game) {
  return [
    '.resign', [
      'span.button', [
        'a', {
          href: 'javascript:void(0)',
          click: function() {
            return console.log('Resign');
          }
        }, t('resign')
      ]
    ]
  ];
});

T.def('banner-prisoners', function(game) {
  return ['.prisoners-outer', T('banner-prisoner', game, 'black'), T('banner-prisoner', game, 'white')];
});

T.def('banner-prisoner', function(game, color) {
  return [
    "." + color, [
      'span.button', [
        'a', {
          href: 'javascript: void(0)'
        }, [
          'img.prisoners', {
            src: "images/15/" + color + "_dead.gif"
          }, '&nbsp;', ["span.control-text." + color + "_PRISONERS", 0]
        ]
      ]
    ]
  ];
});

T.def('window-opener', function(game) {
  return [
    '.open-window-outer', [
      'a', {
        title: "" + (t('open_in_new_window')) + " [Alt Shift W]",
        href: 'javascript: void(0)',
        click: function() {
          return console.log('Open in new window');
        }
      }, [
        'img.sprite-newwindow', {
          src: 'images/default.gif'
        }
      ]
    ]
  ];
});

T.def('board', function(game) {
  return [
    '.board-outer.sprite-21-board', [
      '.board', ['.board-overlay.points'], ['.board-overlay.marks'], ['.board-overlay.branches'], ['.sprite-21-markmove.move-marks'], ['.board-overlay.prisoners'], [
        '.board-overlay.fascade', [
          'img.sprite-21-blankboard', {
            src: 'images/default.gif'
          }
        ]
      ]
    ]
  ];
});

T.def('toolbar', function(game) {
  return [
    '.toolbar', [
      '.tb-item.refresh', [
        'a.toggle-opacity', {
          href: 'javascript: void(0)',
          click: function() {
            return console.log('Refresh');
          },
          title: "" + (t('refresh')) + " [Alt Shift R]"
        }, [
          'img.sprite-refresh', {
            src: 'images/default.gif'
          }
        ]
      ]
    ], [
      '.tb-item.toggle-number', [
        'a.toggle-opacity', {
          href: 'javascript: void(0)',
          click: function() {
            return console.log('Toggle move number display');
          },
          title: "" + (t('refresh')) + " [Alt Shift R]"
        }, [
          'img.sprite-toggle-number', {
            src: 'images/shownumber.gif'
          }
        ]
      ]
    ]
  ];
});

T.def('point-label', function(game) {
  return ['.point-label'];
});

T.def('right-panel', function(game) {
  return ['.right-pane', T('info-pane', game), ['.comment']];
});

T.def('info-pane', function(game) {
  return ['.info', ['p', 'Name: ', game.name]];
});

window.game = {
  name: 'Test',
  moves: [[0, 3, 3], [1, 16, 16]]
};

T('main', game).render({
  inside: '#container'
});
