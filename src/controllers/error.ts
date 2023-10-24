import { Request, Response, NextFunction } from 'express';

export const get500Page = (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).render('500', {
      docTitle: 'Server Error',
      path: '/500',
      msg: error.message
    });
  }

  export const getPageNotFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).render('404', 
    {
        docTitle: 'NotFound', 
        path: '/404',
    });

}