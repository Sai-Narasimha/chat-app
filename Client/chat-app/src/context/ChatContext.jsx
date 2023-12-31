import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from 'socket.io-client'
export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [userChatsError, setUserChatsError] = useState(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [potentialChats, setPotentialChats] = useState(null)
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState(null)
    const [notifications, setNotifications] = useState([])
    const [allUsers, setAllUsers] = useState([])


    useEffect(() => {
        const newSocket = io("http://localhost:4000")
        setSocket(newSocket)
        return () => newSocket.disconnect()
    }, [user])

    // add online users
    useEffect(() => {
        if (socket === null) return
        socket.emit('addNewUser', user?._id)
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res)
        })
        return () => {
            socket.off('getOnlineUsers')
        }
    }, [socket])

    // send message
    useEffect(() => {
        if (socket === null) return
        const recipeintId = currentChat?.members?.find((id) => id !== user?._id)
        socket.emit("sendMessage", { ...newMessage, recipeintId })

    }, [newMessage])

    // receive message
    useEffect(() => {
        if (socket === null) return;
        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            setMessages(prev => [...prev, res])
        })
        socket.on("getNotification", (res) => {
            console.log('res: ', res);
            const isChatOpen = currentChat?.members?.find((id) => id === res.senderId)
            console.log('isChatOpen: ', isChatOpen);
            if (isChatOpen) {
                setNotifications(prev => [{ ...res, isRead: true }, ...prev])
            }
            else {
                setNotifications(prev => [res, ...prev])
            }
        })
        return () => {
            socket.off('getMessage')
            socket.off('getNotification')
        }


    }, [socket, currentChat])


    useEffect(() => {

        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`)
            if (response?.error) return console.log("Error fetching users", response);

            const pChats = response?.filter((u) => {
                let isChatCreated = false;

                if (user?._id === u?._id) return false
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat?.members[0] === u?._id || chat?.members[1] === u?._id
                    })
                }
                return !isChatCreated
            })
            setPotentialChats(pChats)
            setAllUsers(response)
        }
        getUsers()
    }, [userChats])

    useEffect(() => {
        const getUsersChats = async () => {
            if (user?._id) {
                setIsChatLoading(true)
                setUserChatsError(null)
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                setIsChatLoading(false)
                if (response.error) {
                    return setUserChatsError(response?.error)
                }
                setUserChats(response)
            }
        }
        getUsersChats()
    }, [user, notifications])

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true)
            setMessagesError(null)
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
            console.log('response: ', response);
            setIsMessagesLoading(false)
            if (response.error) {
                return setMessagesError(response?.error)
            }
            setMessages(response)
        }
        getMessages()
    }, [currentChat])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("please enter text....")
        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({ chatId: currentChatId, senderId: sender._id, text: textMessage }))
        if (response.error) {
            return setSendTextMessageError(response)
        }
        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage("")
    }, [])


    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({ firstId, secondId }))
        if (response.error) return console.log("error occured while creating chat", response.error)
        setUserChats((prev) => [...prev, response])
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const markNotificationsAsRead = useCallback((notifications) => {
        console.log('notifications: ', notifications);
        const mNotifications = notifications?.map((n) => { return { ...n, isRead: true } })
        setNotifications(mNotifications)
    }, [])

    const markNoficationAsRead = useCallback((n, notifications, userChats, user) => {
        // find chat to open
        const desiredChat = userChats?.find((chat) => {
            const chatMemebers = [user?._id, n?.senderId]
            const isDesiredChat = chat?.members?.every(member => {
                return chatMemebers.includes(member)
            })
            return isDesiredChat
        })
        // mark notification as read
        const mNotifications = notifications?.map((ele) => {
            if (ele._id === n._id) {
                return { ...n, isRead: true }
            }
            else { return ele }

        })
        updateCurrentChat(desiredChat)
        setNotifications(mNotifications)
    }, [])

    const markThisUserNotificationAsRead = (thisUserNotifications, notifications) => {
        const mNotifications = notifications.map((ele) => {
            let notification;
            thisUserNotifications.forEach((n) => {
                if (ele._id === n._id) notification = { ...n, isRead: true }
                else return ele
            })
            return notification
        })
        setNotifications(mNotifications)
    }

    return <ChatContext.Provider value={{ userChats, userChatsError, isChatLoading, potentialChats, messages, isMessagesLoading, messagesError, currentChat, onlineUsers, notifications, allUsers, sendTextMessage, updateCurrentChat, createChat, markNotificationsAsRead, markNoficationAsRead, markThisUserNotificationAsRead }}>{children}</ChatContext.Provider>
}