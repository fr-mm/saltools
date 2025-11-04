export default class CSVLineSplitter {
  #quoteChar;
  #escapeChar;

  constructor({quoteChar, escapeChar} = {}) {
    this.#quoteChar = quoteChar;
    this.#escapeChar = escapeChar;
  }

  split(content) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;
    let i = 0;

    while (i < content.length) {
      const char = content[i];
      const nextChar = this.#getNextChar(content, i);

      if (this.#isEscapedQuote(char, nextChar)) {
        currentLine = this.#addEscapedQuote(currentLine);
        i += 2;
        continue;
      }

      if (char === this.#quoteChar) {
        inQuotes = !inQuotes;
        currentLine += char;
        i++;
        continue;
      }

      if (this.#isCarriageReturnNewline(char, inQuotes, nextChar)) {
        this.#finishLine(lines, currentLine);
        currentLine = '';
        i += 2;
        continue;
      }

      if (this.#isNewline(char, inQuotes)) {
        this.#finishLine(lines, currentLine);
        currentLine = '';
        i += 1;
        continue;
      }

      currentLine += char;
      i++;
    }

    this.#addRemainingLine(lines, currentLine);
    return lines;
  }

  #getNextChar(content, index) {
    return index + 1 < content.length ? content[index + 1] : '';
  }

  #addRemainingLine(lines, currentLine) {
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }

  #finishLine(lines, currentLine) {
    lines.push(currentLine);
  }

  #addEscapedQuote(currentLine) {
    return currentLine + this.#quoteChar;
  }

  #isEscapedQuote(char, nextChar) {
    return char === this.#escapeChar && nextChar === this.#quoteChar;
  }

  #isCarriageReturnNewline(char, inQuotes, nextChar) {
    return char === '\r' && !inQuotes && nextChar === '\n';
  }

  #isNewline(char, inQuotes) {
    return char === '\n' && !inQuotes;
  }
}