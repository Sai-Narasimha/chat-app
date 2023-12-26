import React, { useContext } from 'react'
import { Container, Stack } from 'react-bootstrap'
import { ChatContext } from '../context/ChatContext'
import { UserChat } from '../components/chat/UserChat'
import { AuthContext } from '../context/AuthContext'
import { PotentialChats } from '../components/chat/PotentialChats'
import { ChatBox } from '../components/chat/ChatBox'

export const Chat = () => {
    const { userChats, isChatsLoading, updateCurrentChat } = useContext(ChatContext)
    const { user } = useContext(AuthContext)
    return (
        <Container>
            <PotentialChats />
            {userChats?.length < 1 ? null : <Stack direction='horizontal' gap={4} className='aligin-items-start'>
                <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
                    {isChatsLoading && <p>loading....</p>}
                    {userChats?.map((chat, index) => (
                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                            <UserChat chat={chat} user={user} />
                        </div>
                    ))}
                </Stack>
                <ChatBox />
            </Stack>}</Container>
    )
}
