import { atom } from 'recoil'

export interface AuthModalState {
  open: boolean
  type: 'login' | 'signup' | 'resetPassword'
}

export const authModalState = atom<AuthModalState>({
  key: 'authModalState',
  default: {
    open: false,
    type: 'login',
  },
})
