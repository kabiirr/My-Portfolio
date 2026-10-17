/* ==========================================================================
   Interface sounds for the works page (grid.html)
   Synthesised with Web Audio, so there are no audio files to load. Off by
   default; the AudioContext is only created once the visitor turns sound on.
   ========================================================================== */
window.createWorksSound = function createWorksSound() {
    'use strict';

    let ctx = null;
    let master = null;
    let noise = null;
    let enabled = false;

    function ensure() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return false;
            ctx = new AC();
            master = ctx.createGain();
            master.gain.value = 0.9;
            master.connect(ctx.destination);
            // One second of white noise, reused for paper and whoosh sounds
            noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
            const data = noise.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        }
        if (ctx.state === 'suspended') ctx.resume();
        return true;
    }

    /** Gain envelope: quick attack, exponential decay */
    function envelope(peak, attack, decay) {
        const g = ctx.createGain();
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        g.connect(master);
        return g;
    }

    function tone(type, from, to, peak, decay, delay = 0) {
        const o = ctx.createOscillator();
        const t = ctx.currentTime + delay;
        o.type = type;
        o.frequency.setValueAtTime(from, t);
        if (to !== from) o.frequency.exponentialRampToValueAtTime(to, t + decay);
        o.connect(envelope(peak, 0.004, decay));
        o.start(t);
        o.stop(t + decay + 0.05);
    }

    function hiss(filterType, freqFrom, freqTo, q, peak, decay) {
        const src = ctx.createBufferSource();
        src.buffer = noise;
        const f = ctx.createBiquadFilter();
        const t = ctx.currentTime;
        f.type = filterType;
        f.Q.value = q;
        f.frequency.setValueAtTime(freqFrom, t);
        f.frequency.exponentialRampToValueAtTime(freqTo, t + decay);
        src.connect(f).connect(envelope(peak, 0.005, decay));
        src.start(t, Math.random() * 0.5);
        src.stop(t + decay + 0.05);
    }

    const sounds = {
        // Hovering a shot: a tiny glassy tick
        tick: () => tone('sine', 2600, 2600, 0.018, 0.035),
        // Opening a project: a soft rising pop
        open: () => {
            tone('sine', 420, 980, 0.07, 0.18);
            tone('triangle', 840, 1960, 0.02, 0.12);
        },
        // Closing: the same pop falling
        close: () => tone('sine', 980, 380, 0.06, 0.16),
        // Picking up a card: dry paper
        pick: () => hiss('bandpass', 2600, 1800, 1.2, 0.09, 0.07),
        // Throwing a card: a whoosh that scales with release speed (0–1)
        throw: (v = 0.5) => hiss('lowpass', 2400 + 2600 * v, 300, 0.7, 0.03 + 0.07 * v, 0.18 + 0.25 * v),
        // Switching views: two quick notes
        view: () => {
            tone('sine', 880, 880, 0.035, 0.06);
            tone('sine', 1320, 1320, 0.035, 0.08, 0.06);
        },
        // Paging between projects / shots
        step: () => tone('triangle', 1500, 1100, 0.03, 0.06),
    };

    return {
        play(name, arg) {
            if (!enabled || !sounds[name] || !ensure()) return;
            sounds[name](arg);
        },
        set(on) {
            enabled = on;
            if (on) ensure();
        },
        get enabled() {
            return enabled;
        },
    };
};
