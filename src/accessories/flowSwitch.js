//
//  flowSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
// const emitter = require('../lib/emitter')

const FlowSwitch = class extends Accessory {
  constructor(config, log, homebridge) {
    super(config, log, homebridge)
    this.name = config.name
    this.flow = config.flow
    this.did = config.did
  }

  getAccessoryServices() {
    const switchService = new this.homebridge.Service.Switch(this.name)
    switchService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.switchStateChanged.bind(this))
    return [switchService]
  }

  switchStateChanged(newState, callback) {
    callback()
    // emitter.emit('YeeLightTurnOff')
  }

  updateState() {
    this.services[0]
      .getCharacteristic(this.homebridge.Characteristic.On)
      .updateValue(false)
  }

  getState(callback) {
    callback(null, false)
  }

  getModelName() {
    return 'YEE Flow Switch'
  }

  getSerialNumber() {
    return '00-001-FlowSwitch-YEE'
  }
}

module.exports = FlowSwitch
