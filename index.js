//
//  index.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.

// Yeelight Platform
const Yeelight = require('./src/yeelight')

module.exports = (homebridge) => {
  var homebridgeGlobals = {
    Service: homebridge.hap.Service,
    Characteristic: homebridge.hap.Characteristic,
    Accessory: homebridge.platformAccessory,
    UUIDGen: homebridge.hap.uuid,
  }
  Yeelight.globals.setHomebridge(homebridgeGlobals)
  homebridge.registerPlatform(Yeelight.pluginName, Yeelight.platformName, Yeelight.platform, true)
}
