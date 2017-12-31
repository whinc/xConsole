function sendXHR () {
  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText)
      } else {
        console.error(xhr.statusText)
      }
    }
  }
  xhr.open('GET', 'https://api.github.com/users/octocat/orgs', true, 'a', 'b')
  xhr.send('hello')
}

// 测试用例2
// 1. onreadystatechange 在 send 之后设置
function sendXHR2 () {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://api.github.com/users/whinc')
  xhr.send('hello')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText)
      } else {
        console.error(xhr.statusText)
      }
    }
  }
}

window.onerror = function () {
  console.log('window.onerror handler')
}

addEventListener('DOMContentLoaded', function () {
  if (window.xConsole) {
    xConsole.init()
    // test console plugin
    // console.log('[test] log')
    // console.info('[test] info')
    var a = {
      a1: 1,
      a2: {
        b1: '1',
        b2: true
      },
      [Symbol('c')]: null
    }
    Object.defineProperty(a, 'd', {
      get: function d () { return { d1: 1, d2: 2 } }
    })
    Object.defineProperty(a, 'e', {
      get: function e () { return 'e' },
      set: function e (v) { this._e = v }
    })
    Object.defineProperty(a, 'f', {
      value: undefined
    })
    Object.defineProperty(a, 'g', {
      value: 'g',
      writable: false
    })
    var b = [
      1,
      [
        2,
        [
          3,
          [
            4, 'd'
          ],
          'c'
        ],
        'b'
      ],
      'a'
    ]
    console.warn('head', a, 'middle', b, 'tail')
    console.warn('[test] warn', true, 99, undefined, null)
    var f1 = function () { a = function () { } }
    var f2 = () => { b = () => { } }
    var f3 = Array.prototype.fill
    console.warn(f1, f2, f3, { a: f1 })
    // console.error('[test] error')
    // console.debug('[test] debug')
    // xConsole.commands.dispatch('console:log', {texts: ['[test] dispatch command log']})
    // xConsole.commands.dispatch('console:info', {texts: ['[test] dispatch command info']})
    // xConsole.commands.dispatch('console:warn', {texts: ['[test] dispatch command warn']})
    // xConsole.commands.dispatch('console:error', {texts: ['[test] dispatch command error']})
    // xConsole.commands.dispatch('console:debug', {texts: ['[test] dispatch command debug']})
    // test add plugin
    // xConsole.plugins.add({
    //   id: 'xConsole:Storage',
    //   name: 'Storage',
    //   render() {
    //     var h = React.createElement.bind(React)
    //     return (
    //       h('div', {},
    //         h('h1', {}, 'Storage'),
    //         h('ul', {},
    //           h('li', {}, 'LocalStorage'),
    //           h('li', {}, 'SessionStorage')
    //         )
    //       )
    //     )
    //   },
    //   onInit () {
    //     console.log(`[StoragePlugin] onInit() called`)
    //   },
    //   onReady () {
    //     console.log(`[StoragePlugin] onReady() called`)
    //   },
    //   onXConsoleShow() {
    //     console.log(`[StoragePlugin] onXConsoleShow() called`)
    //   },
    //   onXConsoleHide() {
    //     console.log(`[StoragePlugin] onXConsoleHide() called`)
    //   },
    //   onShow() {
    //     console.log(`[StoragePlugin] onShow() called`)
    //   },
    //   // Plugin is going to be hidden
    //   onHide() {
    //     console.log(`[StoragePlugin] onHide() called`)
    //   }
    // })

    // setTimeout(function () {
    //   Promise.reject('[test] capture promise unhandle rejection error')
    // }, 0)

    // setTimeout(function () {
    //   throw new Error('[test] capture global error')
    // }, 0)
  }
})
