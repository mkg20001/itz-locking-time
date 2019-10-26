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
    runOnce: (id, fnc, t) => {
      return locks[id] ? main.waitLock(id, t) : main.holdLock(id, fnc(), t)
    },
    runNext: async (id, fnc, t) => {
      const idn = `${id}#next`

      // either we have a nextLock or the nextLock has moved to lock layer
      await main.runOnce(idn, (async () => {
        if (locks[id]) {
          await main.waitLock(id, false)
        }

        main.runOnce(id, fnc, t)
      })(), true)

      await main.waitLock(id, t)
    }
  }

  return main
}

module.exports = lock
