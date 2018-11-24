# homebridge-yeelight-platform

[![NPM](https://nodei.co/npm/homebridge-yeelight-platform.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/homebridge-yeelight-platform/)

[![npm](https://img.shields.io/npm/dm/homebridge-yeelight-platform.svg)](https://www.npmjs.com/package/homebridge-yeelight-platform)
[![npm](https://img.shields.io/npm/v/homebridge-yeelight-platform.svg)](https://www.npmjs.com/package/homebridge-yeelight-platform)
[![CircleCI](https://circleci.com/gh/sahilchaddha/homebridge-yeelight-platform.svg?style=svg)](https://circleci.com/gh/sahilchaddha/homebridge-yeelight-platform)


**Homebridge plugin for Yeelight Lights supporting Scenes/Moods/Color Flow/Custom Presets/Music Flow/Night Mode**

## Description

## Installation

```shell
    $ npm install -g --unsafe-perm homebridge
    $ npm install -g --unsafe-perm homebridge-yeelight-platform
```

Edit config.json. Refer to `config-sample.json`.

## Available Presets Scenes

```
  night_mode
  birthday_party
  candle_flicker
  disco
  flash_notify
  police_1
  police_2
  alarm
  gaming
  calm
  
  custom
```

### Writing Custom Preset

Sample Preset: `"1000, 2, 2700, 100, 500, 1,255, 10, 5000, 7, 0,0, 500, 2, 5000, 1"`

NOTE: Each visible state changing is defined to be a flow tuple that contains 4
elements: `[duration, mode, value, brightness]`. 

A flow expression is a series of flow tuples.
So for above preset example, it means: change CT to 2700K & maximum brightness
gradually in 1000ms, then change color to red & 10% brightness gradually in 500ms, then
stay at this state for 5 seconds, then change CT to 5000K & minimum brightness gradually in
500ms.

`[duration, mode, value, brightness]`:


Duration: Gradual change time or sleep time, in milliseconds,
minimum value 50.


Mode: 1 – color, 2 – color temperature, 7 – sleep.


Value: RGB value when mode is 1, CT value when mode is 2,
Ignored when mode is 7.


Brightness: Brightness value, -1 or 1 ~ 100. Ignored when mode is 7.
When this value is -1, brightness in this tuple is ignored (only color or CT change takes effect). 

## TODO
```
    // Edit README + Add Config Details for lights & custom presets + Add Supported Devices + RGB + shouldturnoff
    // Demo
```

### Demo

![Demo](https://raw.githubusercontent.com/sahilchaddha/homebridge-yeelight-platform/master/demo.gif)

## Compatible Devices

https://www.yeelight.com/en_US/product/wifi-led-c

https://www.yeelight.com/en_US/product/luna-mc

https://www.yeelight.com/en_US/product/luna

https://www.yeelight.com/en_US/product/mijia-lamp

https://www.yeelight.com/en_US/product/lemon-color

https://www.yeelight.com/en_US/product/lemon-ct

https://www.yeelight.com/en_US/product/pitaya-plus

https://www.yeelight.com/en_US/product/eos

https://www.yeelight.com/en_US/product/cherry1s

https://www.mi.com/us/yeelight-led-light-bulb/

https://www.mi.com/us/mi-bedside-lamp/

## Sample Config : 


```json
{
            "platform": "Yeelight-Platform",
            "addResetSwitch": true,
            "shouldTurnOff": true,
            "scenes": [
                {
                    "name": "Dark Cave",
                    "scene": "custom",
                    "params": "2000,1,255,70,2000,1,255,100,5000,1,255,70,3000,1,13369548,100,3000,1,13369548,10"
                },
                {
                    "name": "Break in",
                    "scene": "custom",
                    "params": "500,1,255,100,500,1,255,10"
                },
                {
                    "name": "Disco",
                    "scene": "disco"
                },
                {
                    "name": "Party",
                    "scene": "birthday_party"
                },
                {
                    "name": "Flash",
                    "scene": "flash_notify"
                },
                {
                    "name": "Candle Light",
                    "scene": "candle_flicker"
                },
                {
                    "name": "Police_1",
                    "scene": "police_1"
                },
                {
                    "name": "Police_2",
                    "scene": "police_2"
                },
                {
                    "name": "Alarm",
                    "scene": "alarm"
                },
                {
                    "name": "Gaming",
                    "scene": "gaming"
                },
                {
                    "name": "Night Mode",
                    "scene": "night_mode",
                    "lights": [
                        "0x000000000543dd83"
                    ]
                }
            ]
        }
```

## Lint

```shell
    $ npm run lint
```

## Reference Documentation : 

Yeelight Official API Documentation

https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

## Need Help ?

Get Slack Invite => `https://slackin-znyruquwmv.now.sh/`

Slack Channel => `https://homebridgeteam.slack.com/messages/yeelight-platform`

Slack User => `@sahilchaddha`

### Author

Sahil Chaddha

mail@sahilchaddha.com