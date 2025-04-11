export const effectDescriptions = {
    master: {
        title: "Master",
        description: `
            <strong>Bypass:</strong> Disables all effects.<br /><br />
            <strong>Post gain:</strong> Post gain acts as a digital volume knob for all effects, after they have been applied but before the sound reaches the limiter.
        `
    },
    limiter: {
        title: "Limiter",
        description: `
            This output limiter tries to avoid clipping of output (caused by DSP that tries to make part or all of the audio louder than before, if the input is already near maximum).<br /><br />
            <strong>Limiter threshold:</strong> This should be set to -0.1 unless, for some reason, your audio is clipping before digital clipping, in which case you can set it to lower values.<br /><br />
            <strong>Limiter release:</strong> The limiter is only as effective as long as the release time is set. Short release times will lead to audible distortion of the limited sound, especially of low frequencies; an extended release is usually preferred but reduces the volume that can be achieved somewhat. If "pumping" (ducking of limited sound and coming back up over time) becomes objectionable, making the release longer OR shorter can help make the effect less noticeable.
        `
    },
    dynamicBassBoost: {
        title: "Dynamic Bass Boost",
        description: `
            Frequency-detecting bass-boost. Automatically sets its own parameters, such as gain, bandwidth, and cut-off frequency by analysing the incoming audio stream.<br /><br />
            <strong>Max gain:</strong> Adjusts the amount of the dynamic bass boost effects.
        `
    },
    analogModeling: {
        title: "Analog Modeling",
        description: `
            Oversampled analog modeling is an aliasing-free, even harmonic generator.
        `
    },
    dynamicRangeCompander: {
        title: "Dynamic Range Compander",
        description: `
            Highly automated multiband dynamic range adjusting effect.
        `
    },
    crossfeed: {
        title: "Crossfeed",
        description: `
            Includes the traditional BS2B (Bauer stereophonic-to-binaural DSP) mode and a more advanced convolution-based HRTF approach.
        `
    },
    soundstageWideness: {
        title: "Soundstage Wideness",
        description: `
            An algorithm that detects stereo phase relation in a several spectral regions, and enhances the stereo soundstage without affecting vocal integrity.
        `
    },
    reverb: {
        title: "Reverb",
        description: `
            Complex reverberation IIR network (Progenitor 2).
        `
    },
    equalizer: {
        title: "Equalizer",
        description: `
            15 band equalizer.
        `
    }
};