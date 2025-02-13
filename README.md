# DeckSP

DeckSP is a DSP plugin for Steam Deck. It provides a suite of audio effects that are easily manageable in game mode. The plugin is built on top of [JamesDSP for Linux](https://github.com/Audio4Linux/JDSP4Linux)*, offering access to most of its effects and features, along with some additional features specifically for the Steam Deck.

<sub><i>*DeckSP uses the flatpak version of JamesDSP. V2.6.1 is required. Installation/uninstallation is automatically handled by the plugin.</i></sub>

## Features
### Effects

- **Limiter**
- **Equalizer** 15 band EQ
- **Dynamic Range Compander** (Compressor/ Expander)
- **Stereo**
  - Wideness
  - Crossfeed
- **Reverb**
- **Dynamic Bass** (Frequency-detecting bass-boost)
- **Tube Modeling** (Analog harmonics modeling)

### Profiles
Individual profiles that encompass the settings for all effects.

- **Automatic Profiles**: DeckSP can automatically apply audio profiles on a per game basis.
- **Manual Profiles**: You can also manually create and apply custom profiles.

## Installation

To install DeckSP, follow these steps:

1. Install [Decky Loader](https://wiki.deckbrew.xyz/en/user-guide/install) ([Info](https://wiki.deckbrew.xyz/en/user-guide/home) / [Github](https://github.com/SteamDeckHomebrew/decky-loader)) on your Steam Deck.
2. Download and install the DeckSP plugin from the [Decky Plugin Store](https://wiki.deckbrew.xyz/en/user-guide/plugin-store).



## Usage

To use DeckSP, navigate to the plugin in Decky through the Quick Access Menu.

The plugin is organized into multiple pages:

- **Main Page**: Manage profiles.
  - When running a game, toggle "Use per-game profile" to create a new profile for the current game, which will be automatically applied whenever the game is running.
  - Use "Manually apply profile" to apply a specific profile (either auto-generated or custom-named profile), overriding the per-game profile option.  
    <sub><i>When enabled an index finger icon will appear next to the profile to indicate that it is manually applied.</i></sub>  
    <br/>
- **Effect Pages**: Each page is dedicated to a specific effect or group of similar effects.
  - Adjust effect parameters as desired.
  - Each effect can be toggled on/off individually.
  
  <sub><i>All changes affect the currently applied profile.</i></sub>

## Credits

DeckSP relies on [JamesDSP for Linux](https://github.com/Audio4Linux/JDSP4Linux), developed by Tim Schneeberger ([@thepbone](https://github.com/thepbone)), as the backend for audio processing. JamesDSP for Linux is based on the original [JamesDSP](https://github.com/james34602/JamesDSPManager) project for Android, initially published by James Fung ([@james34602](https://github.com/james34602)).

Special thanks to the developers of both projects for their excellent work and contributions to the open-source community.

## License

This project is licensed under the GPLv3 License.