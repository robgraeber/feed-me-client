var pe = process.env;
exports.env = {
  'env'      : pe.FEEDME_ENV,
  'apiuri'   : pe.FEEDME_WEB_API_URI,
  'apiuriabs': pe.FEEDME_WEB_API_URI +':'+pe.FEEDME_WEB_API_PORT,
  'apiport'  : pe.FEEDME_WEB_API_PORT,
  'feuri'    : pe.FEEDME_FRONTEND_URI,
  'feuriabs' : pe.FEEDME_FRONTEND_URI+':'+pe.FEEDME_FRONTEND_PORT,
  'feport'   : pe.FEEDME_FRONTEND_PORT,
  'cookie'   : pe.FEEDME_FRONTEND_COOKIE,
  'session'  : pe.FEEDME_FRONTEND_SESSION
};
