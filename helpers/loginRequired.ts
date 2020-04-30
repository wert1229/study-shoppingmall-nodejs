import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        res.redirect('/account/login');
    } else {
        return next();
    }
}
