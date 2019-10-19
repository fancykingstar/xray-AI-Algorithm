var Y = require('yaml')
var fs = require('fs')

const file = fs.readFileSync('./config.yml', 'utf8')
o = Y.parse(file)

exports.upload_path = o['upload_path']
exports.heatmap_path = o['heatmap_path']
exports.grpc_bind_address = o['grpc_bind_address']
exports.app_port = o['app_port']
