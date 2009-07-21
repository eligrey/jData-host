
if ( typeof JSON == "undefined" ) { // load JSON if it doesn't already exist
	document.getElementsByTagName('head')[0].appendChild(document.createElement('script')).src = 'json2.js';
}

if ( typeof localStorage == "undefined" && typeof globalStorage != "undefined" ) {
	var localStorage = globalStorage[location.hostname];
}

var tHStorage = 'trustedHosts';

if ( !localStorage.getItem(tHStorage) ) {
	localStorage.setItem(tHStorage, '[]');
}

var trustedHostsList;

function reloadHosts() {
	trustedHostsList = JSON.parse(localStorage.getItem(tHStorage).toString());
}

function reloadHostList() {
	document.getElementById('chosenHost').innerHTML = '';
	enumerateHosts();
}

function enumerateHosts() {
	reloadHosts();
	var hostList = document.getElementById('chosenHost'),
	ranOnce = false;
	for ( var i = 0; i<trustedHostsList.length; i++ ) {
		var option = document.createElement('option');
		if (ranOnce == false) {
			option.setAttribute('selected','true');
			ranOnce = true;
		}
		option.setAttribute('value', i);
		option.innerHTML = trustedHostsList[i];
		hostList.appendChild(option);
	}
}

function removeHost(hostIndex) {
	trustedHostsList.splice(hostIndex, 1);
	localStorage.setItem(tHStorage, JSON.stringify(trustedHostsList));
	reloadHostList();
}

function enumerateItems() {
	var itemList = document.getElementById('chosenItem'),
	itemValue = document.getElementById('chosenItemValue'),
	ranOnce = false;
	for (var i=0; i<localStorage.length; i++)
	{
	var itemName = localStorage.key(i);
	if ( itemName != 'trustedHosts' ) {
			var option = document.createElement('option');
			if (ranOnce == false) {
				itemValue.value = localStorage.getItem(itemName);
				option.setAttribute('selected','true');
				ranOnce = true;
			}
			option.setAttribute('value', itemName);
			option.innerHTML = itemName;
			itemList.appendChild(option);
		}
	}
};

function getValue(item) {
	var itemValue = document.getElementById('chosenItemValue');
	itemValue.value = localStorage.getItem(item);
}

function reloadItemList() {
	document.getElementById('chosenItem').innerHTML = '';
	document.getElementById('chosenItemValue').value = '';
	enumerateItems();
}

function getItemList() {
	var itemList = [];
	for ( i = 0; i<localStorage.length; i++ ) {
		itemList.push(localStorage.key(i));
	}
	return itemList;
}

function removeAllItems() {
	if ( confirm('Are you sure you want to remove all items from '+location.host+'?') ) {
		var items = getItemList();
		for ( i=0; i<items.length; i++) {
			if ( items[i] != 'trustedHosts' ) localStorage.removeItem(items[i]);
		}
		reloadItemList();
	}
}

window.onload = function() {
reloadItemList();
reloadHostList();
};
