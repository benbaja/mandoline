import React, { ChangeEvent, useEffect, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"
import styles from "../assets/styles.module.scss"

interface SettingsProps {
    pickedMicState: [ string | undefined, React.Dispatch<React.SetStateAction<string | undefined>> ]
    showState: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
}

const Settings: React.FC<SettingsProps> = ({pickedMicState, showState}) => {
    const [ micDevices, setMicDevices ] = useState<{name: string, id: string}[]>([])
    const [ pickedMic, setPickedMic ] = pickedMicState
    const [ show, setShow ] = showState

    useEffect(() => {
        navigator.permissions.query({ name: "microphone" as PermissionName }).then(permissionResult => {
          console.log("Mic permission: ", permissionResult.state)
          if (permissionResult.state != "granted") {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          }
        })
        RecordPlugin.getAvailableAudioDevices().then(devices => {
          const devicesList : {name: string, id: string}[] = []
          devices.forEach(device => {
            devicesList.push({name: device.label, id: device.deviceId})
          })
          setMicDevices(devicesList)
        })
        // cleanup
        return () => {
          setMicDevices([])
        }
      }, [])
    
      const handleMicChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPickedMic(event.target.value)
    }

    return (
        <div className={styles.settingsPanel} style={{display: show ? "inline-block" : "none"}} data-cy="settingsPanel">
            <div className={styles.settingsHeader}>
              Settings
              <button onClick={() => setShow(false)} data-cy="sCloseBtn">X</button>
            </div>
            <label>Microphone:   </label>
            <select onChange={handleMicChange} value={pickedMic} data-cy="sMicOptions">
                {micDevices.map(device => {
                    return <option value={device.id} key={device.id}>{device.name}</option>
                }
            )}
            </select>
        </div>
    )
}

export default Settings