import { createMachine, assign } from 'xstate'

export const machine = createMachine({
  id: 'test',
  initial: 'idle',
  context: {
    count: 0,
    data: undefined,
    error: undefined as string | undefined,
  },
  states: {
    idle: {
      on: {
        START: {
          target: 'loading',
          actions: assign({
            count: ({ context }) => {
              return context.count + 1
            },
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: 'fetchData',
        input: ({ context }) => context,
        onDone: {
          target: 'running',
          actions: assign({
            data: ({ event }) => event.output,
            error: undefined,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: ({ event }) => {
              const err = (event as { data?: unknown; error?: unknown }).data ?? 
                         (event as { data?: unknown; error?: unknown }).error ?? 
                         event;
              if (err instanceof Error) {
                return err.message;
              }
              return typeof err === 'string' ? err : JSON.stringify(err);
            },
          }),
        },
      },
    },
    running: {
      on: {
        STOP: 'idle',
        PAUSE: 'paused',
      },
    },
    paused: {
      on: {
        RESUME: 'running',
        STOP: 'idle',
      },
    },
  },
})
