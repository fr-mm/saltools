export default class CSVValueConverter {
  convert(value) {
    if (this.#isEmpty(value)) {
      return '';
    }

    if (this.#isBoolean(value)) {
      return this.#toBoolean(value);
    }

    if (this.#isNumeric(value)) {
      return this.#toNumber(value);
    }

    return value;
  }

  #isEmpty(value) {
    return value === '' || value.trim() === '';
  }

  #isBoolean(value) {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === 'false';
  }

  #toBoolean(value) {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true';
  }

  #isNumeric(value) {
    if (value.trim() === '') {
      return false;
    }
    return !isNaN(value);
  }

  #toNumber(value) {
    const numValue = Number(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      return numValue;
    }
    return value;
  }
}