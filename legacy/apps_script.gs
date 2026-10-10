/**
 * GOOGLE SHEETS DATABASE FOR CODEVERSE ACADEMY
 * Columns: Email | Name | Avatar | Color | Role | Progress (JSON) | Last Updated | Status
 */

const SHEET_NAME = "Users";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    
    // Auto-setup headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Email", "Name", "Avatar", "Color", "Role", "Progress", "Last Updated", "Status"]);
    }

    const email = data.email;
    if (!email) return createResponse("error", "Missing email");

    const rows = sheet.getDataRange().getValues();
    let rowIndex = -1;

    // Find existing user by email
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === email) {
        rowIndex = i + 1;
        break;
      }
    }

    // ACTION: LOAD
    if (data.action === 'load') {
      if (rowIndex > -1) {
        const userRow = rows[rowIndex - 1];
        return createResponse("success", "Loaded", {
          name: userRow[1],
          avatar: userRow[2],
          color: userRow[3],
          role: userRow[4],
          progress: userRow[5] ? JSON.parse(userRow[5]) : null
        });
      }
      return createResponse("new_user", "No progress found");
    }

    // ACTION: GET USERS (Admin Only)
    if (data.action === 'getUsers') {
      if (rowIndex === -1 || rows[rowIndex - 1][4] !== 'Admin') {
        return createResponse("error", "Unauthorized access");
      }
      
      const users = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue; // Skip empty rows
        users.push({
          email: r[0],
          name: r[1],
          avatar: r[2],
          color: r[3],
          role: r[4] || "Student",
          progress: r[5] ? JSON.parse(r[5]) : null,
          lastUpdated: r[6],
          status: r[7]
        });
      }
      return createResponse("success", "Users fetched", { users });
    }

    // ACTION: SYNC / LOGIN / LOGOUT
    const progressJson = data.progress ? JSON.stringify(data.progress) : (rowIndex > -1 ? rows[rowIndex-1][5] : "");
    const lastUpdated = new Date();
    const status = (data.action === 'login') ? "Online" : (data.action === 'logout') ? "Offline" : "Active";

    const userData = [
      email,
      data.name || (rowIndex > -1 ? rows[rowIndex-1][1] : ""),
      data.avatar || (rowIndex > -1 ? rows[rowIndex-1][2] : ""),
      data.color || (rowIndex > -1 ? rows[rowIndex-1][3] : ""),
      data.role || (rowIndex > -1 ? rows[rowIndex-1][4] : "Student"),
      progressJson,
      lastUpdated,
      status
    ];

    if (rowIndex > -1) {
      // Update existing row
      sheet.getRange(rowIndex, 1, 1, userData.length).setValues([userData]);
    } else {
      // Create new row
      sheet.appendRow(userData);
    }

    return createResponse("success", "Synchronized");

  } catch (err) {
    return createResponse("error", err.message);
  }
}

// Support for GET requests (used by the Image Ping logout method)
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const email = e.parameter.email;
  const action = e.parameter.action;

  if (email && action === 'logout') {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === email) {
        sheet.getRange(i + 1, 8).setValue("Offline"); // Update Status column
        sheet.getRange(i + 1, 7).setValue(new Date()); // Update Last Updated
        break;
      }
    }
  }
  
  // Return a tiny transparent pixel to satisfy the browser
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}

function createResponse(status, message, data = {}) {
  const output = { status, message, ...data };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
