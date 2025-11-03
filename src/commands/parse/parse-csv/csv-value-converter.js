export default class CSVValueConverter {
  convert(value) {
    if (this._isEmpty(value)) {
      return '';
    }

    if (this._isBoolean(value)) {
      return this._toBoolean(value);
    }

    if (this._isNumeric(value)) {
      return this._toNumber(value);
    }

    return value;
  }

  _isEmpty(value) {
    return value === '' || value.trim() === '';
  }

  _isBoolean(value) {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === 'false';
  }

  _toBoolean(value) {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true';
  }

  _isNumeric(value) {
    if (value.trim() === '') {
      return false;
    }
    return !isNaN(value);
  }

  _toNumber(value) {
    const numValue = Number(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      return numValue;
    }
    return value;
  }
}