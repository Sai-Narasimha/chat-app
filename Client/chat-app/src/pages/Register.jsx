import React, { useContext } from 'react'
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'

export const Register = () => {
    const { registerInfo, registerError, isRegisterLoading, updateRegisterInfo, registerUser } = useContext(AuthContext)
    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={{ height: '90vh', justifyContent: 'center', paddingTop: '10%' }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>
                            <Form.Control type='text' placeholder='Name' onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />
                            <Form.Control type='email' placeholder='Email' onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />
                            <Form.Control type='password' placeholder='Password' onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />
                            <Button variant="primary" type='submit'>{isRegisterLoading ? "Create Your Account" : "Register"}</Button>
                            {registerError?.error && <Alert variant='warning'><p>{registerError?.message}</p></Alert>}

                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
