//
//  base.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = class {
  constructor(config, log, homebridge) {
    this.homebridge = homebridge
    this.log = log

    this.config = config
    this.name = config.name
    this.services = this.getAccessoryServices()
    this.uuid = homebridge.UUIDGen.generate(this.name)
    this.ac = new homebridge.Accessory(this.name, this.uuid)
    this.services.forEach((element) => {
      this.ac.addService(element)
    })
  }

  identify(callback) {
    callback()
  }

  getAccessoryServices() {
    throw new Error('The getSystemServices method must be overridden.')
  }

  getModelName() {
    throw new Error('The getModelName method must be overridden.')
  }

  getSerialNumber() {
    throw new Error('The getSerialNumber method must be overridden.')
  }
}

module.exports = Accessory
