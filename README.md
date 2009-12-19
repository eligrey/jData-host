jData is a shared localStorage object interface that can be accessed by any website on the internet and works on Firefox 3+, Webkit 3.1.2/3.2+ nightlies and IE8. Think of it as pseudo-globalStorage[""] but write access needs user confirmation. The API uses window.postMessage to communicate in a standard JSON format I have documented in the API reference. The jData Interface Library can simplify using the API greatly and has efficient callback management (postMessage is asynchronous so the callbacks are stored and used when the response is recieved, then they are deleted).

To manage your data stored by the official jData host, go to the [jData Manager.][1]

## API

The new jData API is much more robust than the previous jData API. The new API uses JSON for communication between client and host. For the API reference below, "foo" is the item being set, "bar" is the value for an item being set, and REQUEST_ID is just a random ID for the request. Every response includes a property named "jdata" set to true, to help the client figure out what what the response is to (in case there are mutiple libraries sending different formats to iframes)

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

## Other info

*   [Standard][2]
*   [Interface Library][3]

 [1]: http://jdata.eligrey.com/manage.php
 [2]: http://eligrey.com/blog/projects/jdata/standard/
 [3]: http://github.com/eligrey/jil#readme

