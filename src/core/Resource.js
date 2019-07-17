const {format, parse, resolve} = require('url');


export class Issue {
  constructor(query, data = null) {
    this.path = 'api/issues/:id';
    this.query = query;
    this.data = data;
  }
}


export class Resource {
  static for(url) {
    return new Resource(url);
  }

  constructor(url) {
    this.url = url;
  }

  query(req) {
    const query = req.query;
    const reqUrl = resolve(this.url, req.path).replace(/(\/)?:(\w+)(\W|$)/g, (match, prefix, it) =>
      (query && query.hasOwnProperty(it)) ?
        (prefix + query[it]) : '');

    const url = parse(reqUrl);
    url.query = (url.query && query) ? Object.assign(url.query, query) : (url.query || query);

    return fetch(format(url)).then((response) => response.json());
  }
}
