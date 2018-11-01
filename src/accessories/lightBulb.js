//
//  lightBulb.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
const yeeService = require('../services/deviceService')

const LightBulb = class extends Accessory {
  constructor(light, log, homebridge, accessory = null) {
    var lightInfo = {}
    if (light) {
      lightInfo = light
      lightInfo.name = light.id
    } else if (accessory) {
      lightInfo = JSON.parse(accessory.context.lightInfo)
      yeeService.addCachedDevice(lightInfo)
    }
    super(lightInfo, log, homebridge, accessory)
    this.light = lightInfo
    this.name = lightInfo.name
    this.log = log
    if (light) {
      this.ac.context.lightInfo = JSON.stringify(lightInfo)
    }

    // Connect Device
    // Bind Device Events
  }

  updateDevice(light) {
    var lightInfo = light
    lightInfo.name = light.id
    this.ac.context.lightInfo = JSON.stringify(lightInfo)
    this.light = lightInfo
    // Disconnect
    // Connect
  }

  connectDevice() {

  }

  bindDevice() {

  }

  deviceStateChanged(props) {
    this.log(props)
  }

  getAccessoryServices() {
    // const switchService = new this.homebridge.Service.Switch(this.name)
    return []
  }

  setAccessoryServices() {

  }

  getModelName() {
    return 'YeeLightBulb'
  }

  getSerialNumber() {
    return this.name
  }
}

module.exports = LightBulb
