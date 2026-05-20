let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function playPop() {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime

  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(800, now)
  osc1.frequency.exponentialRampToValueAtTime(300, now + 0.08)
  gain1.gain.setValueAtTime(0.4, now)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  osc1.connect(gain1).connect(ctx.destination)
  osc1.start(now)
  osc1.stop(now + 0.12)

  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(1200, now)
  osc2.frequency.exponentialRampToValueAtTime(400, now + 0.05)
  gain2.gain.setValueAtTime(0.2, now)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
  osc2.connect(gain2).connect(ctx.destination)
  osc2.start(now)
  osc2.stop(now + 0.06)
}

export function playBingo() {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  const noteDuration = 0.18

  notes.forEach((freq, i) => {
    const t = now + i * noteDuration * 0.7

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.35, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.35)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(freq * 2, t)
    gain2.gain.setValueAtTime(0, t)
    gain2.gain.linearRampToValueAtTime(0.1, t + 0.01)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(t)
    osc2.stop(t + 0.2)
  })

  const chordFreqs = [1046.5, 1318.5, 1567.98]
  const chordT = now + notes.length * noteDuration * 0.7
  chordFreqs.forEach((freq) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, chordT)
    gain.gain.setValueAtTime(0, chordT)
    gain.gain.linearRampToValueAtTime(0.15, chordT + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, chordT + 0.8)
    osc.connect(gain).connect(ctx.destination)
    osc.start(chordT)
    osc.stop(chordT + 0.8)
  })
}

export function playClick() {
  const ctx = getCtx()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1000, now)
  osc.frequency.exponentialRampToValueAtTime(500, now + 0.03)
  gain.gain.setValueAtTime(0.1, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.04)
}
