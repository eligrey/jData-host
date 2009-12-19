jData is a shared localStorage object interface that can be accessed by any website on the internet and works on Firefox 3+, Webkit 3.1.2/3.2+ nightlies and IE8. Think of it as pseudo-globalStorage[""] but write access needs user confirmation. The API uses window.postMessage to communicate in a standard JSON format I have documented in the API reference. The jData Interface Library can simplify using the API greatly and has efficient callback management (postMessage is asynchronous so the callbacks are stored and used when the response is recieved, then they are deleted).

To manage your data stored by the official jData host, go to the [jData Manager][1].

Other info: 

*   [Standard][2]
*   [Interface Library][3]

 [1]: http://jdata.eligrey.com/manage.php
 [2]: http://eligrey.com/blog/projects/jdata/standard/
 [3]: http://github.com/eligrey/jil#readme
