import { focusManager } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Platform, AppState, AppStateStatus } from 'react-native'

function onStatusChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

export function useAppState() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onStatusChange)
    return () => subscription.remove()
  }, [])
}
