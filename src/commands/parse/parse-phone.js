export default class PhoneParser {
  parse(phone, {
    areaCode = true,
    countryCode = true,
    plusPrefix = false,
    removeSpecialChars = true,
    throwError = true,
  } = {}) {
    phone = this.#removeSpecialCharacters(phone);
    if (areaCode) {
      //phone = this.#addAreaCode(phone);
    }
    if (plusPrefix) {
      phone = `+${phone}`;
    }
    return phone;
  }

  #removeSpecialCharacters(phone) {
    return this.#removeSpecialCharacters ? phone.replace(/[^0-9]/g, '') : phone;
  }

  #hasCountryCode(phone) {
    return phone.startsWith('+');
  }
}