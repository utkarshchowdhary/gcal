import winston from "winston";
import { GaxiosError } from "googleapis-common";
import { auth, calendar } from "@googleapis/calendar";

import { TCalendarCreateEvent, TCreateEvent } from "./types/calendar";
import { TTokenData } from "./types/oauth2";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

const getErrorDetails = (
    error: unknown
): { message: string; stack?: string } => {
    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack,
        };
    }
    return {
        message: String(error),
    };
};

const getGaxiosErrorCode = (error: unknown): number => {
    if (error instanceof GaxiosError) return error.status || 500;
    return 500;
};

const getDateAttr = (ad: TCalendarCreateEvent["allDay"]) =>
    ad ? "date" : "dateTime";

const buildDateTime = (event: TCalendarCreateEvent, time?: string) => ({
    [getDateAttr(event.allDay)]: event.allDay
        ? event.date
        : `${event.date}T${time}:00`,
    ...(!event.allDay && { timeZone: event.timeZone }),
});

const mapFrequency = (
    rptFrq: Exclude<NonNullable<TCalendarCreateEvent["rptFrq"]>, "na">
) => {
    const map = {
        dy: "DAILY",
        wk: "WEEKLY",
        mh: "MONTHLY",
        qr: "MONTHLY;INTERVAL=3",
        yr: "YEARLY",
    };
    return map[rptFrq];
};

export const createEvent: TCreateEvent = async (
    logPrefix,
    event,
    clientData,
    tokenData
) => {
    const {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_url: redirectURL,
        scope,
    } = clientData;
    const {
        token_type: tokenType = "Bearer",
        access_token: accessToken,
        issued_at: issuedAt,
        expires_in: expiresIn,
        expiry_date: expiryDate,
        refresh_token: refreshToken,
    } = tokenData;

    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectURL);

    oauth2Client.setCredentials({
        scope,
        token_type: tokenType,
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date:
            expiryDate ||
            (issuedAt && expiresIn && issuedAt + expiresIn * 1000),
    });

    let refreshedTokens: TTokenData | undefined;

    oauth2Client.on("tokens", (tokens) => {
        const issuedAt = new Date().getTime();
        refreshedTokens = {
            ...tokens,
            refresh_token: refreshToken,
            issued_at: issuedAt,
            ...(tokens.expiry_date && {
                expiry_date: tokens.expiry_date,
                expires_in: Math.floor((tokens.expiry_date - issuedAt) / 1000),
            }),
        };
        logger.info(`${logPrefix} Refreshed tokens received.`, {
            logAs: "enc",
            tokens,
        });
    });

    try {
        const cal = calendar({
            version: "v3",
            auth: oauth2Client,
        });

        const start = buildDateTime(event, event.tmFrm);
        const end = buildDateTime(event, event.tmTo);
        const calendarEvent = {
            summary: event.title,
            location: event.location,
            description: event.description,
            start,
            end,
            attendees: event.participants,
            ...(event.rptFrq &&
                event.rptFrq !== "na" && {
                    recurrence: [`RRULE:FREQ=${mapFrequency(event.rptFrq)}`],
                }),
        };

        const response = await cal.events.insert({
            calendarId: "primary",
            requestBody: calendarEvent,
            maxAttendees: 1,
            sendUpdates: "all",
        });

        logger.info(
            `${logPrefix} Successfully created a Google Calendar event.`
        );

        return {
            status: "success",
            data: { eventLink: response.data.htmlLink },
        };
    } catch (error) {
        const { message, stack } = getErrorDetails(error);
        logger.error(
            `${logPrefix} Failed to create Google Calendar event. Error: ${message}. Stack trace: ${stack}`
        );
        return {
            status: "error",
            statusCode: getGaxiosErrorCode(error),
            message,
        };
    } finally {
        if (refreshedTokens) {
            // Save refreshed tokens here
        }
    }
};
