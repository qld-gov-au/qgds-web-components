const ATTRIBUTE_MAP = JSON.parse(`{{attributeMap}}`);

export default {
  async main(input = {}) {
    return renderComponent(input);
  },
};

function renderComponent(input) {
  const attributes = ATTRIBUTE_MAP.map(({ attributeName, fieldName }) =>
    renderAttribute(attributeName, input[fieldName])
  )
    .filter(Boolean)
    .join("");

  return `<{{componentTagName}}${attributes}></{{componentTagName}}>`;
}

function renderAttribute(name, value) {
  if (value === undefined || value === null || value === false || value === "") {
    return "";
  }

  if (value === true) {
    return ` ${name}`;
  }

  return ` ${name}="${escapeHtml(String(value))}"`;
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
