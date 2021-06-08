import { Router } from 'express';
import { UserRoutes } from './UserRoutes';

export const appRoutes: Router[] = [UserRoutes.getInstance().getRouter()];
