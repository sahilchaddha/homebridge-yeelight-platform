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
    super(light, log, homebridge, accessory)
    this.name = light.id || 'Yeelight Bulb'
    this.log = log
    if (accessory) {
      yeeService.addCachedDevice(accessory.context.lightInfo)
    }
  }

  updateDevice() { }

  //   getAccessoryServices() {
  //     const switchService = new this.homebridge.Service.Switch(this.name)
  //     switchService
  //       .getCharacteristic(this.homebridge.Characteristic.On)
  //       .on('get', this.getState.bind(this))
  //       .on('set', this.switchStateChanged.bind(this))
  //     return [switchService]
  //   }

  //   switchStateChanged(newState, callback) {
  //     callback()
  //     emitter.emit('YeeLightTurnOff')
  //   }

  //   updateState() {
  //     this.services[0]
  //       .getCharacteristic(this.homebridge.Characteristic.On)
  //       .updateValue(false)
  //   }

  //   getState(callback) {
  //     callback(null, false)
  //   }

  //   getModelName() {
  //     return 'YEE Reset Switch'
  //   }

  //   getSerialNumber() {
  //     return '00-001-ResetSwitch-YEE'
  //   }
}

module.exports = LightBulb
