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
    sunset
    sunrise
    night_mode
    birthday_party
    movie
    dating_night
    night_fire    
    romantic
    flash_notify
    candle_flicker
    police_1
    police_2
    alarm
    erotic
    rgb_cycle

    custom
```

### Writing Custom Preset

## TODO
```
    // Calculate CT/Color Accordingly
    // Edit Config.json
    // Edit README
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
    "platforms": [
        {
            "platform": "Yeelight-Platform",
            "debug": true,
            "addResetSwitch": true,
            "scenes": [
                {
                    "name": "Sleep Time",
                    "scene": "custom",
                    "params": "2000,1,255,70,2000,1,255,100,5000,1,255,70,3000,1,13369548,100,3000,1,13369548,10"
                },
                {
                    "name": "Romance Time",
                    "scene": "romantic"
                },
                {
                    "name": "Night Mode",
                    "scene": "night_mode",
                    "lights": ["0x000000000543dd83", "0x000000000543dd83"] 
                }
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