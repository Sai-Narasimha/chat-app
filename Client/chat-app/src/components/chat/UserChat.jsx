import React, { useContext } from 'react'
import { Stack } from 'react-bootstrap'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import avatar from '../../assets/avatar.svg'
import { ChatContext } from '../../context/ChatContext';
export const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user)
    const { onlineUsers } = useContext(ChatContext)
    return (
        <Stack direction='horizontal' gap={3} className="user-card align-items-center p-2 justify-content-between">
            <div className='d-flex'>
                <div className='me-2'>
                    <img src={avatar} height={"35px"} />
                </div>
                <div className="text-content">
                    <div className="name" >{recipientUser?.name}</div>
                    <div className="text">text message</div>
                </div>
            </div>
            <div className='d-flex flex-column align-items-end'>
                <div className="date">12/12/2023</div>
                <div className="this-user-notification">1</div>
                <span className={onlineUsers?.some((u) => u.userId === recipientUser?._id) ? 'user-online' : ""}></span>
            </div>

        </Stack>
    )
}
