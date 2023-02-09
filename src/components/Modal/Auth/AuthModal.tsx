import { authModalState } from '@/atoms/AuthModalAtom'
import { auth } from '@/firebase/clientApp'
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
  Text,
  Divider,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState } from 'recoil'
import AuthInputs from './AuthInputs'
import OAuthButton from './OAuthButton'
import ResetPassword from './ResetPassword'

export default function AuthModal() {
  const [modalState, setModalState] = useRecoilState(authModalState)
  const [user, loading, error] = useAuthState(auth)
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }))

  //control đóng mở login panel
  useEffect(() => {
    if (user) {
      handleClose()
    }
  }, [user])

  return (
    <>
      <Modal size='sm' isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent width='70%'>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            pt={12}
            pb={6}>
            <Flex
              direction='column'
              alignItems='center'
              justifyContent='center'
              width='70%'>
              {modalState.type === 'login' || modalState.type === 'signup' ? (
                <>
                  <Flex pb={6} direction='column'>
                    <Text pb={1} fontWeight={700} width='100%' textAlign='left'>
                      {modalState.type === 'login' && 'Log In'}
                      {modalState.type === 'signup' && 'Sign up'}
                    </Text>
                    <Text fontSize='12px'>
                      By continuing, you agree are setting up a Reddit account
                      and agree to our User Agreement and Privacy Policy.
                    </Text>
                  </Flex>
                  <OAuthButton />
                  <Flex width='100%' align='center'>
                    <Divider borderBottomWidth='0.1px' />
                    <Text color='gray.500' fontWeight='700' padding='2'>
                      OR
                    </Text>
                    <Divider borderBottomWidth='0.1px' />
                  </Flex>
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
