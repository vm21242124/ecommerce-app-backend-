import express from 'express'
import { getUserById, signUp, signin, signout } from '../Controllers/auth.controller.js';
const router=express.Router();
router.post('/register',signUp);
router.post('/signin',signin);
router.get('/signout',signout);
router.get('/getuser/:id',getUserById)

export default router