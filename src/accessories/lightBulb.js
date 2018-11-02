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
    this.isConnected = false
    this.bindDevice()
    this.connectDevice()
  }

  updateDevice(light) {
    var lightInfo = light
    lightInfo.name = light.id
    this.ac.context.lightInfo = JSON.stringify(lightInfo)
    this.light = lightInfo
    if (this.isConnected) {
      this.disconnectDevice()
      this.connectDevice()
    }
  }

  connectDevice() {
    const device = yeeService.getDevice(this.light.id)
    device.connect()
  }

  disconnectDevice() {
    const device = yeeService.getDevice(this.light.id)
    device.disconnect()
  }

  bindDevice() {
    const device = yeeService.getDevice(this.light.id)

    device.on('deviceUpdate', (newProps) => {
      this.deviceStateChanged(newProps)
    })

    device.on('connected', () => {
      this.log('Connected', this.name)
      this.isConnected = true
    })

    device.on('disconnected', () => {
      this.log('Disconnected', this.name)
      this.isConnected = false
    })
  }

  sendCommand(type, value) {
    // TODO: Calculate CT/Color Accordingly

    this.log('Sending Command to LightBulb' + this.name, type, value)
    var cmd = {
      id: -1,
    }
    switch (type) {
      case 'power':
        cmd.method = 'set_power'
        cmd.params = [value, 'smooth', 500]
        break
      case 'hue':
        cmd.method = 'set_hsv'
        cmd.params = [this.hue, this.saturation, 'smooth', 500]
        break
      case 'brightness':
        cmd.method = 'set_bright'
        cmd.params = [value, 'smooth', 500]
        break
      case 'saturation':
        cmd.method = 'set_hsv'
        cmd.params = [this.hue, this.saturation, 'smooth', 500]
        break
      case 'ct':
        cmd.method = 'set_ct_abx'
        cmd.params = [this.ct, 'smooth', 500]
        break
      default:
        break
    }

    cmd.params = []

    yeeService.sendCommand([this.light.id], cmd)
  }

  deviceStateChanged(props) {
    if (props != null && props.id != null && props.id === 199 && props.result != null && props.result.length > 0) {
      const results = props.result
      if (results[0] === 'on') {
        this.isOn = true
      } else {
        this.isOn = false
      }

      this.brightness = Number(results[1])
      this.rgb = Number(results[2])
      this.hue = Number(results[5])
      this.saturation = Number(results[6])
      this.ct = Number(results[7])
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
        this.sendCommand('power', this.isOn ? 'on' : 'off')
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
