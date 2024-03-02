$(window).on("load", function () {
	addTabs()
});

function drawTabs(tabGroup){
	console.log("hurr",tabGroup)

	var tabStr = ""
	for(var t of tabGroup.tabs){
		// tabStr += "<br/>Another Fart"
		var active = (tabGroup.defaultTab.data("tab") == t.id) ? "active" : ""
		tabStr+=`<li class="nav-item" role="presentation"><button class="nav-link ${active}" id="${t.id}-tab" data-bs-toggle="tab" data-bs-target="#tab-${t.id}" type="button" role="tab">${t.name}</button></li>`
	}
	var navTab = `<ul class="nav nav-tabs" id="${tabGroup.group}" role="tablist">${tabStr}</ul>`


	$(`[data-tab-nav='${tabGroup.group}']`).html(navTab)
}

function addTabs() {
	var tabGroups = []
	$("[data-tab]").each(function (index) {
		var tabGroup = $(this).data("tab-group")
		tabGroups[tabGroup] = tabGroups[tabGroup] || {tabs:[], group: tabGroup}
		var tabId = $(this).data("tab")
		var tabName = $(this).data("tab-name")
		console.log(tabName)
		tabGroups[tabGroup].tabs.push({
			id: tabId,
			name: tabName || tabId
		})

		if (!tabGroups[tabGroup].defaultTab) {
			tabGroups[tabGroup].defaultTab = $(this)
		}
		$(this).addClass("tab-pane fade")
		$(this).attr("id", "tab-" + tabId)
		console.log("Id is", $(this).attr("id"))
	})
	console.log(tabGroups)
	for (var g in tabGroups) {
		console.log(tabGroups[g])
		tabGroups[g].defaultTab.addClass("show active")
		drawTabs(tabGroups[g])
	}
}