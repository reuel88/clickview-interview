import { useEffect } from 'react'
import { useMachine, useSelector } from '@xstate/react'
import { type SnapshotFrom } from 'xstate'
import { globalMachine } from '@/machines/global-machine'
import { ratingMachine } from '@/machines/rating-machine'
import { Button } from '@/ui/button.tsx'

export function GlobalComponent() {
  const [globalSnap, globalSend] = useMachine(globalMachine)

  // Child actor ref (may be undefined before INIT completes)
  const ratingRef = globalSnap.context.rating

  // Safe check; false until the child exists and can accept OPEN_MODAL
  const canOpen = useSelector(ratingRef, (snap) =>
    (snap as SnapshotFrom<typeof ratingMachine>).can({ type: 'OPEN_MODAL' }),
  )

  useEffect(() => {
    globalSend({
      type: 'INIT',
      payload: { user: { id: 'user-123', name: 'John Doe' } },
    })
  }, [globalSend])

  return (
    <div>
      {canOpen && (
        <Button onClick={() => ratingRef?.send({ type: 'OPEN_MODAL' })}>OPEN MODAL</Button>
      )}
      {!canOpen && (
        <Button onClick={() => ratingRef?.send({ type: 'CLOSE_MODAL' })}>CLOSE MODAL</Button>
      )}
    </div>
  )
}
