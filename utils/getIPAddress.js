const os = require('os')

const getIPAddress = () => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let index = 0; index < iface.length; index++) {
      const alias = iface[index]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

module.exports = {
  getIPAddress
}