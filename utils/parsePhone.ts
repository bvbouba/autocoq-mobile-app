import type { CountryCode } from "react-native-country-picker-modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";

type ParsedPhone = {
  countryCode: CountryCode;
  nationalNumber: string;
};

/**
 * Parse a full phone number (E.164) into country code + national number
 * @param fullNumber e.g. "+16137978104"
 * @param fallbackCC default CC if parsing fails (default: "CI")
 */
export function parsePhone(fullNumber: string, fallbackCC: CountryCode = "CI"): ParsedPhone {
  try {
    const parsed = parsePhoneNumberFromString(fullNumber);

    if (parsed) {
      return {
        countryCode: (parsed.country as CountryCode) || fallbackCC,
        nationalNumber: parsed.nationalNumber.toString(),
      };
    }
  } catch (e) {
    // fall through to fallback
  }

  // fallback if parsing fails
  return {
    countryCode: fallbackCC,
    nationalNumber: fullNumber,
  };
}