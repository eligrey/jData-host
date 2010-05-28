/*
jData Host - v0.0.3 - code.eligrey.com/jdata/host/
@license Dual-licensed GNU GPL v3 and the X11/MIT license
@author Eli Grey, http://eligrey.com
*/

// conditional operator statements instead of a lot of if...else statements to make smallest code possible when minified

var u = 'undefined', f = false, t = true, h = 'trustedHosts', s = typeof localStorage != u ? localStorage : globalStorage[location.hostname], w = 'string';

if ( typeof postMessage != u )
{

if ( typeof JSON == u ) document.documentElement.appendChild(document.createElement('script')).src='../json2.js';

if ( !s.getItem(h) ) {
	s.setItem(h, "[]");
}

if ( !Array.prototype.indexOf ) { // implement Array.indexOf in IE without fromIndex as it won't be used
    Array.prototype.indexOf = function(obj){
        for (var i=0; i<this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

function m(evt) { // window postMessage listener(evt)
	var request = JSON.parse(evt.data),
	messageID = request.id,
	trustedHosts = JSON.parse(s.getItem(h).toString()),
	item = request.item,
	requestMethod = request.method,
	originHost = evt.origin.replace(/^.+?:(\/\/)?/,''); // User doesn't need to see the protocol:// part
	if ( typeof item == w ) var lowerCaseItem = item.toLowerCase();
	function reply(r, isStorageItem) { // reply function(response)
		var responseObject = {};
		if ( typeof messageID != u ) responseObject.id = messageID;
		responseObject.response = isStorageItem && typeof r != u && r !== null ? r.toString() : r;
		responseObject.jdata = true;
		evt.source.postMessage(JSON.stringify(responseObject), '*');
	}
	if ( requestMethod == 'get' && typeof item == w ) reply(s.getItem(lowerCaseItem)||null, t);
	else if ( ( requestMethod == 'set' || requestMethod == 'remove' ) && typeof item == w ) {
		var requestSet = requestMethod == 'set';
		if ( item == h ) reply(f);
		else trustedHosts.indexOf(evt.origin)+1
			|| (!requestSet ? !s.getItem(lowerCaseItem) : false)
			|| confirm('Allow '+originHost+' to '+(requestSet? 'modify the value of':'remove')+' the publicly shared item, '+item+'?')
			&& item != h
			? ( requestSet && typeof request.value == w
				? s.setItem(lowerCaseItem, request.value)
				: s.removeItem(lowerCaseItem), reply(t)
			) : reply(f);
	}
	else if ( requestMethod == 'list' ) {
		var itemList = [];
		for ( i = 0; i<s.length; i++ ) {
			itemList.push(s.key(i));
		}
		reply(itemList);
	}
	else if ( requestMethod == 'length' ) reply(s.length);
	else if ( requestMethod == 'trust' ) trustedHosts.indexOf(evt.origin)+1
		? reply(t) : confirm('Add '+originHost+' to trusted hosts?\nA trusted host does not need your permission to modify publicly shared data.\nYou can manage trusted hosts at '+location.href.substr(0,location.href.length-20)+'/manage')
		? (trustedHosts.push(evt.origin), trustedHosts = JSON.stringify(trustedHosts), s.setItem(h, trustedHosts), trustedHosts = JSON.parse(trustedHosts), reply(t)) : reply(f);
	else if ( requestMethod == 'untrust' ) {
		if ( trustedHosts.indexOf(evt.origin)+1 ) {
			trustedHosts.splice(trustedHosts.indexOf(evt.origin), 1),
			trustedHosts = JSON.stringify(trustedHosts),
			s.setItem(h, trustedHosts);
		}
		reply(t);
	}
}

function v( obj, type, fn ) { // addevent
	if ( obj.attachEvent ) {
		obj.attachEvent( 'on'+type, fn );
	} else {
		obj.addEventListener( type, fn, false );
	}
}

onload = function() {
v(this, "message", m)
}

}
