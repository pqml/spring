import Spring from '../lib'
import { raf, fpsLimiter } from '@internet/raf'
import * as dat from 'dat.gui'

const FPS = [null, 10, 6]
const gui = new dat.GUI()

const params = { tension: 0.1, friction: 0.2, timestep: 8 }
const els = Array
  .from(document.querySelectorAll('.dot'))
  .map((el, i) => createSpring(el, i, {
    precisionStop: 0.01,
    perfectStop: true,
    tension: params.tension,
    friction: params.friction,
    step: 8
  }))

gui.add(params, 'tension', 0, 1).onChange(v => { els.forEach(el => el.setTension(v)) })
gui.add(params, 'friction', 0, 1).onChange(v => { els.forEach(el => el.setFriction(v)) })

document.addEventListener('mousemove', e => {
  for (let i = 0; i < els.length; i++) els[i].setTarget(e.clientX, e.clientY)
})

function createSpring (el, i, opts) {
  const x = new Spring(opts)
  const y = new Spring(opts)
  const update = !FPS[i] ? _update : fpsLimiter(FPS[i], _update)
  x.onStart = () => !y.stopped && raf.add(update)
  y.onStart = () => !x.stopped && raf.add(update)
  x.onStop = () => y.stopped && raf.remove(update)
  y.onStop = () => x.stopped && raf.remove(update)

  return { setTarget, setTension, setFriction, setStep }

  function setTension (v) {
    x.setTension(v)
    y.setTension(v)
  }

  function setFriction (v) {
    x.setFriction(v)
    y.setFriction(v)
  }

  function setStep (v) {
    x.setStep(v)
    y.setStep(v)
  }

  function setTarget (nx, ny) {
    x.setTarget(nx)
    y.setTarget(ny)
  }

  function _update (dt) {
    x.update(dt)
    y.update(dt)
    el.classList[x.stopped && y.stopped ? 'add' : 'remove']('stopped')
    el.style.transform = `translate3d(${x.value}px, ${y.value}px, 0)`
  }
}
