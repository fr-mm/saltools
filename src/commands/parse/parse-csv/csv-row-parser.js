export default class CSVRowParser {
  #delimiter;
  #quoteChar;
  #escapeChar;

  constructor({delimiter, quoteChar, escapeChar} = {}) {
    this.#delimiter = delimiter;
    this.#quoteChar = quoteChar;
    this.#escapeChar = escapeChar;
  }

  parse(row) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;

    while (i < row.length) {
      const char = row[i];
      const nextChar = this.#getNextChar(row, i);

      if (this.#isEscapedQuote(char, nextChar)) {
        currentField += this.#quoteChar;
        i += 2;
        continue;
      }

      if (char === this.#quoteChar) {
        const result = this.#handleQuote(inQuotes, nextChar);
        if (result.addQuote) {
          currentField += this.#quoteChar;
          i += 2;
          continue;
        }
        inQuotes = result.inQuotes;
        i++;
        continue;
      }

      if (this.#isDelimiter(char, inQuotes)) {
        this.#finishField(fields, currentField);
        currentField = '';
        i++;
        continue;
      }

      currentField += char;
      i++;
    }

    this.#finishField(fields, currentField);
    return fields;
  }

  #getNextChar(row, index) {
    return index + 1 < row.length ? row[index + 1] : '';
  }

  #isEscapedQuote(char, nextChar) {
    return char === this.#escapeChar && nextChar === this.#quoteChar;
  }

  #finishField(fields, currentField) {
    fields.push(currentField.trim());
  }

  #handleQuote(inQuotes, nextChar) {
    if (inQuotes && nextChar === this.#quoteChar) {
      return { addQuote: true, inQuotes };
    }
    return { addQuote: false, inQuotes: !inQuotes };
  }

  #isDelimiter(char, inQuotes) {
    return char === this.#delimiter && !inQuotes;
  }
}