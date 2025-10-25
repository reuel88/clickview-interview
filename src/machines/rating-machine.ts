import { createMachine, assign, fromPromise } from 'xstate'

export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',

  NOT_PERMITTED: 'not_permitted',
  PERMITTED: 'permitted',
  ALREADY_RATED: 'already_rated',

  MODAL_OPEN: 'modal_open',
  MODAL_CLOSED: 'modal_closed',
}

export const ratingMachine = createMachine({
  id: 'rating',
  initial: STATES.IDLE,
  context: {
    state: null as string | null,
    auxiliary: null as string | null,
  },
  states: {
    [STATES.IDLE]: {
      entry: (args) => console.log('FSM entered IDLE with args:', args),
      on: {
        INIT: {
          target: STATES.LOADING,
          actions: assign({
            state: ({ event }) => event.state,
            auxiliary: ({ event }) => event.auxiliary,
          }),
        },
      },
    },
    [STATES.LOADING]: {
      entry: (args) => console.log('FSM entered LOADING with args:', args),
      invoke: {
        src: 'fetchData',
        input: (args) => ({ payload: args.event.payload }),
        onDone: [
          {
            target: STATES.NOT_PERMITTED,
            guard: ({ event }) => event.output.state === 'NOT_PERMITTED',
            actions: assign({
              state: (args) => {
                console.log('FSM INIT event :', args)
                return args.event.output.state
              },
              auxiliary: ({ event }) => event.output.auxiliary,
            }),
          },
          {
            target: STATES.PERMITTED,
            guard: ({ event }) => {
              console.log('FSM: PERMITTED', event)
              return event.output.state === 'PERMITTED'
            },
            actions: assign({
              state: ({ event }) => event.output.state,
              auxiliary: ({ event }) => event.output.auxiliary,
            }),
          },
          {
            target: STATES.ALREADY_RATED,
            guard: ({ event }) => event.output.state === 'ALREADY_RATED',
            actions: assign({
              state: ({ event }) => event.output.state,
              auxiliary: ({ event }) => event.output.auxiliary,
            }),
          },
        ],
      },
    },
    [STATES.NOT_PERMITTED]: {
      entry: (args) => console.log('FSM entered NOT_PERMITTED with args:', args),
      type: 'final',
    },
    [STATES.PERMITTED]: {
      entry: (args) => console.log('FSM entered PERMITTED with args:', args),
      on: {
        OPEN_MODAL: {
          target: STATES.MODAL_OPEN,
          actions: () => {
            alert('Modal Opened')
          },
        },
      },
    },
    [STATES.ALREADY_RATED]: {
      entry: (args) => console.log('FSM entered ALREADY_RATED with args:', args),
      type: 'final',
    },
    [STATES.MODAL_OPEN]: {
      entry: (args) => console.log('FSM entered MODAL_OPEN with args:', args),
      on: {
        CLOSE_MODAL: STATES.PERMITTED,
      },
    },
  },
}).provide({
  actors: {
    fetchData: fromPromise(async ({ input }) => {
      console.log('FSM fetchData from args:', input)

      return {
        state: 'PERMITTED',
        auxiliary: 'Some auxiliary data',
      }
    }),
  },
})
