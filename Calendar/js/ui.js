// Select DOM elements to work with
const authenticatedNav = document.getElementById('authenticated-nav');
const accountNav = document.getElementById('account-nav');
const mainContainer = document.getElementById('main-container');

const Views = { error: 1, home: 2, calendar: 3, createEvent: 4 };

function createElement(type, className, text) {
    let element = document.createElement(type);
    element.className = className;

    if (text) {
        let textNode = document.createTextNode(text);
        element.appendChild(textNode);
    }

    return element;
}

function showAuthenticatedNav(account, view) {
    authenticatedNav.innerHTML = '';

    if (account) {
        createNavElement('Calendar', 'getEvents();');
        createNavElement('Create event', 'updatePage(msalClient.getAccount(), Views.createEvent);');
    }
}

function createNavElement(label, method) {
    let nav = createElement('div', 'nav-item');

    let link = createElement('button',
        `btn btn-link nav-link`,
        label);
    link.setAttribute('onclick', method);
    nav.appendChild(link);

    authenticatedNav.appendChild(nav);
}

function showAccountNav(account) {
    accountNav.innerHTML = '';

    if (account) {
        // Show the "signed-in" nav
        accountNav.className = 'nav-item dropdown';

        let dropdown = createElement('a', 'nav-link dropdown-toggle');
        dropdown.setAttribute('data-toggle', 'dropdown');
        dropdown.setAttribute('role', 'button');
        accountNav.appendChild(dropdown);

        let userIcon = createElement('i',
            'far fa-user-circle fa-lg rounded-circle align-self-center');
        userIcon.style.width = '32px';
        dropdown.appendChild(userIcon);

        let menu = createElement('div', 'dropdown-menu dropdown-menu-right');
        dropdown.appendChild(menu);

        let userName = createElement('h5', 'dropdown-item-text mb-0', account.name);
        menu.appendChild(userName);

        let userEmail = createElement('p', 'dropdown-item-text text-muted mb-0', account.userName);
        menu.appendChild(userEmail);

        let divider = createElement('div', 'dropdown-divider');
        menu.appendChild(divider);

        let signOutButton = createElement('button', 'dropdown-item', 'Sign out');
        signOutButton.setAttribute('onclick', 'signOut();');
        menu.appendChild(signOutButton);
    } else {
        // Show a "sign in" button
        accountNav.className = 'nav-item';

        let signInButton = createElement('button', 'btn btn-link nav-link', 'Sign in');
        signInButton.setAttribute('onclick', 'signIn();');
        accountNav.appendChild(signInButton);
    }
}

function showWelcomeMessage(account) {
    // Create jumbotron
    let jumbotron = createElement('div', 'jumbotron');

    let heading = createElement('h1', null, 'Javascript Calendar');
    jumbotron.appendChild(heading);

    if (account) {
        // Welcome the user by name
        let welcomeMessage = createElement('h4', null, `Welcome ${account.name}!`);
        jumbotron.appendChild(welcomeMessage);

        let callToAction = createElement('p', null,
            'Use the navigation bar at the top of the page to get started.');
        jumbotron.appendChild(callToAction);
    } else {
        // Show a sign in button in the jumbotron
        let signInButton = createElement('button', 'btn btn-primary btn-large',
            'Click here to sign in');
        signInButton.setAttribute('onclick', 'signIn();')
        jumbotron.appendChild(signInButton);
    }

    mainContainer.innerHTML = '';
    mainContainer.appendChild(jumbotron);
}

function showCalendar(events) {
    let div = document.createElement('div');

    div.appendChild(createElement('h1', null, 'Calendar'));

    let table = createElement('table', 'table');
    div.appendChild(table);

    let thead = document.createElement('thead');
    table.appendChild(thead);

    let headerrow = document.createElement('tr');
    thead.appendChild(headerrow);

    let organizer = createElement('th', null, 'Organizer');
    organizer.setAttribute('scope', 'col');
    headerrow.appendChild(organizer);

    let subject = createElement('th', null, 'Subject');
    subject.setAttribute('scope', 'col');
    headerrow.appendChild(subject);

    let start = createElement('th', null, 'Start');
    start.setAttribute('scope', 'col');
    headerrow.appendChild(start);

    let end = createElement('th', null, 'End');
    end.setAttribute('scope', 'col');
    headerrow.appendChild(end);

    let tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (const event of events.value) {
        let eventrow = document.createElement('tr');
        eventrow.setAttribute('key', event.id);
        tbody.appendChild(eventrow);

        let organizercell = createElement('td', null, event.organizer.emailAddress.name);
        eventrow.appendChild(organizercell);

        let subjectcell = createElement('td', null, event.subject);
        eventrow.appendChild(subjectcell);

        let startcell = createElement('td', null,
            moment.utc(event.start.dateTime).local().format('DD-MM-YYYY HH:mm UTC Z'));
        eventrow.appendChild(startcell);

        let endcell = createElement('td', null,
            moment.utc(event.end.dateTime).local().format('DD-MM-YYYY HH:mm UTC Z'));
        eventrow.appendChild(endcell);
    }

    mainContainer.innerHTML = '';
    mainContainer.appendChild(div);
}

function showCreateEventFields() {
    let div = createElement('div', 'form-container');
    div.appendChild(createElement('h1', null, 'Create event'));
    // $(function() {
    //     $(div).append("<iframe src='form_block/form.html'></iframe>");
    // });

    //Not WORK!
    // $(function() {
    //     $(div).load("form_block/form.html");
    // });

    $('<label/>', {
        "for": "subject",
        "text": "Subject:"
    }).appendTo(div);
    $('<input/>', {
        "id": "subject",
        "type": "text",
        "name": "subject",
        "required": "required",
        "placeholder": "Subject..."
    }).appendTo(div);

    $(div).append("<br>");

    $('<label/>', {
        "for": "content",
        "text": "Content:"
    }).appendTo(div);
    $('<input/>', {
        "id": "content",
        "type": "text",
        "name": "content",
        "required": "required",
        "placeholder": "Content..."
    }).appendTo(div);

    $(div).append("<br>");

    $('<label/>', { "text": "Start date:" }).appendTo(div);
    $('<input/>', {
        "id": "startdate",
        "type": "datetime-local",
        "required": "required"
    }).appendTo(div);

    $(div).append("<br>");

    $('<label/>', { "text": "End date:" }).appendTo(div);
    $('<input/>', {
        "id": "enddate",
        "type": "datetime-local",
        "required": "required"
    }).appendTo(div);

    $(div).append("<br>");

    $('<button/>', {
        "text": "Submit",
        "type": "submit",
        "class": "btn btn-outline-primary",
        click: function() {
            const subject = document.getElementById("subject").value;
            if (subject.trim() === '') {
                alert("Subject must be filled");
                return;
            } 
            const content = document.getElementById("content").value;
            if (content.trim() === '') {
                alert("Content must be filled");
                return;
            } 
            const startDate = document.getElementById("subject").value;
            const endDate = document.getElementById("subject").value;
            createEvent(subject, content, startDate, endDate);
        }
    }).appendTo(div);

    // const test = $("<p id='par'>Hello</p>");
    // $(div).append(test);

    mainContainer.innerHTML = '';
    mainContainer.appendChild(div);
    //$(div).append('<span class='f-click'>Hello</span>');
    // $(mainContainer).find('.f-click').on('click', function(){ alert('HELLO');})
}

function createInputField() {

}

function showError(error) {
    let alert = createElement('div', 'alert alert-danger');

    let message = createElement('p', 'mb-3', error.message);
    alert.appendChild(message);

    if (error.debug) {
        let pre = createElement('pre', 'alert-pre border bg-light p-2');
        alert.appendChild(pre);

        let code = createElement('code', 'text-break text-wrap',
            JSON.stringify(error.debug, null, 2));
        pre.appendChild(code);
    }

    mainContainer.innerHTML = '';
    mainContainer.appendChild(alert);
}

function updatePage(account, view, data) {
    if (!view || !account) {
        view = Views.home;
    }

    showAccountNav(account);
    showAuthenticatedNav(account, view);

    switch (view) {
        case Views.error:
            showError(data);
            break;
        case Views.home:
            showWelcomeMessage(account);
            break;
        case Views.calendar:
            showCalendar(data);
            break;
        case Views.createEvent:
            showCreateEventFields();
            break;
    }
}

updatePage(null, Views.home);