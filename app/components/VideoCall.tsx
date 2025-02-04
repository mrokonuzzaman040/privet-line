import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface VideoCallProps {
  isCallActive: boolean
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  onEndCall: () => void
}

export function VideoCall({ isCallActive, localStream, remoteStream, onEndCall }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  if (!isCallActive) return null

  return (
    <div className="fixed bottom-4 right-4 w-64 flex flex-col space-y-2">
      <div className="relative">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-48 bg-black rounded-lg" />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-2 right-2 w-20 h-15 bg-gray-800 rounded-md"
        />
      </div>
      <Button variant="destructive" onClick={onEndCall}>
        End Call
      </Button>
    </div>
  )
}

