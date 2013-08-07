T.def 'main', ->
  [ '.gvreset.gameviewer'
    T.use('banner').process()
  ]

T.def 'banner', ->
  [ '.gvreset.gvbanner'
    [ '.gvreset.gvbanner-overlay' ]
    [ '.gvreset.gvbanner-left'
      [ 'a.gvreset.localization'
        href: '#'
        onclick: 'jsGameViewer.GV1.changeLocale("zh_cn");return false;'
        '中文'
      ]
      [ 'a.gvreset.localization'
        href: '#'
        onclick: 'jsGameViewer.GV1.changeLocale("en_us");return false;'
        'EN'
      ]
      '&nbsp;&nbsp;'
      "t('whose_turn')"
      "&nbsp;"
      [ 'img.gvreset.nextPlayerImg'
        src: 'images/default.gif'
        border: '0px'
      ]
    ]
  ]

$('#container').html(T('main').render())

