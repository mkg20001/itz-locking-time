'use strict'

function lock () {
  const locks = {}
  const nextLocks = {}

  const main = {
    holdLock: async (id, prom, t) => {
      locks[id] = prom
      let e
      let r

      try {
        r = await prom
      } catch (err) {
        e = err
      }

      delete locks[id]

      if (t && e) { throw e }
      return r
    },
    holdNextLock: async (id, prom, t) => {
      nextLocks[id] = prom
      let e
      let r

      try {
        r = await prom
      } catch (err) {
        e = err
      }

      delete nextLocks[id]

      if (t && e) { throw e }
      return r
    },
    waitLock: async (id, t) => {
      let e
      let r

      try {
        r = await locks[id]
      } catch (err) {
        e = err
      }

      if (t && e) { throw e }
      return r
    },
    waitNextLock: async (id, t) => {
      let e
      let r

      try {
        r = await nextLocks[id]
      } catch (err) {
        e = err
      }

      if (t && e) { throw e }
      return r
    },
    runOnce: (id, fnc, t) => {
      return locks[id] ? main.waitLock(id, t) : main.holdLock(id, fnc(), t)
    },
    runNext: (id, fnc, t) => {
      if (nextLocks[id]) {
        return
      }

      return main.holdLock(id, fnc(), t)


      if (locks[id]) {
        await main.waitLock(id, false)
      }



    }
  }

  return main
}

module.exports = lock
