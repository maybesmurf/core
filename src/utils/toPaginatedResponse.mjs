import url from 'url';
import qs from 'qs';
import toListResponse from './toListResponse.mjs';

/**
 * @param {string} base
 * @param {object} query
 * @returns {string}
 */
function appendQuery(base, query) {
  // eslint-disable-next-line node/no-deprecated-api
  const parsed = url.parse(base, true);
  parsed.search = qs.stringify({
    ...parsed.query,
    ...query,
  });
  parsed.query = {};
  return `${url.format(parsed)}`;
}

/**
 * @template {any} TItem
 * @template {{ offset: number }} TPagination
 * @param {import('../Page.mjs').default<TItem, TPagination>} page
 * @param {{ baseUrl?: string, included?: import('./toListResponse.mjs').IncludedOptions }} options
 */
function toPaginatedResponse(
  page,
  { baseUrl = '', included } = {},
) {
  return Object.assign(toListResponse(page.data, {
    included,
    meta: {
      offset: page.currentPage.offset,
      pageSize: page.pageSize,
      results: page.filteredSize,
      total: page.totalSize,
    },
  }), {
    links: {
      self: appendQuery(baseUrl, { page: page.currentPage }),
      next: appendQuery(baseUrl, { page: page.nextPage }),
      prev: appendQuery(baseUrl, { page: page.prevPage }),
    },
  });
}

export default toPaginatedResponse;
