/* eslint-disable */
//
//  color.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 02/11/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//
const convert = require('color-convert')

const maxCT = 6500
const minHKCT = 500
const maxHKCT = 140

const lineMap = function (x1, y1, x2, y2, x) {
  var k = (y2 - y1) / (x2 - x1)
  var b = y1 - k * x1
  const d = k * x + b
  return parseInt(d)
}

class Color {
  static HSVToRGB(h,s,v) {
    const color = convert.hsv.rgb([h, s, v])
    const r = color[0]
    const g = color[1]
    const b = color[2]
    return 256 * 256 * r + 256 * g + b
  }

  static RGBToHSV(rgb) {
    const r = rgb>>16
    const g = rgb>>8&255
    const b = rgb&255
    const color = convert.rgb.hsv([r, g, b])
    return {hue: color[0], sat: color[1]
    }
  }

  static KCTToHKT(ct, model) {
    const minCT = (model.indexOf('bslamp') !== -1) ? 1700 : 2700
    return lineMap(minCT, minHKCT, maxCT, maxHKCT, parseInt(ct, 10))
  }

  static HKTToKCT(ct, model) {
    const minCT = (model.indexOf('bslamp') !== -1) ? 1700 : 2700
    return lineMap(minHKCT, minCT, maxHKCT, maxCT, parseInt(ct, 10))
  }
}

module.exports = Color
