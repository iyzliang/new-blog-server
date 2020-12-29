const { secretOrPrivateKey, refreshKey, DBUser, DBPWD, DBName, uploadPath, uploadUrl } = process.env

module.exports = {
  secretOrPrivateKey,
  refreshKey,
  DBUser,
  DBPWD,
  DBName,
  uploadPath,
  uploadUrl,
  host: 'data.iyzliang.com',
  port: 27017,
  jwtUnlessPath: ['/api/common/v1/register', '/api/common/v1/login', '/api/common/v1/refresh-token']
}