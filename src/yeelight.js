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
  this.config = config || {}
  this.debug = this.config.debug || false
  this.pollingInterval = this.config.pollingInterval || 15000
  this.addResetSwitch = (typeof this.config.addResetSwitch === 'undefined') ? true : this.config.addResetSwitch
  this.shouldTurnOff = (typeof this.config.shouldTurnOff === 'undefined') ? true : this.config.shouldTurnOff
  this.lights = {}
  this.switches = {}
  this.resetSwitch = null
  homebridge.debug = this.debug
  yeeService.setHomebridge(homebridge, this.pollingInterval)
  if (this.debug) yeeService.setLogger(log)
  if (api) {
    this.api = api
    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this))
  }
}

YeelightPlatform.prototype = {
  info: function (...args) {
    if (this.debug) this.log(args)
  },
  didFinishLaunching: function () {
    if (this.config != null && this.config.platform != null && this.config.platform.length > 0) {
      yeeService.on('deviceAdded', this.lightDidConnect.bind(this))
      yeeService.on('deviceUpdated', this.lightDidUpdate.bind(this))
      this.info(' ** Starting discovery **')
      yeeService.startDiscovery()

      this.addBaseAccessories()
    } else {
      this.log('Yeelight-Platform not found in config.json. Disabling homebridge-yeelight-platform.')
    }
  },
  addBaseAccessories: function () {
    this.info('** Adding Base Accessories')
    if (this.config.scenes && this.config.scenes.length > 0) {
      var accessories = []
      this.config.scenes.forEach((scene) => {
        if (this.switches[scene.name] != null) return
        this.info('** Adding new FlowSwitch ' + scene.name)
        const fSwitch = new FlowSwitch(scene, this.log, homebridge, null, null, this.shouldTurnOff)
        this.switches[scene.name] = fSwitch
        accessories.push(fSwitch)
      })

      if (this.addResetSwitch && this.resetSwitch == null) {
        this.info('** Adding ResetSwitch')
        const rSwitch = new ResetSwitch({ name: 'Reset Scene' }, this.log, homebridge, null, this.shouldTurnOff)
        this.resetSwitch = rSwitch
        accessories.push(rSwitch)
      }

      var nativeAcc = []
      accessories.forEach((acc) => {
        nativeAcc.push(acc.accessory())
      })

      this.api.registerPlatformAccessories(pluginName, platformName, nativeAcc)
    }
  },
  configureAccessory: function (accessory) {
    if (accessory.context.accType === 'lightBulb') {
      this.info('** Configure LightBulb ' + JSON.parse(accessory.context.lightInfo).id)
      accessory.reachable = true
      const lightBulb = new LightBulb(null, this.log, homebridge, accessory, this.config)
      this.lights[JSON.parse(accessory.context.lightInfo).id] = lightBulb
    } else if (accessory.context.accType === 'presetSwitch') {
      this.info('** Configure FlowSwitch ' + accessory.context.sceneName)
      const presetSwitch = new FlowSwitch(null, this.log, homebridge, accessory, this.config, this.shouldTurnOff)
      this.switches[accessory.context.sceneName] = presetSwitch
    } else if (accessory.context.accType === 'resetSwitch') {
      this.info('** Configuring Reset Switch')
      const resetSwitch = new ResetSwitch({ name: 'Reset Scene' }, this.log, homebridge, accessory, this.shouldTurnOff)
      this.resetSwitch = resetSwitch
    }
  },
  lightDidUpdate: function (light) {
    this.info('** Light Did Update ' + light.id)
    if (this.lights[light.id] != null) {
      this.lights[light.id].updateDevice(light)
      this.info('** Updating Homekit Accessory ' + light.id)
      this.api.updatePlatformAccessories([this.lights[light.id].accessory()])
    }
  },
  lightDidConnect: function (light) {
    this.info('** Discovered New Light ' + light.id)
    const lightBulb = new LightBulb(light, this.log, homebridge, null, this.config)
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
