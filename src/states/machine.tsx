import { createMachine, assign } from 'xstate'

export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  RUNNING: 'running',
  PAUSED: 'paused',
}

export const machine = createMachine({
  id: 'test',
  initial: STATES.IDLE,
  context: {
    count: 1,
    data: undefined,
    error: undefined as string | undefined,
    random: 0,
  },
  states: {
    [STATES.IDLE]: {
      exit: () => {
        console.log('leaving idle')
      },
      on: {
        START: {
          target: [STATES.LOADING],
          actions: assign({
            data: ({ event }) => event.data,
          }),
        },
      },
    },
    [STATES.LOADING]: {
      entry: assign({
        count: ({ context }) => context.count + 1,
        random: () => {
          console.log('entering loading')
          return Math.random()
        },
      }),
      invoke: {
        src: 'fetchData',
        input: ({ event }) => ({ payload: event.payload }),
        onDone: {
          target: STATES.RUNNING,
          actions: assign({
            data: ({ event }) => event.output,
            error: undefined,
          }),
        },
        onError: {
          target: STATES.IDLE,
          actions: assign({
            error: ({ event }) => {
              const err =
                (event as { data?: unknown; error?: unknown }).data ??
                (event as { data?: unknown; error?: unknown }).error ??
                event
              if (err instanceof Error) {
                return err.message
              }
              return typeof err === 'string' ? err : JSON.stringify(err)
            },
          }),
        },
      },
    },
    [STATES.RUNNING]: {
      on: {
        STOP: STATES.IDLE,
        PAUSE: {
          target: STATES.PAUSED,
          guard: ({ context }) => context.count % 2 === 0,
        },
      },
    },
    [STATES.PAUSED]: {
      on: {
        RESUME: STATES.IDLE,
        STOP: STATES.IDLE,
      },
    },
  },
})
