import express from 'express';
import  {
    authUser,
    userRegisteration,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(userRegisteration).get(protect, admin, getUsers);
router.route('/logout').post(logoutUser);
router.route('/auth').post(authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;