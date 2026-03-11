import { UAParser } from "ua-parser-js";

export const clientDevice = {
  name: (uaString?: string | null) => {
    const parser = new UAParser(uaString || undefined);
    const { device, browser, os } = parser.getResult();

    if (device.vendor) {
      return `${device.vendor} ${device.model} ${browser.name}`;
    }

    return `${os.name} ${browser.name}`;
  },
};
