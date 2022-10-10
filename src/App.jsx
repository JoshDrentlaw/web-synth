import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import { connect } from "tone"
import './App.css'

const notes = [
    {
        note: 'C',
        sharp: false
    },
    {
        note: 'C#',
        sharp: true
    },
    {
        note: 'D',
        sharp: false
    },
    {
        note: 'Eb',
        sharp: true
    },
    {
        note: 'E',
        sharp: false
    },
    {
        note: 'F',
        sharp: false
    },
    {
        note: 'F#',
        sharp: true
    },
    {
        note: 'G',
        sharp: false
    },
    {
        note: 'G#',
        sharp: true
    },
    {
        note: 'A',
        sharp: false
    },
    {
        note: 'Bb',
        sharp: true
    },
    {
        note: 'B',
        sharp: false
    },
]

function App() {
    const [osc, setOsc] = useState(null),
        [audioCtx, setAudioCtx] = useState(null),
        [volume, setVolume] = useState(0.40),
        [synthType, setSynthType] = useState('sine'),
        [delay, setDelay] = useState(0)

    useEffect(() => {
        if (!audioCtx) {
            setAudioCtx(new AudioContext())
        }
    }, [audioCtx])

    const startSynth = (note) => {
        const oscillatorNode = audioCtx.createOscillator(),
            gainNode = audioCtx.createGain(),
            delayNode1 = audioCtx.createDelay(10),
            finish = audioCtx.destination
    
        // SET GAIN
        gainNode.gain.value = volume

        // SET SYNTH
        oscillatorNode.type = synthType
        oscillatorNode.frequency.value = Tone.Frequency(note)

        // SET DELAY
        delayNode1.delayTime.value = delay

        // CONNECT NODES
        oscillatorNode.connect(delayNode1).connect(gainNode).connect(finish)

        // START SYNTH
        oscillatorNode.start()
        setOsc(oscillatorNode)
    }

    const stopSynth = () => {
        if (osc) {
            osc.stop()
        }
    }

    return (
        <div style={{
            border: '1px solid black',
            borderRadius: '5px',
            padding: '15px'
        }}>
            <div style={{
                display: 'flex',
                marginBottom: '20px'
            }}>
                <div style={{marginRight: '10px'}}>
                    <label htmlFor="volume-slider" style={{display: 'block'}}>Volume</label>
                    <input type="range" id="volume-slider" step={0.01} min={0} max={1} value={volume} onChange={e => setVolume(e.target.value)} />
                </div>
                <div style={{marginRight: '10px'}}>
                    <label htmlFor="synth-type" style={{display: 'block'}}>Synth Type</label>
                    <select id="synth-type" onChange={e => setSynthType(e.target.value)} value={synthType}>
                        <option value="sine">Sine</option>
                        <option value="square">Square</option>
                        <option value="sawtooth">Sawtooth</option>
                        <option value="triangle">Triangle</option>
                    </select>
                </div>
                <div style={{marginRight: '10px'}}>
                    <label htmlFor="delay-input" style={{display: 'block'}}>Delay <small>seconds</small></label>
                    <input type="number" id="delay-input" min={0} max={10} step={0.1} value={delay} onChange={e => setDelay(e.target.value)} />
                </div>
            </div>
            <div>
                {notes.map((n, i) => (
                    <button
                        key={i}
                        style={{
                            border: '1px solid black',
                            borderRadius: '3px',
                            backgroundColor: n.sharp ? 'black' : 'white',
                            color: n.sharp ? 'white' : 'black'
                        }}
                        onMouseDown={() => startSynth(`${n.note}3`)}
                        onMouseUp={stopSynth}
                        onMouseEnter={e => (e.buttons === 1 && startSynth(`${n.note}3`))}
                        onMouseLeave={stopSynth}
                    >{n.note}</button>
                ))}
            </div>
        </div>
    )
}

export default App
