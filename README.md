# itz-locking-time

Use promise-based non-ipc locks

# API

`.runOnce(id, fnc, t)`: Run a function once or await it's current execution
  - id<String> unique identifier
  - fnc()<Promise> function that is going to be executed once or if it's already executing is being awaited
  - t<Boolean>: Throw or stay silent

`.runNext(id, fnc, t)`: Run function or if already running run it again afterwards. Will automatically batch all next calls per iteration
  - id<String> unique identifier
  - fnc()<Promise> function that is going to be executed once or if it's already executing is being awaited
  - t<Boolean>: Throw or stay silent

# Usage

```js
const Lock = require('itz-locking-time')
const lock = Lock()

const wait = (i) => new Promise((resolve, reject) => setTimeout(resolve, i))

const someFnc = async () => {
  await wait(10000)
}

lock.runOnce('heavy', someFnc) // will run
await lock.runOnce('heavy', someFnc) // will await first execution

lock.runNext('process', someFnc) // will run
lock.runNext('process', someFnc) // will queue next execution
await lock.runNext('process', someFnc) // will await next execution
```
