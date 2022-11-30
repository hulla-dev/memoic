import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Platform } from 'react-native'

export function useOnline() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
          setOnline(!!state.isConnected)
        })
      })
    }
  }, [])
}
