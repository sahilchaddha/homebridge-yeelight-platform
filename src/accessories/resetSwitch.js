//
//  resetSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
const emitter = require('../lib/emitter')
const yeeService = require('../services/deviceService')

const ResetSwitch = class extends Accessory {
  constructor(config, log, homebridge, accessory, shouldTurnOff) {
    super(config, log, homebridge, accessory)
    this.shouldTurnOff = shouldTurnOff
    this.name = 'Reset Yeelight'
    this.ac.context.accType = 'resetSwitch'
  }

  getAccessoryServices() {
    const switchService = new this.homebridge.Service.Switch(this.name)
    switchService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.switchStateChanged.bind(this))
    return [switchService]
  }

  setAccessoryServices() {
    const switchService = this.ac.getService(this.homebridge.Service.Switch)
    switchService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.switchStateChanged.bind(this))
  }

  switchStateChanged(newState, callback) {
    callback()
    yeeService.resetLights(this.shouldTurnOff)
    emitter.emit('YeeLightTurnOff', 'all')
    setTimeout(this.updateState.bind(this), 2000)
  }

  updateState() {
    this.ac.getService(this.homebridge.Service.Switch)
      .getCharacteristic(this.homebridge.Characteristic.On)
      .updateValue(false)
  }

  getState(callback) {
    callback(null, false)
  }

  getModelName() {
    return 'YEE Reset Switch'
  }

  getSerialNumber() {
    return '00-001-ResetSwitch-YEE'
  }
}

module.exports = ResetSwitch
