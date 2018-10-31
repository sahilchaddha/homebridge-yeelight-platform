//
//  yeelight.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 14/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//
const yeeService = require('./services/deviceService')
const ResetSwitch = require('./accessories/resetSwitch')
const FlowSwitch = require('./accessories/flowSwitch')
const LightBulb = require('./accessories/lightBulb')

const pluginName = 'homebridge-yeelight-platform'
const platformName = 'Yeelight-Platform'

// Available Accessories
var homebridge

function YeelightPlatform(log, config = {}, api) {
  this.log = log
  this.config = config
  this.debug = this.config.debug || false
  this.addResetSwitch = this.config.addResetSwitch || true
  this.lights = {}
  this.switches = []
  yeeService.setHomebridge(homebridge)
  if (this.debug) yeeService.setLogger(log)
  if (api) {
    this.api = api
    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this))
  }
}

YeelightPlatform.prototype = {
  didFinishLaunching: function () {
    yeeService.on('deviceAdded', this.lightDidConnect.bind(this))
    yeeService.on('deviceUpdated', this.lightDidConnect.bind(this))
    yeeService.startDiscovery()
  },
  addBaseAccessories: function () {
    if (this.config.scenes && this.config.scenes.length > 0) {
      var accessories = []
      this.config.scenes.forEach((scene) => {
        accessories.push(new FlowSwitch(scene, this.log, homebridge))
      })
      if (this.addResetSwitch) {
        accessories.push(new ResetSwitch({}, this.log, homebridge))
      }
      this.switches = accessories
      var nativeAcc = []
      accessories.forEach((acc) => {
        nativeAcc.push(acc.accessory())
      });
      this.api.registerPlatformAccessories(pluginName, platformName, nativeAcc);
    }
  },
  configureAccessory: function (accessory) {
    if (accessory.context.accType === 'lightBulb') {
      accessory.reachable = true
      const lightBulb = new LightBulb(null, this.log, homebridge, accessory)
      this.lights[accessory.context.lightInfo.id] = lightBulb
    } else if (accessory.context.accType === 'presetSwitch') {
      const presetSwitch = new FlowSwitch(null, this.log, homebridge, accessory, this.config)
      this.switches.push(presetSwitch)
    } else if (accessory.context.accType === 'resetSwitch') {
      const resetSwitch = new ResetSwitch({}, this.log, homebridge, accessory)
      this.switches.push(resetSwitch)
    }
  },
  lightDidUpdate: function (light) {
    if (this.lights[light.id] != null) {
      this.lights[light.id].updateDevice(light)
      this.api.updatePlatformAccessories([this.lights[light.id].accessory()])
    }
  },
  lightDidConnect: function (light) {
    const lightBulb = new LightBulb(light, this.log, homebridge)
    this.lights[light.id] = lightBulb
    const accessory = lightBulb.accessory()
    this.api.registerPlatformAccessories(pluginName, platformName, [accessory])
  },
}

function YeelightGlobals() {}
YeelightGlobals.setHomebridge = (homebridgeRef) => {
  homebridge = homebridgeRef
}

module.exports = {
  platform: YeelightPlatform,
  globals: YeelightGlobals,
  pluginName: pluginName,
  platformName: platformName,
}
