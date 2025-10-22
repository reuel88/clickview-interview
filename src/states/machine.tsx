import { createMachine, assign } from 'xstate'

export const machine = createMachine({
  id: 'test',
  initial: 'idle',
  context: {
    count: 1,
    data: undefined,
    error: undefined as string | undefined,
    random: 0
  },
  states: {
    idle: {
        exit: () => { console.log('leaving idle') },
      on: {
        START: {
          target: 'loading',
          actions: assign({
            count: ({ event }) => event.count,
            data: ({ event }) => event.data,
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    loading: {
        entry:assign({
            random: () =>{
                console.log('entering loading');
                return Math.random()},
        }),
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
        PAUSE: {
          target: 'paused',
          guard: ({ context }) => context.count % 2 === 0,
        },
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
