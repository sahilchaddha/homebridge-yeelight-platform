//
//  lightBulb.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 15/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base')
const yeeService = require('../services/deviceService')
const Color = require('../utils/color')

const LightBulb = class extends Accessory {
  constructor(light, log, homebridge, accessory = null, baseConfig) {
    var lightInfo = {}
    if (light) {
      lightInfo = light
      lightInfo.name = light.id
    } else if (accessory) {
      lightInfo = JSON.parse(accessory.context.lightInfo)
      yeeService.addCachedDevice(lightInfo)
    }
    super(lightInfo, log, homebridge, accessory)
    this.ac.context.accType = 'lightBulb'
    this.light = lightInfo
    this.name = lightInfo.name
    this.log = log
    if (light) {
      this.ac.context.lightInfo = JSON.stringify(lightInfo)
    }

    this.colorPalleteRGB = false

    if (baseConfig.rgb && baseConfig.rgb[this.name]) {
      this.log('Setting Color Model to RGB : ', this.name)
      this.colorPalleteRGB = true
    }

    this.isOn = false
    this.brightness = 100
    this.rgb = 255
    this.hue = 36
    this.saturation = 100
    this.ct = 200
    this.isConnected = false
    this.bindDevice()
    this.connectDevice()
  }

  logMessage(...args) {
    if (this.homebridge.debug) {
      this.log(args)
    }
  }

  updateDevice(light) {
    var lightInfo = light
    lightInfo.name = light.id
    this.ac.context.lightInfo = JSON.stringify(lightInfo)
    this.light = lightInfo
    this.logMessage('** Device Location Updated. Should Disconnect & Reconnect : ' + this.isConnected, light)
    if (this.isConnected) {
      this.isConnected = false
      this.disconnectDevice()
      this.connectDevice()
    }
  }

  connectDevice() {
    const device = yeeService.getDevice(this.light.id)
    device.yeeDevice.connect()
  }

  disconnectDevice() {
    const device = yeeService.getDevice(this.light.id)
    device.yeeDevice.disconnect()
  }

  bindDevice() {
    const device = yeeService.getDevice(this.light.id)

    device.yeeDevice.on('deviceUpdate', (newProps) => {
      this.deviceStateChanged(newProps)
    })

    device.yeeDevice.on('connected', () => {
      this.log('Connected', this.name)
      this.isConnected = true
    })

    device.yeeDevice.on('disconnected', () => {
      this.log('Disconnected', this.name)
      this.isConnected = false
    })
  }

  sendCommand(type, value) {
    this.log('Sending Command to LightBulb' + this.name, type, value)
    var cmd = {
      id: -1,
    }
    switch (type) {
      case 'power':
        cmd.method = 'set_power'
        cmd.params = [value, 'smooth', 500]
        break
      case 'brightness':
        cmd.method = 'set_bright'
        cmd.params = [value, 'smooth', 500]
        break
      case 'hue':
        if (this.colorPalleteRGB) {
          cmd.method = 'set_rgb'
          cmd.params = [Color.HSVToRGB(this.hue, this.saturation, this.brightness), 'smooth', 500]
        } else {
          cmd.method = 'set_hsv'
          cmd.params = [this.hue, this.saturation, 'smooth', 500]
        }
        break
      case 'saturation':
        if (this.colorPalleteRGB) {
          cmd.method = 'set_rgb'
          cmd.params = [Color.HSVToRGB(this.hue, this.saturation, this.brightness), 'smooth', 500]
        } else {
          cmd.method = 'set_hsv'
          cmd.params = [this.hue, this.saturation, 'smooth', 500]
        }
        break
      case 'ct':
        cmd.method = 'set_ct_abx'
        cmd.params = [Color.HKTToKCT(this.ct, this.light.model), 'smooth', 500]
        break
      default:
        break
    }

    yeeService.sendCommand([this.light.id], cmd)
  }

  deviceStateChanged(props) {
    this.logMessage('Device Response', this.light.id, props)
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
      if (this.colorPalleteRGB) {
        const hsl = Color.RGBToHSV(this.rgb)
        this.hue = hsl.hue
        this.saturation = hsl.sat
      }
      this.ct = Color.KCTToHKT(Number(results[7]), this.light.model)
      this.updateDeviceProps()
    }
  }

  updateDeviceProps() {
    const lightbulbService = this.ac.getService(this.homebridge.Service.Lightbulb)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .updateValue(this.isOn)
    lightbulbService
      .getCharacteristic(this.homebridge.Characteristic.Brightness)
      .updateValue(this.brightness)
    if (this.shouldAddColorChar()) {
      lightbulbService
        .getCharacteristic(this.homebridge.Characteristic.Saturation)
        .updateValue(this.saturation)
      lightbulbService
        .getCharacteristic(this.homebridge.Characteristic.Hue)
        .updateValue(this.hue)
    }
    if (this.shouldAddCTChar()) {
      lightbulbService
        .getCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        .updateValue(this.ct)
    }
  }

  getAccessoryServices() {
    const lightbulbService = new this.homebridge.Service.Lightbulb(this.name)
    var isCT = false
    var isColor = false
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


    if (this.shouldAddColorChar()) {
      isColor = true
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

    if (this.shouldAddCTChar()) {
      isCT = true
      lightbulbService
        // TODO:
        .addCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        // .addOptionalCharacteristic(this.homebridge.Characteristic.ColorTemperature)
      // lightbulbService
        // .getCharacteristic(this.homebridge.Characteristic.ColorTemperature)
        .on('get', (callback) => {
          callback(null, this.ct)
        })
        .on('set', (value, callback) => {
          this.ct = value
          this.sendCommand('ct', this.ct)
          callback()
        })
    }

    this.logMessage('Creating New Services ' + this.config.id + ' with color: ' + isColor + ' with ct: ' + isCT)
    return [lightbulbService]
  }

  setAccessoryServices() {
    const lightbulbService = this.ac.getService(this.homebridge.Service.Lightbulb)
    var isCT = false
    var isColor = false
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
      .getCharacteristic(this.homebridge.Characteristic.Brightness)
      .on('get', (callback) => {
        callback(null, this.brightness)
      })
      .on('set', (value, callback) => {
        this.brightness = value
        this.sendCommand('brightness', this.brightness)
        callback()
      })

    if (this.shouldAddColorChar()) {
      isColor = true
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

    if (this.shouldAddCTChar()) {
      isCT = true
      // TODO:
      // lightbulbService
      //   .addOptionalCharacteristic(this.homebridge.Characteristic.ColorTemperature)
      lightbulbService
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

    this.logMessage('Configuring Cached Services ' + this.config.id + ' with color: ' + isColor + ' with ct: ' + isCT)
  }

  shouldAddColorChar() {
    if (this.config && this.config.support && this.config.support.length > 0) {
      const supportedTypes = this.config.support.split(' ')
      var flag = false
      supportedTypes.forEach((item) => {
        if (item === 'set_rgb' || item === 'set_hsv') {
          flag = true
        }
      })
      return flag
    }
    /*eslint no-console: 0*/
    console.log(' *** ERROR *** CONFIG FAILED TO LOAD ** ')
    return false
  }

  shouldAddCTChar() {
    if (this.config && this.config.support && this.config.support.length > 0) {
      const supportedTypes = this.config.support.split(' ')
      var flag = false
      supportedTypes.forEach((item) => {
        if (item === 'set_ct_abx') {
          flag = true
        }
      })
      return flag
    }
    /*eslint no-console: 0*/
    console.log(' *** ERROR *** CONFIG FAILED TO LOAD ** ')
    return false
  }

  getModelName() {
    return 'YeeLightBulb'
  }

  getSerialNumber() {
    return this.name
  }
}

module.exports = LightBulb
