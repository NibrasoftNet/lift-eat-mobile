import { UserProps } from "./user.type";

export type SessionProps = {
    token: string | null;
    tokenExpire: number | null;
    user: UserProps | null;
}