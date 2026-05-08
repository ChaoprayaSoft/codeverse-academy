// NEW: Handles the Logout "Postcard" (GET Request)
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logsSheet = ss.getSheetByName("Logs");
  var email = e.parameter.email || "unknown@space.com";
  var name = e.parameter.name || "Unknown";
  var status = e.parameter.status || "Logout";

  if (logsSheet) {
    logsSheet.appendRow([new Date(), email, name, status]);
  }

  return ContentService.createTextOutput("Signal Received")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Handles the main Sync/Login/Load (POST Request)
// Users sheet columns:
//   A: Email | B: Name | C: Avatar | D: Color | E: Role | F: Progress | G: Last Updated
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = ss.getSheetByName("Users") || ss.getSheets()[0];
  var logsSheet = ss.getSheetByName("Logs");

  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var email = data.email || "unknown@space.com";
  var name = data.name || "Unknown";
  var status = data.status || action;

  if (logsSheet) {
    logsSheet.appendRow([new Date(), email, name, status]);
  }

  // Find user row by email (col A)
  var rows = usersSheet.getDataRange().getValues();
  var userRow = -1;
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === email) { userRow = i + 1; break; }
  }

  if (action === "sync" || action === "login") {
    var initialProgress = { xp: 0, missions: {}, levels: {}, badges: [] };
    var progressJson = data.progress ? JSON.stringify(data.progress) : JSON.stringify(initialProgress);

    if (userRow === -1) {
      // New user — create row with Role in col E
      usersSheet.appendRow([
        email,
        name,
        data.avatar || "",
        data.color  || "",
        data.role   || "",   // col E: Role
        progressJson,        // col F: Progress
        new Date()           // col G: Last Updated
      ]);
    } else {
      // Existing user — update fields
      usersSheet.getRange(userRow, 2).setValue(name);
      if (data.avatar)   usersSheet.getRange(userRow, 3).setValue(data.avatar);
      if (data.color)    usersSheet.getRange(userRow, 4).setValue(data.color);

      // Role: only write if provided AND the cell is currently empty
      // (prevents clients from overwriting a server-assigned Admin role)
      if (data.role) {
        var existingRole = usersSheet.getRange(userRow, 5).getValue();
        if (!existingRole) {
          usersSheet.getRange(userRow, 5).setValue(data.role);
        }
      }

      if (data.progress) usersSheet.getRange(userRow, 6).setValue(progressJson);
      usersSheet.getRange(userRow, 7).setValue(new Date());
    }
  }

  if (action === "load" && userRow !== -1) {
    var userData = rows[userRow - 1];
    var progressData = null;
    try {
      progressData = userData[5] ? JSON.parse(userData[5]) : null;
    } catch (err) {
      progressData = null;
    }

    return ContentService.createTextOutput(JSON.stringify({
      status:   "success",
      name:     userData[1],
      avatar:   userData[2],
      color:    userData[3],
      role:     userData[4] || "",   // col E: Role
      progress: progressData
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
