//
//  flowSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
const emitter = require('../lib/emitter') // YeeLightTurnOff

const FlowSwitch = class extends Accessory {
  constructor(config, log, homebridge, accessory, baseConfig) {
    // var newConfig = {}
    // TODO:
    if (config) {
      // newConfig = config
      // config.name
      // name with id + preset Switch
      // Add to accessory Context
    } else if (baseConfig && accessory) {
      // Get preset switch details from accessory and rematch with baseConfig
    }
    super(config, log, homebridge, accessory)
    this.name = config.name
    this.flow = config.flow
    this.did = config.did
    this.baseConfig = baseConfig
    this.ac.context.accType = 'presetSwitch'
    this.flowName = ''
    this.flowParams = []
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
    emitter.emit('YeeLightTurnOff')
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
