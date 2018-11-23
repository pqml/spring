'use strict'

/**
  * Create a new Spring instance.
  * @class Spring
  * @param {Object} [options={}] Spring options.
  * @param {number} [options.initial=0] Initial value / targetValue of your spring.
  * @param {number} [options.tension=0.1] Tension/Stifness of your spring.
  * @param {number} [options.friction=0.2] *From 0 to 1.* Friction (Damping) of your spring.
  * @param {number} [options.step=10] Timestep of the physics solver (in ms). Step > 16.67ms will give you pretty bad results.
  * @param {function} [options.onStart] `onStart` will be called when the spring starts moving.
  * @param {function} [options.onStop] `onStop` will be called when your the spring stops moving.
  * @param {number} [options.precisionStop=0.0001] Minimum distance between `value` and `target` to consider the spring stopped.
  * @param {boolean} [options.perfectStop=false] Define if `value` is set precisely to targetValue when the spring stops moving.
  * @constructor
  * @example
  * import { raf } from '@internet/raf'
  * import Spring from '@internet/spring'
  *
  * const move = new Spring({ initial: 0 })
  * move.setTarget(300)
  * raf.add(dt => {
  *   move.update(dt)
  *   console.log(move.value)
  * })
  *
  */
function Spring (options) {
  if (options === void 0) options = {}
  /**
   * Initial position of the spring
   * @type {number}
   * @category Properties
   */
  this.initial = options.initial || 0

  /**
   * Current position of the spring
   * @type {number}
   * @category Properties
   */
  this.value = this.initial

  /**
   * Previous frame position of the spring
   * @type {number}
   * @category Properties
   */
  this.previous = this.initial

  /**
   * Current velocity of the spring
   * @type {number}
   * @category Properties
   */
  this.velocity = 0

  /**
   * Optional function called when the spring starts
   * @type {function}
   * @category Properties
   */
  this.onStart = options.onStart

  /**
   * Optional function called when the spring stops
   * @type {function}
   * @category Properties
   */
  this.onStop = options.onStop

  this.precisionStop = options.precisionStop || 0.0001
  this.perfectStop = !!options.perfectStop

  this.setValue(this.initial)
  this.setTarget(this.initial)
  this.setMass(options.mass || 1)
  this.setTension(options.tension || 0.1)
  this.setFriction(options.friction || 0.2)
  this.setStep(options.step || 10)
}

/**
 * Change the current position of the spring. Can retrigger onStart / onStop.
 * @method
 * @param {number} newCurrent New current value.
 * @category Methods
 */
Spring.prototype.setValue = function setValue (v) {
  this.value = v
  if (Math.abs(this.target - this.value) > this.precisionStop) this.start()
  else this.stop()
}

/**
 * Update target / resting position of the spring. Can retrigger onStart / onStop.
 * @method
 * @param {number} newTarget New target value.
 * @category Methods
 */
Spring.prototype.setTarget = function setTarget (v) {
  this.target = v
  if (Math.abs(this.target - this.value) > this.precisionStop) this.start()
  else this.stop()
}

/**
 * Update tension of the spring
 * @method
 * @param {number} tensionValue New tension value.
 * @category Methods
 */
Spring.prototype.setTension = function setTension (v) {
  this._K = v
}

/**
 * Update friction of the spring
 * @method
 * @param {number} frictionValue New friction value.
 * @category Methods
 */
Spring.prototype.setFriction = function setFriction (v) {
  this._D = v
  this._dampingAdjuster = Math.pow(1 - this._D, this._stepAdjuster)
}

Spring.prototype.setMass = function setMass (v) {
  this.mass = v
  this._inverseMass = 1 / this.mass
}

Spring.prototype.setStep = function setStep (v) {
  this._step = v
  this._stepAdjuster = this._step / 16.67
  this.setFriction(this._D) // recompute dampingAdjuster
}

/**
 * Force re-start of the spring. Only needed if you force-stop the spring with `stop()`
 * @method
 * @category Methods
 */
Spring.prototype.start = function start () {
  this.stopped = false
  if (this.onStart) this.onStart()
}

/**
 * Force-stop the spring.
 * @method
 * @category Methods
 */
Spring.prototype.stop = function stop () {
  if (this.stopped) return
  if (this.perfectStop && Math.abs(this.target - this.value) <= this.precisionStop) this.value = this.target
  this.acceleration = 0
  this.velocity = 0
  this._accumulator = 0
  this._prevStepVel = 0
  this._prevStepValue = this.value
  this._adjusted = false
  this.stopped = true
  if (this.onStop) this.onStop()
}

/**
 * Update the spring physic state
 * @method
 * @param {number} dt Elapsed time since the last frame (in ms)
 * @category Methods
 */
Spring.prototype.update = function update (dt) {
  if (this.stopped) return
  this._accumulator += dt
  this.previous = this.value

  if (this._adjusted) {
    this._adjusted = false
    this.velocity = this._prevStepVel
    this.value = this._prevStepValue
  }

  if (dt < this._step) {
    this._adjusted = true
    this._accumulator += this._step
  }

  while (this._accumulator >= this._step) {
    this.acceleration = -this._K * (this.value - this.target) * this._inverseMass // f = a * m <=> a = f / m
    this._prevStepVel = this.velocity
    this.velocity = (this.velocity + this.acceleration * this._stepAdjuster) * this._dampingAdjuster
    this._prevStepValue = this.value
    this.value = this.value + this.velocity * this._stepAdjuster
    this._accumulator -= this._step
  }

  if (this._adjusted) {
    var lerp = this._accumulator / this._step
    this.value = this.value * lerp + this._prevStepValue * (1 - lerp)
  }

  if (Math.abs(this.target - this.value) <= this.precisionStop) this.stop()
}

/**
 * Stop the spring and remove callbacks referenced in onStart and onStop.
 * @category Methods
 */
Spring.prototype.dispose = function dispose () {
  this.stop()
  this.onStart = null
  this.onStop = null
}

export default Spring
