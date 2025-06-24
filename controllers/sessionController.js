import { v4 as uuidv4 } from "uuid";

export const createSession = (req, res)=>{
    const session_id = uuidv4();
    res.json({ session_id });
}