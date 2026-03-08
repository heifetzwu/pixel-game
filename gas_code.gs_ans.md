/**
 * Google Apps Script for Pixel Trivia Game (Backend Scoring Version)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const QUESTIONS_SHEET = "題目";
const ANSWERS_SHEET = "回答";

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(QUESTIONS_SHEET);
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  
  const count = parseInt(e.parameter.count || 5);
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  const questions = selected.map(row => {
    return {
      id: row[0],
      text: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      }
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const result = JSON.parse(e.postData.contents);
  const userId = result.userId;
  const userAnswers = result.answers; // Expecting [{ id: qId, choice: 'A' }, ...]
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const qSheet = ss.getSheetByName(QUESTIONS_SHEET);
  const aSheet = ss.getSheetByName(ANSWERS_SHEET);
  
  // 1. Get all correct answers from the Questions sheet
  const qData = qSheet.getDataRange().getValues();
  const correctAnswersMap = {};
  for (let i = 1; i < qData.length; i++) {
    const qId = qData[i][0];
    const answer = qData[i][6]; // Column '解答' (7th column, index 6)
    correctAnswersMap[qId] = answer;
  }
  
  // 2. Calculate score
  let score = 0;
  userAnswers.forEach(ans => {
    if (correctAnswersMap[ans.id] === ans.choice) {
      score++;
    }
  });
  
  const totalQuestions = userAnswers.length;
  const aData = aSheet.getDataRange().getValues();
  let rowIdx = -1;
  for (let i = 1; i < aData.length; i++) {
    if (aData[i][0] == userId) {
      rowIdx = i + 1;
      break;
    }
  }
  
  const now = new Date();
  if (rowIdx === -1) {
    // New User
    aSheet.appendRow([userId, 1, score, score, score, score >= totalQuestions ? 1 : 0, now]);
  } else {
    // Existing User
    const currentCount = aData[rowIdx-1][1] || 0;
    const currentMax = aData[rowIdx-1][3] || 0;
    
    aSheet.getRange(rowIdx, 2).setValue(currentCount + 1);
    aSheet.getRange(rowIdx, 3).setValue(score);
    aSheet.getRange(rowIdx, 4).setValue(Math.max(currentMax, score));
    aSheet.getRange(rowIdx, 7).setValue(now);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", calculatedScore: score }))
    .setMimeType(ContentService.MimeType.JSON);
}
