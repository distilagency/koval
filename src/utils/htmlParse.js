const sanitizeHtml = require('sanitize-html');

const htmlEntities = {
    nbsp: ' ',
    cent: '¢',
    pound: '£',
    yen: '¥',
    euro: '€',
    copy: '©',
    reg: '®',
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: '\''
};

export const decodeEntities = (str) => {
  /* eslint no-useless-escape: 0 */
  /* eslint no-cond-assign: 0 */
  /* eslint no-bitwise: 0 */
  return str.replace(/\&([^;]+);/g, (entity, entityCode) => {
    let match;
    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
    }
    if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
      return String.fromCharCode(parseInt(match[1], 16));
    }
    if (match = entityCode.match(/^#(\d+)$/)) {
        return String.fromCharCode(~~match[1]);
    }
    return entity;
  });
};

export const stripHtmlTags = (content) => sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });

export const getExcerpt = (content, length) => {
  // Remove html tags
  const cleanedContent = stripHtmlTags(content);
  // Convert html entities to ascii, cut down content to desired length.
  const decodedTrimmedContent = decodeEntities(cleanedContent).substring(0, length);
  // If trimmed content is less than input length, add ellipsis
  const excerpt = decodedTrimmedContent.length === length ?
    `${decodedTrimmedContent.substring(0, decodedTrimmedContent.lastIndexOf(' '))}...` :
    decodedTrimmedContent;

  return excerpt;
};
