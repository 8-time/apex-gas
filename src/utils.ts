const fileName = "apex_data_for_https";

function getElementsByTagName(
  element: GoogleAppsScript.XML_Service.Element,
  tagName: string
) {
  const data: GoogleAppsScript.XML_Service.Element[] = [];
  let descendants = element.getChildren();

  for (let i in descendants) {
    const elt = descendants[i].asElement();
    if (elt != null && elt.getName() == tagName) {
      data.push(elt);
    }
  }

  return data;
}

function getIgnioTexByHtml(response: GoogleAppsScript.URL_Fetch.HTTPResponse) {
  const html = response.getContentText();
  const doc = XmlService.parse(html);
  const el = getElementsByTagName(
    getElementsByTagName(
      getElementsByTagName(
        getElementsByTagName(
          getElementsByTagName(doc.getRootElement(), "body")[0],
          "table"
        )[0],
        "tr"
      )[0],
      "td"
    )[3],
    "div"
  )[2];

  return el.getText();
}

function saveJsonToDrive(props: object) {
  const content = JSON.stringify(props);

  const files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    files.next().setContent(content);
  } else {
    DriveApp.createFile(fileName, content, "application/json");
  }
}

function getJsonFromDrive() {
  const files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    return JSON.stringify(JSON.parse(files.next().getBlob().getDataAsString()));
  } else {
    return JSON.stringify({});
  }
}

function elementToJSON(element: GoogleAppsScript.XML_Service.Element) {
  const result = {};

  element.getAttributes().forEach(function (attribute) {
    result[attribute.getName()] = attribute.getValue();
  });

  element.getChildren().forEach(function (child) {
    const key = child.getName();
    const value = elementToJSON(child);
    if (result[key]) {
      if (!(result[key] instanceof Array)) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });
  const text = element.getText().trim();

  if (text) {
    result["Text"] = text;
  }
  return result;
}

function XMLToJSON(xml: string) {
  const doc = XmlService.parse(xml);
  const result = {};
  const root = doc.getRootElement();
  result[root.getName()] = elementToJSON(root);
  return result;
}
