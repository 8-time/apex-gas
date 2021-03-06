function saveDataFromIgnioHtml() {
  const signs = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ] as const;

  const urls = signs.map(
    (sing) => `https://ignio.com/r/daily/tod/${sing}.html`
  );

  const responses = UrlFetchApp.fetchAll(urls);

  const result = signs.map((sign, i) => ({
    [sign]: getIgnioTexByHtml(responses[i]),
  }));

  saveJsonToDrive(result);
}

function saveDataFromIgnioXml() {
  const response = UrlFetchApp.fetch(
    "https://ignio.com/r/export/utf/xml/daily/com.xml",
    {
      contentType: "application/xml",
    }
  );
  const xml = response.getContentText();

  saveJsonToDrive(XMLToJSON(xml));
}

function grabDataFunctions() {
  saveDataFromIgnioXml();
}

function doGet() {
  return ContentService.createTextOutput(getJsonFromDrive()).setMimeType(
    ContentService.MimeType.JSON
  );
}
