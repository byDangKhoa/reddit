import { authModalState } from '@/atoms/AuthModalAtom'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
} from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import AuthInputs from './AuthInputs'
import ResetPassword from './ResetPassword'

export default function AuthModal() {
  const [modalState, setModalState] = useRecoilState(authModalState)
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }))

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>
            {modalState.type === 'login' && 'Login'}
            {modalState.type === 'signup' && 'Sign up'}
            {modalState.type === 'resetPassword' && 'Reset Password'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            pb={6}>
            <Flex
              direction='column'
              alignItems='center'
              justifyContent='center'
              width='70%'>
              {modalState.type === 'login' || modalState.type === 'signup' ? (
                <>
                  {/* <OAuthButtons />
                  OR */}
                  <AuthInputs />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
