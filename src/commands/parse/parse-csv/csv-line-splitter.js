export default class CSVLineSplitter {
  constructor({quoteChar, escapeChar} = {}) {
    this.quoteChar = quoteChar;
    this.escapeChar = escapeChar;
  }

  split(content) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;
    let i = 0;

    while (i < content.length) {
      const char = content[i];
      const nextChar = this._getNextChar(content, i);

      if (this._isEscapedQuote(char, nextChar)) {
        currentLine = this._addEscapedQuote(currentLine);
        i += 2;
        continue;
      }

      if (char === this.quoteChar) {
        inQuotes = !inQuotes;
        currentLine += char;
        i++;
        continue;
      }

      if (this._isCarriageReturnNewline(char, inQuotes, nextChar)) {
        this._finishLine(lines, currentLine);
        currentLine = '';
        i += 2;
        continue;
      }

      if (this._isNewline(char, inQuotes)) {
        this._finishLine(lines, currentLine);
        currentLine = '';
        i += 1;
        continue;
      }

      currentLine += char;
      i++;
    }

    this._addRemainingLine(lines, currentLine);
    return lines;
  }

  _getNextChar(content, index) {
    return index + 1 < content.length ? content[index + 1] : '';
  }

  _addRemainingLine(lines, currentLine) {
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }

  _finishLine(lines, currentLine) {
    lines.push(currentLine);
  }

  _addEscapedQuote(currentLine) {
    return currentLine + this.quoteChar;
  }

  _isEscapedQuote(char, nextChar) {
    return char === this.escapeChar && nextChar === this.quoteChar;
  }

  _isCarriageReturnNewline(char, inQuotes, nextChar) {
    return char === '\r' && !inQuotes && nextChar === '\n';
  }

  _isNewline(char, inQuotes) {
    return char === '\n' && !inQuotes;
  }
}