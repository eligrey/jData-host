if ( typeof localStorage == "undefined" && typeof globalStorage != "undefined" ) {
	var localStorage = globalStorage[location.hostname];
}


function getItemList() {
	var itemList = [];
	for ( i = 0; i<localStorage.length; i++ ) {
		itemList.push(localStorage.key(i));
	}
	return itemList;
}



function copyDataToHost(newHost, path) {
  if ( JIL.ready == true ) {
	var originalOrigin = JIL.origin, originalPath = JIL.path, items = getItemList();
	JIL.origin = newHost;
	JIL.path = path;
	JIL.loadFrame(function() {
		JIL.trust(function(trusted) {
		  if (trusted == true) {
			for ( var i=0; i<items.length; i++ ) { if ( items[i] != 'trustedHosts' && items[i] === items[i].toLowerCase() ) { // can't be trusedHosts or non-lowercase items
				JIL.set(items[i], localStorage.getItem(items[i]));
			}}
		  JIL.untrust();
		  alert('Data copy complete.');
		  }
		});
	});
	JIL.origin = originalOrigin;
	JIL.path = originalPath;
	JIL.loadFrame();
  }
}

function removeAllItems() {
	if ( confirm('Are you sure you want to remove all items from '+location.host+'?') ) {
		var items = getItemList();
		for ( i=0; i<items.length; i++) {
			if ( items[i] != 'trustedHosts' && items[i] === items[i].toLowerCase() ) localStorage.removeItem(items[i]);
		}
	}
}
