import { useMachine } from '@xstate/react'
import { machine } from '../states/machine'
import { Button } from './ui/button'
import { fromPromise } from 'xstate'

export function MyComponent() {
  const [state, send] = useMachine(
    machine.provide({
      actors: {
        fetchData: fromPromise(({ input }) => {
          return fetch(`https://jsonplaceholder.typicode.com/todos/${input.count}`).then((response) => response.json())
        }),
      },
    }),
  )

  const canStart = state.can({ type: 'START' })
  const canStop = state.can({ type: 'STOP' })
  const canPause = state.can({ type: 'PAUSE' })

//   console.log('Current State:', state)

  return (
    <div>
        {JSON.stringify(state.context)}

      <Button type="button" onClick={() => send({ type: 'START' })} disabled={!canStart}>
        Start
      </Button>

      <Button type="button" onClick={() => send({ type: 'STOP' })} disabled={!canStop}>
        Stop
      </Button>

      <Button type="button" onClick={() => send({ type: 'PAUSE' })} disabled={!canPause}>
        Pause
      </Button>
    </div>
  )
}
