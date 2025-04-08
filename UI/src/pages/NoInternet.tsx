import React, { useSyncExternalStore } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

interface Props {
    children: React.ReactNode
}

function getSnapshot() {
  return navigator.onLine
}

export function NoInternet({children}: Props) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot)

  if (isOnline) {
    return <>{children}</>
  }

  return (
    <div className="fixed h-full w-full inset-0 bg-background flex items-center justify-center p-4" role="alert">
      <div className="max-w-md w-full bg-card text-card-foreground rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-destructive/10 p-3 rounded-full">
            <WifiOff className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold">No Internet Connection</h2>
        </div>
        <p className="text-muted-foreground">
          It seems you're offline. Please check your internet connection and try again.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    </div>
  )
}

