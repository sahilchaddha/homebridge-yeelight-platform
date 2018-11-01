//
//  lightBulb.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
const yeeService = require('../services/deviceService')

const coloredModels = ['color', 'stripe', 'bedside', 'bslamp']
const ctModels = ['mono', 'ceiling2']

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

    this.isOn = false
    this.brightness = 100
    this.rgb = 255
    this.hue = 36
    this.saturation = 100
    this.ct = 2700
    // TODO: 
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

  sendCommand(type, value) {
    this.log(type, value)
  }

  deviceStateChanged(props) {
    if (props != null && props.id != null && props.id === 199 && props.result != null && props.result.length > 0) {
      const results = props.result
      if (results[0] === 'on') {
        this.isOn = true
      } else {
        this.isOn = false
      }
      // TODO: To Numbers
      this.brightness = results[1]
      this.rgb = results[2]
      this.hue = results[5]
      this.saturation = results[6]
      this.ct = results[7]
    }
  }

  updateDeviceProps() {
    const lightbulbService = this.ct.getService(this.homebridge.Service.Lightbulb)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .updateValue(this.isOn)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.Brightness)
      .updateValue(this.brightness)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.Saturation)
      .updateValue(this.saturation)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.Hue)
      .updateValue(this.hue)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.ColorTemperature)
      .updateValue(this.ct)
  }

  getAccessoryServices() {
    const lightbulbService = new this.homebridge.Service.Lightbulb(this.name)

    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', (callback) => {
        callback(null, this.isOn)
      })
      .on('set', (value, callback) => {
        this.isOn = value
        this.sendCommand('power', this.isOn)
        callback()
      })

    lightbulbService
      .addCharacteristic(this.homebridge.Characteristic.Brightness)
      .on('get', (callback) => {
        callback(null, this.brightness)
      })
      .on('set', (value, callback) => {
        this.brightness = value
        this.sendCommand('brightness', this.brightness)
        callback()
      })


    if (this.shouldAddColorChar(this.config.model)) {
      lightbulbService
        .addCharacteristic(this.homebridge.Characteristic.Hue)
        .on('get', (callback) => {
          callback(null, this.hue)
        })
        .on('set', (value, callback) => {
          this.hue = value
          this.sendCommand('hue', this.hue)
          callback()
        })

      lightbulbService
        .addCharacteristic(this.homebridge.Characteristic.Saturation)
        .on('get', (callback) => {
          callback(null, this.saturation)
        })
        .on('set', (value, callback) => {
          this.saturation = value
          this.sendCommand('saturation', this.saturation)
          callback()
        })
    }

    if (this.shouldAddCTChar(this.config.model)) {
      lightbulbService
        .addOptionalCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        .getCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        .on('get', (callback) => {
          callback(null, this.ct)
        })
        .on('set', (value, callback) => {
          this.ct = value
          this.sendCommand('ct', this.ct)
          callback()
        })
    }

    return [lightbulbService]
  }

  setAccessoryServices() {
    const lightbulbService = this.ac.getService(this.homebridge.Service.Lightbulb)

    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', (callback) => {
        callback(null, this.isOn)
      })
      .on('set', (value, callback) => {
        this.isOn = value
        this.sendCommand('power', this.isOn)
        callback()
      })

    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.Brightness)
      .on('get', (callback) => {
        callback(null, this.brightness)
      })
      .on('set', (value, callback) => {
        this.brightness = value
        this.sendCommand('brightness', this.brightness)
        callback()
      })

    if (this.shouldAddColorChar(this.config.model)) {
      lightbulbService
        .getCharacteristic(this.homebridge.Characteristic.Hue)
        .on('get', (callback) => {
          callback(null, this.hue)
        })
        .on('set', (value, callback) => {
          this.hue = value
          this.sendCommand('hue', this.hue)
          callback()
        })

      lightbulbService
        .getCharacteristic(this.homebridge.Characteristic.Saturation)
        .on('get', (callback) => {
          callback(null, this.saturation)
        })
        .on('set', (value, callback) => {
          this.saturation = value
          this.sendCommand('saturation', this.saturation)
          callback()
        })
    }

    if (this.shouldAddCTChar(this.config.model)) {
      lightbulbService
        .addOptionalCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        .getCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        .on('get', (callback) => {
          callback(null, this.ct)
        })
        .on('set', (value, callback) => {
          this.ct = value
          this.sendCommand('ct', this.ct)
          callback()
        })
    }
  }

  shouldAddColorChar(model) {
    var flag = false
    coloredModels.forEach((cModel) => {
      if (model.indexOf(cModel) !== -1) {
        flag = true
      }
    })
    return flag
  }

  shouldAddCTChar(model) {
    var flag = false
    ctModels.forEach((ctModel) => {
      if (model.indexOf(ctModel) !== -1) {
        flag = true
      }
    })
    return !flag
  }

  getModelName() {
    return 'YeeLightBulb'
  }

  getSerialNumber() {
    return this.name
  }
}

module.exports = LightBulb
