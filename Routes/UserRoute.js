import express from 'express'
import { forgotPass, getUserById, resetpassword, signUp, signin, signout } from '../Controllers/auth.controller.js';
const router=express.Router();
router.post('/register',signUp);
router.post('/signin',signin);
router.get('/signout',signout);
router.get('/getuser/:id',getUserById)
router.post('/forgotpass',forgotPass)
router.post('/reset-password/:token',resetpassword)

export default router