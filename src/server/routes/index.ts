import { Router } from 'express';
import { userRouter } from './UserRoutes';

export const appRoutes: Router[] = [userRouter];
