import { createMachine, sendTo } from 'xstate'
import { ratingMachine } from '@/machines/rating-machine.ts'

export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
}

export const globalMachine = createMachine({
  id: 'global',
  initial: STATES.IDLE,
  context: ({ spawn }) => ({
    rating: spawn(ratingMachine, { id: 'rating-machine' }),
    blocking: null,
  }),
  states: {
    [STATES.IDLE]: {
      on: {
        INIT: {
          target: STATES.READY,
          actions: [
            sendTo('rating-machine', (args) => {
              return { ...args.event }
            }),
          ],
        },
      },
    },
    [STATES.READY]: {
      entry: (args) => console.log('Global FSM entered READY with args:', args),
    },
  },
})
