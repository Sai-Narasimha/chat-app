import React, { useContext } from 'react'
import { Container, Nav, Stack, Navbar } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Notification } from './chat/Notification'

export const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext)
    return (
        <Navbar bg='dark'>
            <Container>
                <h2>
                    <Link to='/' className='link-light text-decoration-none'>ChatApp</Link>
                </h2>
                {user && <span className='text-success font-bold'>Logged in as {user.name}</span>}
                <Nav>
                    {user &&
                        <>
                            <Notification />

                            <Link onClick={() => logoutUser()} to='/login ' className='link-light text-decoration-none'>Logout</Link>
                        </>
                    }
                    <Stack direction='horizontal' gap={3}>
                        {!user &&
                            <>
                                <Link to='/login ' className='link-light text-decoration-none'>Login</Link>
                                <Link to='/register' className='link-light text-decoration-none'>Register</Link>
                            </>
                        }

                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    )
}
