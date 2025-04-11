import { ReactElement } from 'react';
import ExternalLink from '../components/generic/ExternalLink';

type EffectDescription = {
    title: string;
    description: ReactElement;
};

export const effectDescriptions: { [key: string]: EffectDescription } = {
    master: {
        title: "Master",
        description: <>
            <strong>Bypass:</strong> Disables all effects.<br /><br />
            <strong>Post gain:</strong> Post gain acts as a digital volume knob for all effects, after they have been applied but before the sound reaches the limiter.
        </>
    },
    limiter: {
        title: "Limiter",
        description: <>
            This output limiter tries to avoid clipping of output (caused by DSP that tries to make part or all of the audio louder than before, if the input is already near maximum).<br /><br />
            <strong>Limiter threshold:</strong> This should be set to -0.1 unless, for some reason, your audio is clipping before digital clipping, in which case you can set it to lower values.<br /><br />
            <strong>Limiter release:</strong> The limiter is only as effective as long as the release time is set. Short release times will lead to audible distortion of the limited sound, especially of low frequencies; an extended release is usually preferred but reduces the volume that can be achieved somewhat. If "pumping" (ducking of limited sound and coming back up over time) becomes objectionable, making the release longer OR shorter can help make the effect less noticeable.
        </>
    },
    dynamicBassBoost: {
        title: "Dynamic Bass Boost",
        description: <>
            Frequency-detecting bass-boost. Automatically sets its own parameters, such as gain, bandwidth, and cut-off frequency by analysing the incoming audio stream.<br /><br />
            <strong>Max gain:</strong> Adjusts the amount of the dynamic bass boost effects.
        </>
    },
    analogModeling: {
        title: "Analog Modeling",
        description: <>
            Oversampled analog modeling is an aliasing-free, even harmonic generator.
        </>
    },
    dynamicRangeCompander: {
        title: "Dynamic Range Compander",
        description: <>
            Highly automated multiband dynamic range adjusting effect.
        </>
    },
    crossfeed: {
        title: "Crossfeed",
        description: <>
            Includes the traditional BS2B (Bauer stereophonic-to-binaural DSP) mode and a more advanced convolution-based HRTF approach.
        </>
    },
    soundstageWideness: {
        title: "Soundstage Wideness",
        description: <>
            An algorithm that detects stereo phase relation in several spectral regions, and enhances the stereo soundstage without affecting vocal integrity.
        </>
    },
    reverb: {
        title: "Reverb",
        description: <>
            Complex reverberation IIR network (Progenitor 2).
        </>
    },
    equalizer: {
        title: "Equalizer",
        description: <>
            15 band equalizer.
        </>
    },
    eel: {
        title: "EEL2 Script",
        description: <>
            EEL2 is a scripting language that powers REAPER's JSFX and LiveProgVST.<br />
            A virtual machine compiles an .eel code file as input and runs the instructions; in simple words, it allows users to program their own audio effects.<br /><br />

            The number of supported operations is enormous. See the virtual machine <ExternalLink href="https://github.com/james34602/EEL_VM">documentation</ExternalLink> which includes the language spec.<br /><br />

            <i><strong>Note from DeckSP dev:</strong><br />
            JamesDSP appears to implement syntax that extends beyond the EEL2 core language to be able to define user configurable parameters that map to sliders in the UI. This seems to (partially) implement <ExternalLink href="https://www.reaper.fm/sdk/js/js.php">REAPER's JSFX spec</ExternalLink>. Slider syntax for the most part follows this spec, with some exceptions (no path, hidden parameter, or shaping fn).<br />
            See preinstalled scripts for specific examples of syntax usage.</i>
        </>
    },
    viper: {
        title: "ViPER-DDC",
        description: <>
            Its main job is to perform parametric equalization on audio, however it requires the user to provide a .vdc file that <ExternalLink href="https://github.com/timschneeb/DDCToolbox">DDCToolbox</ExternalLink> generates.<br /><br />
            ViPER-DDC in JamesDSP is a generalized implementation of second-order section filters, which is slightly different from the implementation in Viper4Android. V4A supports only Peaking parametric; the reason is that V4A uses a share coefficient property of Peaking filter. In contrast, JamesDSP does not have such an assumption.
        </>
    },
    convolver: {
        title: "Convolver",
        description: <>
            Partitioned convolver (Auto segmenting convolution). Select your impulse response file to be convolved. It takes the signal characteristics of the impulse response and applies them to the incoming audio in real-time.<br />
            Supports mono, stereo, full/true stereo (LL, LR, RL, RR) impulse responses.<br /><br />
            <strong>Impulse response optimization:</strong> This parameter attempts to reduce the length of the impulse response as much as possible; the whole point is to reduce latency as much as possible, possibly reducing power consumption.
        </>
    }
};