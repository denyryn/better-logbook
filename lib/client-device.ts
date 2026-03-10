import { UAParser } from "ua-parser-js";

export const clientDevice = {
  name: () => {
    const parser = new UAParser();
    const { device, browser, os } = parser.getResult();

    if (device.vendor) {
      return `${device.vendor} ${device.model} ${browser.name}`;
    }

    return `${os.name} ${browser.name}`;
  },
};
