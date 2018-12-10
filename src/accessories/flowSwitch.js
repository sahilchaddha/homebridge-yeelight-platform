//
//  flowSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
const emitter = require('../lib/emitter') // YeeLightTurnOff
const yeeService = require('../services/deviceService')
const flows = require('../flows')

const FlowSwitch = class extends Accessory {
  constructor(config, log, homebridge, accessory, baseConfig, shouldTurnOff) {
    var newConfig = {}
    if (config) {
      newConfig = config
    } else if (baseConfig && accessory) {
      const sceneName = accessory.context.sceneName
      newConfig.name = sceneName
    }
    super(newConfig, log, homebridge, accessory)
    this.shouldTurnOff = shouldTurnOff
    this.name = newConfig.name
    this.baseConfig = baseConfig
    this.ac.context.accType = 'presetSwitch'
    this.flowName = 'disco'
    this.flowParams = []
    this.lights = []
    this.isOn = false
    if (config) {
      this.flowName = config.name
      this.flowParams = config.params
      this.flowScene = config.scene
      this.lights = config.lights
      this.ac.context.sceneName = config.name
    } else if (baseConfig && accessory) {
      this.flowName = accessory.context.sceneName

      if (baseConfig.scenes && baseConfig.scenes.length > 0) {
        baseConfig.scenes.forEach((baseScene) => {
          if (baseScene.name === this.flowName) {
            this.flowScene = baseScene.scene
            this.flowParams = baseScene.params
            this.lights = baseScene.lights
          }
        })
      }
    }

    this.bindEvents()
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

  getFlowParams() {
    if (this.flowScene === 'custom') {
      return [0, 0, this.flowParams]
    }

    return flows[this.flowScene]
  }

  switchStateChanged(newState, callback) {
    this.isOn = newState
    var lights = this.lights
    if (lights == null || lights.length <= 0) {
      lights = Object.keys(yeeService.devices)
    }
    if (this.isOn) {
      // Turn off other running flows
      emitter.emit('YeeLightTurnOff', this.name)
      // Send Turn on Flow Command
      var onCmd = {
        id: -1,
        method: 'set_power',
        params: ['on', 'smooth', 500],
      }
      yeeService.sendCommand(lights, onCmd)

      setTimeout(() => {
        var flowCmd = {
          id: -1,
          method: 'start_cf',
          params: this.getFlowParams(),
        }
        if (this.flowScene === 'night_mode') {
          flowCmd.method = 'set_power'
        }
        yeeService.sendCommand(lights, flowCmd)
        callback()
      }, 2000)
    } else {
      // Send Turn off flow Command
      var offCmd = {
        id: -1,
        method: 'stop_cf',
        params: [],
      }

      if (this.flowScene === 'night_mode') {
        offCmd.method = 'set_power'
        // TODO: 
        offCmd.params = ['on', 'smooth', 500, 3]
      }

      yeeService.sendCommand(lights, offCmd)

      if (this.shouldTurnOff) {
        setTimeout(() => {
          yeeService.sendCommand(lights, {
            id: -1,
            method: 'set_power',
            params: ['off', 'sudden', 500],
          })
          callback()
        }, 5000)
      } else {
        callback()
      }
    }
  }

  bindEvents() {
    emitter.on('YeeLightTurnOff', (name) => {
      if (name === this.name) return
      this.switchOff()
    })
  }

  switchOff() {
    this.isOn = false
    this.ac.getService(this.homebridge.Service.Switch)
      .getCharacteristic(this.homebridge.Characteristic.On)
      .updateValue(this.isOn)
  }

  getState(callback) {
    callback(null, this.isOn)
  }

  getModelName() {
    return 'YEE Flow Switch'
  }

  getSerialNumber() {
    return '00-001-FlowSwitch-YEE'
  }
}

module.exports = FlowSwitch
