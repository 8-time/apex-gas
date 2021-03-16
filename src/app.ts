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

  saveJsonToDrive(result, "apex_data_for_https");
}

function saveDataFromIgnioXml() {
  const response = UrlFetchApp.fetch(
    "https://ignio.com/r/export/utf/xml/daily/com.xml",
    {
      contentType: "application/xml",
    }
  );
  const xmlRu = response.getContentText();
  const xmlEn = LanguageApp.translate(xmlRu, "ru", "en", {
    contentType: "html",
  });

  saveJsonToDrive(XMLToJSON(xmlRu), "apex_data_for_https_ru");
  saveJsonToDrive(XMLToJSON(xmlEn), "apex_data_for_https_en");
}

function grabDataFunctions() {
  saveDataFromIgnioXml();
}

function doGet() {
  const ru = JSON.parse(getJsonFromDrive("apex_data_for_https_ru"));
  const en = JSON.parse(getJsonFromDrive("apex_data_for_https_en"));

  return ContentService.createTextOutput(
    JSON.stringify(!isEmpty(ru) && !isEmpty(en) ? { ru, en } : null)
  ).setMimeType(ContentService.MimeType.JSON);
}
