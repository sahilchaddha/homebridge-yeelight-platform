//
//  yeelight.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 14/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//
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
  this.lights = {}
  this.flows = []
  this.resetSwitch = null
  if (api) {
    this.api = api
    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this))
  }
}

YeelightPlatform.prototype = {
  didFinishLaunching: function () {
    // Start Discovery
    const self = this
    YeeAgent.discover((light, res) => {
      self.lightDidConnect(light, res.headers.Location)
    })
  },
  configureAccessory: function (accessory) {
    console.log("Configure")
    // Configure Old Accessory
    // LightSwitch
    // LightBulb
    // Probably want to cache using MAC. Only constant in so many variables
    console.log(accessory)
  },
  lightDidConnect: function (light, address) {
    // Cache Light
    // Check if already added
    // Add newly light to service
    console.log(light.id)
    // return
    var accessories = []
    if (this.config.addResetSwitch && !this.resetSwitch) {
      this.resetSwitch = new ResetSwitch({}, this.log, homebridge)
      accessories.push(this.resetSwitch)
    }

    if (this.config.flows != null) {
      Object.keys(this.config.flows).forEach((flow) => {
        const flowSwitch = new FlowSwitch(flow, this.log, homebridge)
        accessories.push(flowSwitch)
        this.flows.push(flowSwitch)
      })
    }
    // this.api.registerPlatformAccessories(pluginName, platformName, [resetSwitch.ac]);

    /*
   {   id: '0x00000000052ebb4a',
  connected: true,
  name: '',
  power: 'on',
  bright: '100',
  rgb: '16711680',
  ct: '4000',
  hue: '359',
  sat: '100',
  color_mode: '2',
  delayoff: '0',
  flowing: '0',
  flow_params: '',
  music_on: '0' }
    */
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
