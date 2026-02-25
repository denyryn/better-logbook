export class URLParamsBuilder {
  private params: { param: string; value: string }[];
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.params = [];
  }

  addParam(param: string, value: string) {
    this.params.push({ param, value });
    return this;
  }

  toString() {
    if (this.params.length === 0) {
      return this.baseUrl;
    }
    const queryString = this.params
      .map(
        ({ param, value }) =>
          `${encodeURIComponent(param)}=${encodeURIComponent(value)}`,
      )
      .join("&");
    return `${this.baseUrl}?${queryString}`;
  }
}
