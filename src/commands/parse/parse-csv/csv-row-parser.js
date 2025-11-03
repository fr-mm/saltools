export default class CSVRowParser {
  constructor({delimiter, quoteChar, escapeChar} = {}) {
    this.delimiter = delimiter;
    this.quoteChar = quoteChar;
    this.escapeChar = escapeChar;
  }

  parse(row) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;

    while (i < row.length) {
      const char = row[i];
      const nextChar = this._getNextChar(row, i);

      if (this._isEscapedQuote(char, nextChar)) {
        currentField += this.quoteChar;
        i += 2;
        continue;
      }

      if (char === this.quoteChar) {
        const result = this._handleQuote(inQuotes, nextChar);
        if (result.addQuote) {
          currentField += this.quoteChar;
          i += 2;
          continue;
        }
        inQuotes = result.inQuotes;
        i++;
        continue;
      }

      if (this._isDelimiter(char, inQuotes)) {
        this._finishField(fields, currentField);
        currentField = '';
        i++;
        continue;
      }

      currentField += char;
      i++;
    }

    this._finishField(fields, currentField);
    return fields;
  }

  _getNextChar(row, index) {
    return index + 1 < row.length ? row[index + 1] : '';
  }

  _isEscapedQuote(char, nextChar) {
    return char === this.escapeChar && nextChar === this.quoteChar;
  }

  _finishField(fields, currentField) {
    fields.push(currentField.trim());
  }

  _handleQuote(inQuotes, nextChar) {
    if (inQuotes && nextChar === this.quoteChar) {
      return { addQuote: true, inQuotes };
    }
    return { addQuote: false, inQuotes: !inQuotes };
  }

  _isDelimiter(char, inQuotes) {
    return char === this.delimiter && !inQuotes;
  }
}