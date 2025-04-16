import "express";

declare module "express" {
  export interface Request {
    user?: any; // Add the `user` property to the Request interface
  }
}
