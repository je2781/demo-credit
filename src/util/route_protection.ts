export const isAuth = (req: any, res: any, next: any) => {
    if(!req.session){
        const err = new Error('Not Authenticated');
        throw err;
    }

    if(!req.session.isLoggedIn){
        res.status(302).redirect('/login');
    }

    next();
}