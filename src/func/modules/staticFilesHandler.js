import index from '../../../dist/index.html';
import notFound from '../../../dist/notFound.html';
import indexCss from '../../../dist/css/index.css';
import indexJs from '../../../dist/js/index.js';
import notFoundCss from '../../../dist/css/notFound.css';
import notFoundJs from '../../../dist/js/notFound.js';
import nestLinkConfig from '../../../dist/js/nestlink.config.js';
import favicon from '../../../dist/favicon.png';
import { redirectToNotFound } from '../utils/redirect.js';

const html = {
  index,
  notFound,
};

const js = {
  index: indexJs,
  notFound: notFoundJs,
  'nestlink.config': nestLinkConfig,
};

const css = {
  index: indexCss,
  notFound: notFoundCss,
};

const formatFilename = (filename, ext) => {
  let formattedFilename = filename;
  if (!formattedFilename) {
    return null;
  }
  if (formattedFilename.includes('?')) {
    formattedFilename = formattedFilename.split('?')[0];
  }
  const extStr = `.${ext}`;
  if (!formattedFilename.includes(extStr)) {
    // if no extension in filename, need to redirect to index
    return null;
  } else {
    formattedFilename = formattedFilename.replace(extStr, '');
  }
  return formattedFilename;
};

export default function (mode) {
  if (mode === 'html') {
    return function (ctx) {
      if (ctx.path === '/') {
        ctx.set('Content-Type', 'text/html');
        if (ctx.query.notFound === '1') {
          ctx.body = html.notFound;
          return;
        }
        ctx.body = html.index;
      } else {
        redirectToNotFound(ctx);
      }
    };
  } else if (mode === 'js') {
    return function (ctx) {
      const { filename } = ctx.params;
      const formattedFilename = formatFilename(filename, 'js');
      if (!formattedFilename || !js[formattedFilename]) {
        redirectToNotFound(ctx);
        return;
      }
      ctx.body = js[formattedFilename];
      ctx.set('Content-Type', 'text/javascript');
    };
  } else if (mode === 'css') {
    return function (ctx) {
      const { filename } = ctx.params;
      const formattedFilename = formatFilename(filename, 'css');
      if (!formattedFilename || !css[formattedFilename]) {
        redirectToNotFound(ctx);
        return;
      }
      ctx.body = css[formattedFilename];
      ctx.set('Content-Type', 'text/css');
    };
  } else if (mode === 'favicon') {
    return function (ctx) {
      ctx.set('Content-Type', 'image/png');
      ctx.body = Buffer.from(favicon.replace('data:image/png;base64,', ''), 'base64');
    };
  }
}
