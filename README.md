# :wavy_dash:  Spring
[:books: **Documentation**](#api)  |  [:tada: **Example**](https://pqml.github.io/spring) | [:globe_with_meridians: **Internet modules**](https://www.npmjs.com/org/internet)

- Framerate-independant spring physics
- Small, < 1kb gzipped
- Control the spring with tension and friction
- Adjustable timestep for the physics solver
- `onStart` / `onStop` callbacks
- This lib was made to learn more about fixed timesteps and integration.
  - It's a pretty basic Euler integration - not sure it will work for complex structures like spring chaining.
  - If you need a rock-solid spring physics library, use [ReboundJS](https://github.com/facebook/rebound-js)
- Articles used :
  - [Fix Your Timestep!](https://gafferongames.com/post/fix_your_timestep/)
  - [Frame Rate Independent Damping using Lerp](http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/)
  - [Integration by Example - Euler vs Verlet vs Runge-Kutta](http://codeflow.org/entries/2010/aug/28/integration-by-example-euler-vs-verlet-vs-runge-kutta/)

<br>

# Requirements
- ES6 Modules support
  - Using a module bundler like Webpack, Rollup or Parcel
  - [Native support from browser](https://caniuse.com/#feat=es6-module)
  - From NodeJS with [esm](https://github.com/standard-things/esm)

<br>

# API

<a name="Spring"></a>


* [Spring](#Spring)
    * [new Spring([options])](#new_Spring_new)
    * _Methods_
        * [.setValue(newCurrent)](#Spring+setValue)
        * [.setTarget(newTarget)](#Spring+setTarget)
        * [.setTension(tensionValue)](#Spring+setTension)
        * [.setFriction(frictionValue)](#Spring+setFriction)
        * [.start()](#Spring+start)
        * [.stop()](#Spring+stop)
        * [.update(dt)](#Spring+update)
        * [.dispose()](#Spring+dispose)
    * _Properties_
        * [.initial](#Spring+initial) : <code>number</code>
        * [.value](#Spring+value) : <code>number</code>
        * [.previous](#Spring+previous) : <code>number</code>
        * [.velocity](#Spring+velocity) : <code>number</code>
        * [.onStart](#Spring+onStart) : <code>function</code>
        * [.onStop](#Spring+onStop) : <code>function</code>

<br>
<a name="new_Spring_new"></a>

#### new Spring([options])
Create a new Spring instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Spring options. |
| [options.initial] | <code>number</code> | <code>0</code> | Initial value / targetValue of your spring. |
| [options.tension] | <code>number</code> | <code>0.1</code> | Tension/Stifness of your spring. |
| [options.friction] | <code>number</code> | <code>0.2</code> | *From 0 to 1.* Friction (Damping) of your spring. |
| [options.step] | <code>number</code> | <code>10</code> | Timestep of the physics solver (in ms). Step > 16.67ms will give you pretty bad results. |
| [options.onStart] | <code>function</code> |  | `onStart` will be called when the spring starts moving. |
| [options.onStop] | <code>function</code> |  | `onStop` will be called when your the spring stops moving. |
| [options.precisionStop] | <code>number</code> | <code>0.0001</code> | Minimum distance between `value` and `target` to consider the spring stopped. |
| [options.perfectStop] | <code>boolean</code> | <code>false</code> | Define if `value` is set precisely to targetValue when the spring stops moving. |

**Example**  
```js
import { raf } from '@internet/raf'
import Spring from '@internet/spring'

const move = new Spring({ initial: 0 })
move.setTarget(300)
raf.add(dt => {
  move.update(dt)
  console.log(move.value)
})
```

* * *

<a name="Spring+setValue"></a>

#### spring.setValue(newCurrent)
Change the current position of the spring. Can retrigger onStart / onStop.

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

| Param | Type | Description |
| --- | --- | --- |
| newCurrent | <code>number</code> | New current value. |


* * *

<a name="Spring+setTarget"></a>

#### spring.setTarget(newTarget)
Update target / resting position of the spring. Can retrigger onStart / onStop.

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

| Param | Type | Description |
| --- | --- | --- |
| newTarget | <code>number</code> | New target value. |


* * *

<a name="Spring+setTension"></a>

#### spring.setTension(tensionValue)
Update tension of the spring

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

| Param | Type | Description |
| --- | --- | --- |
| tensionValue | <code>number</code> | New tension value. |


* * *

<a name="Spring+setFriction"></a>

#### spring.setFriction(frictionValue)
Update friction of the spring

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

| Param | Type | Description |
| --- | --- | --- |
| frictionValue | <code>number</code> | New friction value. |


* * *

<a name="Spring+start"></a>

#### spring.start()
Force re-start of the spring. Only needed if you force-stop the spring with `stop()`

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

* * *

<a name="Spring+stop"></a>

#### spring.stop()
Force-stop the spring.

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

* * *

<a name="Spring+update"></a>

#### spring.update(dt)
Update the spring physic state

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

| Param | Type | Description |
| --- | --- | --- |
| dt | <code>number</code> | Elapsed time since the last frame (in ms) |


* * *

<a name="Spring+dispose"></a>

#### spring.dispose()
Stop the spring and remove callbacks referenced in onStart and onStop.

**Kind**: instance method of [<code>Spring</code>](#Spring)  
**Category**: Methods  

* * *

<a name="Spring+initial"></a>

#### spring.initial : <code>number</code>
Initial position of the spring

**Kind**: instance property of [<code>Spring</code>](#Spring)  
**Category**: Properties  

* * *

<a name="Spring+value"></a>

#### spring.value : <code>number</code>
Current position of the spring

**Kind**: instance property of [<code>Spring</code>](#Spring)  
**Category**: Properties  

* * *

<a name="Spring+previous"></a>

#### spring.previous : <code>number</code>
Previous frame position of the spring

**Kind**: instance property of [<code>Spring</code>](#Spring)  
**Category**: Properties  

* * *

<a name="Spring+velocity"></a>

#### spring.velocity : <code>number</code>
Current velocity of the spring

**Kind**: instance property of [<code>Spring</code>](#Spring)  
**Category**: Properties  

* * *

<a name="Spring+onStart"></a>

#### spring.onStart : <code>function</code>
Optional function called when the spring starts

**Kind**: instance property of [<code>Spring</code>](#Spring)  
**Category**: Properties  

* * *

<a name="Spring+onStop"></a>

#### spring.onStop : <code>function</code>
Optional function called when the spring stops

**Kind**: instance property of [<code>Spring</code>](#Spring)  
**Category**: Properties  

* * *

