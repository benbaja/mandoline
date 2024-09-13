import React, { ChangeEvent, useEffect, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"

interface SettingsProps {
    pickedMicState: [ string | undefined, React.Dispatch<React.SetStateAction<string | undefined>> ]
}

const Settings: React.FC<SettingsProps> = ({pickedMicState}) => {
    const [ micDevices, setMicDevices ] = useState<{name: string, id: string}[]>([])
    const [ pickedMic, setPickedMic ] = pickedMicState

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
        <div>
            <select onChange={handleMicChange} value={pickedMic}>
                {micDevices.map(device => {
                    return <option value={device.id}>{device.name}</option>
                }
            )}
      </select>
        </div>
    )
}

export default Settings