import { FC } from 'react'
import ExternalLink from '../generic/ExternalLink'
import { PLUGIN_NAME } from '../../defines/constants'
import { Navigation } from '@decky/ui'
import { ScrollableWindowRelative } from '../generic/ScrollableWindow'

export const InfoPage: FC<{}> = () => {
    return (
        <div style={{
            display: 'flex',
            height: '-webkit-fill-available',
            margin: 'var(--basicui-header-height) 0px var(--gamepadui-current-footer-height)',
        }}>
            <ScrollableWindowRelative onCancel={() => Navigation.NavigateBack()}>
                <div style={{ padding: '0px 30px', fontSize: '13px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>JamesDSP Info</h3>
                        <div style={{ paddingLeft: '30px', fontSize: '.9em' }}>
                            {PLUGIN_NAME} uses <ExternalLink href="https://github.com/Audio4Linux/JDSP4Linux">JamesDSP for Linux</ExternalLink> for the signal processing. All effects are built into JamesDSP, and {PLUGIN_NAME} provides an interface to control them. {PLUGIN_NAME} uses the flatpak version of JamesDSP. The plugin handles installation, uninstallation and updates automatically. Please be aware of this if you normally use JamesDSP on its own in desktop mode.
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>Usage</h3>
                        <ul>
                            <li>
                                <strong>Main Page</strong>: Manage profiles.
                                <ul>
                                    <li>When running a game, toggle "Use per-game profile" to create a new profile for the current game. This profile will be automatically applied whenever the game is running.</li>
                                    <li>
                                        Use "Manually apply profile" to apply a specific profile (either auto-generated or custom-named), overriding the per-game profile option.
                                        <br />
                                        <sub><i>When enabled, an index finger icon will appear next to the profile to indicate that it is manually applied.</i></sub>
                                    </li>
                                </ul>
                            </li>
                            <br />
                            <li>
                                <strong>Effect Pages</strong>
                                <ul>
                                    <li>Adjust effect parameters as desired.</li>
                                    <li>Each effect can be toggled on/off individually.</li>
                                </ul>
                                <sub><i>All changes affect the currently applied profile.</i></sub>
                            </li>
                        </ul>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>Desktop Mode</h3>
                        <div style={{ paddingLeft: '30px', fontSize: '.9em' }}>
                            <div>
                                The "Enable In Desktop Mode" toggle allows {PLUGIN_NAME} to work with desktop Steam. JamesDSP will be started and visible in the system tray. Profiles will be applied accordingly as per users settings. However, there are no plugin controls through desktop Steam. Adjusting effect parameters directly through the JamesDSP gui will work, but no changes will be saved to the current profile. Profiles are strictly managed through {PLUGIN_NAME} but they rely on what JamesDSP calls presets.
                            </div>
                            <sub><i>Important: Do not delete or rename any presets prefixed with "decksp" in JamesDSP gui.</i></sub>
                        </div>
                    </div>
                </div>
            </ScrollableWindowRelative>
        </div>
    )
};



