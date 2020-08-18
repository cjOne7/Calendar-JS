// Create an options object with the same scopes from the login
const options =
    new MicrosoftGraph.MSALAuthenticationProviderOptions([
        'user.read',
        'calendars.readwrite'
    ]);
// Create an authentication provider for the implicit flow
const authProvider =
    new MicrosoftGraph.ImplicitMSALAuthenticationProvider(msalClient, options);
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });

async function getEvents() {
    try {
        let events = await graphClient
            .api('/me/events')
            .select('subject,organizer,start,end')
            .orderby('createdDateTime DESC')
            .get();

        updatePage(msalClient.getAccount(), Views.calendar, events);
    } catch (error) {
        updatePage(msalClient.getAccount(), Views.error, {
            message: 'Error getting events',
            debug: error
        });
    }
}

async function createEvent(subject, content, startTime, endTime) {
    const event = {
        subject: subject,
        body: {
            contentType: "HTML",
            content: content
        },
        start: {
            dateTime: "2020-08-15T12:00:00Z",
            timeZone: "Pacific Standard Time"
        },
        end: {
            dateTime: "2020-08-25T14:00:00Z",
            timeZone: "Pacific Standard Time"
        }
    };

    await graphClient.api('/me/events').post(event);
}