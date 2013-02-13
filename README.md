jData is a shared localStorage object interface that can be accessed by any website on the internet and works on Firefox 3+, Webkit 3.1.2/3.2+ nightlies and IE8. Think of it as pseudo-globalStorage[""] but write access needs user confirmation. The API uses window.postMessage to communicate in a standard JSON format I have documented in the API reference. The jData Interface Library can simplify using the API greatly and has efficient callback management (postMessage is asynchronous so the callbacks are stored and used when the response is received, then they are deleted).

To manage your data stored by the official jData host, go to the [jData Manager.][1]

## API

The new jData API is much more robust than the previous jData API. The new API uses JSON for communication between client and host. For the API reference below, "foo" is the item being set, "bar" is the value for an item being set, and REQUEST_ID is just a random ID for the request. Every response includes a property named "jdata" set to true, to help the client figure out what what the response is to (in case there are multiple libraries sending different formats to iframes)

If you send an optional request ID, the jData host will respond using the same ID, making it possible to identify what the response is a response to without having to guess.


*   Setting a variable 
    *   Request: `{id:REQUEST_ID, method: "set", item: "foo", value: "bar" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: true [or  false if user denies set request]}`
*   Removing a variable 
    *   Request: `{id:REQUEST_ID, method: "remove", item: "foo" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: true [or false if user denies remove request]}`
    *   The response will always be true if the variable being requested to be removed is not set.
*   Getting the value of a variable 
    *   Request: `{id:REQUEST_ID, method: "get", item: "foo" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: "bar" [or null if variable not set]}`
*   Requesting to become a trusted host 
    *   Request: `{id:REQUEST_ID, method: "trust" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: true [or false if user denies trust request]}`
    *   The response will always be true (no confirmation prompt to the user) if the host is already a trusted host.
*   Requesting to become an untrusted host (will always return true). You might only use this to give the user an option to remove you from the trustedHosts list without having to go to the management page. 
    *   Request: `{id:REQUEST_ID, method: "untrust" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: true}`
*   Getting every variable in the jData host's localStorage 
    *   Request: `{id:REQUEST_ID, method: "list" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: ["foo", "some-other-variable", ect...]}`
*   Getting amount of variables in the jData host's localStorage 
    *   Request: `{id:REQUEST_ID, method: "length" }`
    *   Response: `{jdata: true, id:REQUEST_ID, response: integer that is the amount of variables in the localStorage}`


## Standard

*version 0.1.2*

This standard is a list of item names that should be used with jData.

*   **jData Host **- Currently http://jdata.eligrey.com 
    *   This can include a pathname, so example.com/jdata can be a valid **jData Host**.
    *   postMessage API: {**jData Host**}/api/postMessage
    *   Data management: {**jData Host**}/manage
    *   Data migration: {**jData Host**}/migrate 
        *   Data migration to another jData host requires you allow your current jData host to become a trusted host in the jData host you are migrating to (will go back to untrusted after transition).
*   **jData Origin** - {**jData Host's Protocol: + Domain + Non-standard port**}
*   The size limit: Browsers will limit how much data can be stored in the jData website's localStorage object, so please do not set preferences that use anything near or over 1kb of data. jData is supposed to be a global resource that any website can access.
*   All items are case-insensitive, as they will be converted to lowercase on being proccessed by jData.  Any prompts for confirmation of modification of an item will preserve the case. 
    *   Example: Setting "OpenID" on an untrusted host will ask if the user allows setting "OpenID" and will set "openid" if the user agrees. If you try to get "OpenID", "openid" is accessed and returned.
*   Protected/Restricted Items: These items can not be directly modified or deleted. They may have a special method to modify them though. 
    *   **trustedHosts**:Array - An array of hosts (including the protocol, ie. http://example.com, chrome://extensiondev) that do not need to ask for permission to set and delete items. A host can become a trusted host by issuing a trust request that gets accepted. 
        *   Trusted hosts management functionality is included in the data management jData host page.
*   Standard classes: 
    *   **preference** - A user's preference about an item.
    *   **understand** - A user understands an item. (eg. **understand.language.javascript** => 'true' means they understand javascript)
    *   **is** - A user is something. (eg. **is.developer** => 'true' means the user is a developer)
*   **fullname** - String containing first and last name separated by a space. Example: "personal.fullname" => "Elijah Grey"
*   Use the word "username" instead of "user" where possible.
*   {**domain name**} - For the following items, you are **only** allowed to store information that would be useful to other websites, as not to waste space in jData's quota on a user's browser. If you want to store data that's only useful to the domain, store it in your own site's localStorage. 
    *   {**domain name**}|{**item**} - For website-specific data. Example: "digg.com|username" => "Sephr"
*   **age** - Integer; age of user. Example: "age" => "15"
*   **birthday** - A UTC formatted date of birth with year replaced by "BDAY". (just day and month) - Example: Monday, BDAY-11-24 UTC
*   **birthdate** - A UTC formatted date of birth with year. (just day, month, and year) - Example: Monday, 2008-11-24 UTC
*   **gender** - Gender of person. Either "male", "female",  "other", or "n/a". - Case insensitive
*   **address** Class 
    *   **address.state** - State or province the user lives in.
    *   **address.zip** - Zip code of where the user lives.
    *   **address.country** - Country the user lives in.
*   **surname** - Surname of person.
*   **company** - Company a person works for.
*   **contact.email** - Valid email address that may be used to contact user. - I don't recommend setting this due to spam but if you must, that is this is the recommended name.
*   **contact.phone** - Phone number of user. - Same conditions as **contact.email**.
*   **nickname** - Nickname
*   **status** - String containing what the person is currently doing. Example: "status" => "Watching Movie: The Dark Knight". This would be best used in conjunction with a [Twitter][1]-esque webapp.
*   **openid** - User's [OpenID address][2].
*   **websites** - A person's websites. A JSON-encoded object that follows this format: `[{"Website 1":"URI"},{"Website 2":"URI"}]`. They should be listed in order of importance so if you must pick only one, pick the first one.
*   **blogs** - Same as **websites** but for blogs only.
*   **preference.sendUpdates** - A user's default preference on sending them updates about services they sign up to. Defaults to false;
*   **understand.language.**{**language**} - (If the language has an ISO shortcode, use that instead, ie. English = en) A user understands the programming language. (case insensitive) Example: **understand.brainfuck** => 'false', or **understand.en**=> 'true'
*   **understand.howto.**{**something**} - A user understands how to do something.
*   **understand.**{**something**} - Understand something.
*   **preference.jdata.manager** - URI of preferred jData manager. Use to link a user to their preferred jData manager and if you have your own, it would be a good idea to let them set it as default.  Defaults to {**jData Website**}/manage
*   **jdata.manager.backup**:boolean - Backup prefences if possible at jData Manager.
*   **jdata.manager.backup.id** - A unique id for getting a backup. Should also be stored in a cookie because the only time you need a backup is when you lose the data localStorage data.
*   **preference.filter** - JSON object with things that should be filtered. Example: {"explicit-images":true, "explicit-text":false} 
    *   explicit-images:boolean - Filter explicit images
    *   explicit-text:Array|boolean - Filter explicit text specified in an array or if it is true, filter words that you think are explicit.
    *   ads:boolean - Filter advertisements. (I'm guessing this isn't ever going to be followed)
*   **preference.design.colors**:Array - Case insensitive hex values starting with # in an array. Preferred colors to be seen in a website.
*   **preference.design.colors.scheme** - Case insensitive. Website color scheme preference; either "light", "neutral", or "dark".
*   **preference.searchEngine** - A person's preferred search engine. JSON encoded object that follows {"Engine Name":"URI"}. *%s* in the URI is replaced with the query.
*   **is.developer**:boolean - The user is a developer (the kind that deals with code).
*   **is.designer**:boolean - The user is a designer that designs UIs (the computer kind of designer, not a clothes designer). I will make a form sooner or later (or maby never) that enables you to change all of these values easily.

 [1]: http://twitter.com/
 [2]: http://openid.net/what/

## Interface Library

I have also created a reference [Interface Library][2] that can be used with jData.



![Tracking image](https://in.getclicky.com/212712ns.gif)


 [1]: http://jdata.eligrey.com/manage.php
 [2]: http://github.com/eligrey/jil#readme

