/* Modified in this repository; see NOTICE for derivative-work details. */
function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

var table = new Tabulator("#example-table", {
    layout: "fitData",
    placeholder: "Loading",
    selectable: 1
});

var rawLeads = [];
var activeSessionId = "";
var currentColumns = new Set();

function flattenObject(value, prefix) {
    var safePrefix = prefix || "";
    var output = {};

    Object.entries(value || {}).forEach(function (entry) {
        var key = entry[0];
        var nestedValue = entry[1];
        var field = safePrefix ? safePrefix + "_" + key : key;

        if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
            Object.assign(output, flattenObject(nestedValue, field));
        } else {
            output[field] = nestedValue;
        }
    });

    return output;
}

function normalizeText(value) {
    return (value || "").toString().trim().toLowerCase();
}

function populateSessionOptions(sessions, selectedSessionId) {
    var select = document.getElementById("session-select");
    if (!select) {
        return;
    }

    select.innerHTML = "";

    if (!sessions.length) {
        var emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "No saved sessions";
        select.appendChild(emptyOption);
        return;
    }

    sessions.forEach(function (session, index) {
        var option = document.createElement("option");
        var createdAt = session.createdAt ? new Date(session.createdAt) : null;
        var labelDate = createdAt && !isNaN(createdAt.getTime()) ? createdAt.toLocaleString() : "Session " + (index + 1);
        option.value = session.id || "";
        option.textContent = labelDate + " • " + (Array.isArray(session.leads) ? session.leads.length : 0) + " leads";
        if ((session.id || "") === selectedSessionId) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function buildColumns(fields) {
    var preferred = new Set("name phone email website address instagram facebook twitter linkedin yelp youtube placeID cID category reviewCount averageRating latitude longitude".split(" "));
    var columns = [];

    preferred.forEach(function (field) {
        columns.push({
            title: capitalizeFirstLetter(field),
            field: field,
            width: 300,
            resizable: true
        });
    });

    Array.from(fields).sort().forEach(function (field) {
        if (!preferred.has(field)) {
            columns.push({
                title: capitalizeFirstLetter(field),
                field: field,
                width: 300,
                resizable: true
            });
        }
    });

    currentColumns = new Set(fields);
    table.setColumns(columns);
}

function getSelectedFilters() {
    return {
        search: normalizeText(document.getElementById("filter-search").value),
        hasEmail: document.getElementById("filter-has-email").checked,
        hasWebsite: document.getElementById("filter-has-website").checked,
        minRating: parseFloat(document.getElementById("filter-min-rating").value || "0"),
        minReviews: parseInt(document.getElementById("filter-min-reviews").value || "0", 10)
    };
}

function matchesFilters(lead, filters) {
    var haystack = [
        lead.name,
        lead.address,
        lead.website,
        lead.email,
        lead.category,
        lead.phone
    ].join(" ").toLowerCase();

    var rating = parseFloat(lead.averageRating || "0");
    var reviews = parseInt(lead.reviewCount || "0", 10);
    var hasEmail = normalizeText(lead.email) !== "";
    var hasWebsite = normalizeText(lead.website) !== "";

    if (filters.search && !haystack.includes(filters.search)) {
        return false;
    }

    if (filters.hasEmail && !hasEmail) {
        return false;
    }

    if (filters.hasWebsite && !hasWebsite) {
        return false;
    }

    if (filters.minRating && rating < filters.minRating) {
        return false;
    }

    if (filters.minReviews && reviews < filters.minReviews) {
        return false;
    }

    return true;
}

function renderLeads() {
    var filters = getSelectedFilters();
    var rows = [];
    var fields = new Set();
    var datastatus = document.getElementById("datastatus");
    var accountinfo = document.getElementById("accountinfo");
    var filteredLeads = rawLeads.filter(function (lead) {
        return matchesFilters(lead, filters);
    });

    filteredLeads.forEach(function (lead) {
        var flatLead = flattenObject(lead);
        rows.push(flatLead);
        Object.keys(flatLead).forEach(function (field) {
            fields.add(field);
        });
    });

    buildColumns(fields);
    table.setData(rows);

    if (accountinfo) {
        accountinfo.textContent = "Showing " + rows.length + " of " + rawLeads.length + " leads";
    }

    if (datastatus) {
        datastatus.textContent = rows.length ? "" : "No leads match the current filters.";
    }
}

function loadSession(sessionId) {
    chrome.storage.local.get(["leadSessions"], function (storage) {
        var sessions = Array.isArray(storage.leadSessions) ? storage.leadSessions : [];
        var selected = sessions.find(function (session) {
            return session.id === sessionId;
        });

        if (!selected && sessions.length) {
            selected = sessions[0];
        }

        rawLeads = selected && Array.isArray(selected.leads) ? selected.leads : [];
        activeSessionId = selected ? selected.id : "";

        chrome.storage.local.set({
            activeLeadSessionId: activeSessionId,
            leads: rawLeads
        }, function () {
            renderLeads();
            populateSessionOptions(sessions, activeSessionId);
        });
    });
}

function clearFilters() {
    document.getElementById("filter-search").value = "";
    document.getElementById("filter-has-email").checked = false;
    document.getElementById("filter-has-website").checked = false;
    document.getElementById("filter-min-rating").value = "";
    document.getElementById("filter-min-reviews").value = "";
    renderLeads();
}

function attachFilterEvents() {
    [
        "filter-search",
        "filter-min-rating",
        "filter-min-reviews"
    ].forEach(function (id) {
        document.getElementById(id).addEventListener("input", renderLeads);
    });

    [
        "filter-has-email",
        "filter-has-website"
    ].forEach(function (id) {
        document.getElementById(id).addEventListener("change", renderLeads);
    });

    document.getElementById("clear-filters").addEventListener("click", clearFilters);
    document.getElementById("session-select").addEventListener("change", function (event) {
        loadSession(event.target.value);
    });
}

document.getElementById("download-csv").addEventListener("click", function () {
    var rows = table.getRows().length;
    if (rows) {
        table.download("csv", "results.csv");
    } else {
        document.getElementById("datastatus").textContent = "No leads available to export yet.";
        console.log("No leads available to export as CSV.");
    }
});

document.getElementById("download-xlsx").addEventListener("click", function () {
    var rows = table.getRows().length;
    if (rows) {
        table.download("xlsx", "results.xlsx", { sheetName: "My Data" });
    } else {
        document.getElementById("datastatus").textContent = "No leads available to export yet.";
        console.log("No leads available to export as XLSX.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    attachFilterEvents();

    chrome.storage.local.get(["leads", "leadSessions", "activeLeadSessionId"], function (storage) {
        var sessions = Array.isArray(storage.leadSessions) ? storage.leadSessions : [];
        var preferredSessionId = storage.activeLeadSessionId || "";

        if (!sessions.length && Array.isArray(storage.leads) && storage.leads.length) {
            sessions = [{
                id: "current",
                createdAt: new Date().toISOString(),
                leads: storage.leads
            }];
        }

        populateSessionOptions(sessions, preferredSessionId);

        if (sessions.length) {
            loadSession(preferredSessionId || sessions[0].id);
        } else {
            rawLeads = [];
            renderLeads();
            document.getElementById("datastatus").textContent = "No scraped leads found yet. Run the scraper on Google Maps first.";
        }
    });
});
