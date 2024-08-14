import express from 'express';
import {
    fetchChats,
    fetchChat,
    fetchChatById,
    fetchUserGroups,
    createGroup,
    leftGroup,
    joinGroup,
    addGroupMember,
    deleteGroup,
    updateGroup
} from "../controllers/chat-controller.js"
import { authorizationHandler } from '../utils/authorizationHandler.js';

const router = express.Router();

router.get('/', authorizationHandler, fetchChats);  // fetch all the chats of a user

router.get('/fetchGroups', authorizationHandler, fetchUserGroups); // fetch all the groups of a user

router.get('/fetchChatById/:chatId', authorizationHandler, fetchChatById); // fetch chat by chatId

router.get('/fetchChat/:userId', authorizationHandler, fetchChat); // fetch chat or create chat with a user (between current user and the user with userId)

router.post('/createGroup', authorizationHandler, createGroup); // create a group

router.get('/leftGroup/:groupId', authorizationHandler, leftGroup); // left a group

router.get('/joinGroup/:groupId', authorizationHandler, joinGroup) // join a group

router.post('/addMember', authorizationHandler, addGroupMember) // add member

router.delete('/delete-group/:groupId', authorizationHandler, deleteGroup) // delete group

router.put('/update-group/:groupId', authorizationHandler, updateGroup) // update group

export default router;