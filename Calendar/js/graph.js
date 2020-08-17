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

async function createEvent() {
    try {
        let events = await graphClient
            .api('/me/events')
            .post();
        updatePage(msalClient.getAccount(), Views.createEvent, events);
    } catch (error) {
        updatePage(msalClient.getAccount(), Views.error, {
            message: 'Error getting events',
            debug: error
        });
    }
}