import { Scanner, User } from "../../models";

declare global {
    namespace Express {
        interface Request {
            scanner?: Scanner;
            user?: User;
        }
    }
}

