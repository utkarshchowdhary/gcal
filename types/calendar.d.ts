import { TClientData, TTokenData } from "./oauth2";

type TAttendee = {
    email: string;
    displayName?: string;
};

export type TCalendarCreateEvent = {
    allDay?: boolean;
    rptFrq?: "na" | "dy" | "wk" | "mh" | "qr" | "yr";
    calType: "google_calendar";
    title?: string;
    location?: string;
    description?: string;
    tmFrm?: string;
    tmTo?: string;
    date: string;
    timeZone: string;
    participants: TAttendee[];
};

type CreateEventSuccess = {
    status: "success";
    data: { eventLink?: string | null };
    statusCode?: never;
    message?: never;
};

type CreateEventError = {
    status: "error";
    statusCode: number;
    message: string;
    data?: never;
};

export type TCreateEvent = (
    logPrefix: string,
    event: TCalendarCreateEvent,
    clientData: TClientData,
    tokenData: TTokenData
) => Promise<CreateEventSuccess | CreateEventError>;
