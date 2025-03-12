# Google Calendar API

## Description

This project provides an API for interacting with the Google Calendar, specifically for creating calendar events. It uses the `@googleapis/calendar` library to communicate with the Google Calendar API.

## Features

-   Create Google Calendar events with details such as title, location, description, start and end times, and attendees.
-   Supports all-day events and events with specific timeframes.
-   Handles recurring events with daily, weekly, monthly, quarterly, or yearly frequencies.
-   Refreshes OAuth2 tokens automatically and saves them.

## Prerequisites

-   Node.js installed
-   npm or yarn package manager

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/utkarshchowdhary/gcal.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd gcal
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

## Configuration

Before running the application, you need to configure the OAuth2 client and obtain the necessary credentials.

1.  **Google Cloud Console:**

    -   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    -   Create a new project or select an existing one.
    -   Enable the Google Calendar API.
    -   Create OAuth2 credentials.
    -   Set up the OAuth 2.0 Client ID and Secret.
    -   Configure the redirect URI (e.g., `https://developers.google.com/oauthplayground`).

## Usage

1.  **Import the `createEvent` function:**

    ```typescript
    import { createEvent } from "./index";
    ```

2.  **Call the `createEvent` function with the required parameters:**

    ```typescript
    import { createEvent } from "./index";

    const logPrefix = "[Calendar Event Creation]";
    const eventData = {
        calType: "google_calendar",
        date: "2024-07-22",
        timeZone: "America/Los_Angeles",
        participants: [{ email: "test@example.com" }],
        allDay: false,
        tmFrm: "10:00",
        tmTo: "11:00",
        title: "Sample Event",
        location: "Conference Room",
        description: "A sample event created via the API.",
        rptFrq: "na",
    };

    const clientData = {
        client_id: "YOUR_CLIENT_ID",
        client_secret: "YOUR_CLIENT_SECRET",
        redirect_url: "https://developers.google.com/oauthplayground",
        scope: "https://www.googleapis.com/auth/calendar.events",
    };

    const tokenData = {
        access_token: "YOUR_ACCESS_TOKEN",
        token_type: "Bearer",
        refresh_token: "YOUR_REFRESH_TOKEN",
    };

    createEvent(logPrefix, eventData, clientData, tokenData)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.error(error);
        });
    ```

## Event Schema Validation

The project includes an `eventSchema.json` file that defines the JSON schema for validating calendar event data. This schema ensures that all event objects passed to the `createEvent` function contain the required fields with proper formats:

-   Required fields: `calType`, `date`, `timeZone`, and `participants`
-   Time format validation (HH:MM)
-   Date format validation (YYYY-MM-DD)
-   Email format validation for participants
-   Enumerated values for `calType` and `rptFrq`

You can use this schema with a JSON schema validator library to validate event data before passing it to the `createEvent` function.

## API Reference

### `createEvent`

Creates a Google Calendar event.

```typescript
(
    logPrefix: string,
    event: TCalendarCreateEvent,
    clientData: TClientData,
    tokenData: TTokenData
) => Promise<CreateEventSuccess | CreateEventError>;
```
