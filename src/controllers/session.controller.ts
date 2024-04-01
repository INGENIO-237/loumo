import { Service } from "typedi";
import SessionService from "../services/session.services";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/session.schemas";

@Service()
export default class SessionController{
    constructor(private service: SessionService){}

    async createSession(req: Request<{}, {}, CreateSessionInput["body"]>, res: Response){
        this.service.createSession(req.body);
    }
}