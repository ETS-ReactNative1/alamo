import React from 'react';
import { detect } from 'detect-browser'

const MicrophoneActivation = (props) => {
    const [support, setSupport] = React.useState('')
    const browser = detect();

    React.useEffect(() => {
        if (browser.name === 'chrome') {
            setSupport('https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop&hl=en')
        } else if (browser.name === 'safari') {
            setSupport('https://support.apple.com/en-ie/guide/mac-help/mchla1b1e1fe/mac')
        } else if (browser.name === 'firefox') {
            setSupport('https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions')
        }
    })

    return(
        <div className="container-fluid microphone-message">
            <div className="row">
                <div className="col">
                    <h3 className="thin font-color">Please enable your microphone in the browser.</h3>
                </div>
                {support.length > 0 ?
                    <div className="col-2 font-color thin" style={{minWidth: '150px', textAlign: 'right'}}>
                    <a href={support} target="_blank">
                        Learn more 
                        <i className="fas fa-info-circle" style={{padding: '10px'}}></i>
                    </a>
                </div>
                : null }
            </div>
        </div>
    )
}

export default MicrophoneActivation;
