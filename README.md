# (WIP) homebridge-yeelight-platform

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
    party
    birthday
    sunset
    romantic
```

## TODO
```
    // Calculate CT/Color Accordingly
    // Edit Config.json
    // Edit README
```

### Demo

![Demo](https://raw.githubusercontent.com/sahilchaddha/homebridge-yeelight-platform/master/demo.gif)

## Compatible Devices

## Sample Config : 

WIP
WIP

Config will change in future.

```json
{
    "platforms": [
        {
            "platform": "Yeelight-Platform",
            "debug": true,
            "addResetSwitch": true,
            "scenes": {
                "romantic": "2000,1,255,70,2000,1,255,100,5000,1,255,70,3000,1,13369548,100,3000,1,13369548,10", // Duration,Mode,RGB/CT,Brightness%,
                "sunset": "sunset_preset",
                "birthday": "birthday_preset",
                "party": "party_preset"
            }
        }
    ]
}
```

## Lint

```shell
    $ npm run lint
```

## Need Help ?

Get Slack Invite => `https://slackin-znyruquwmv.now.sh/`

Slack User => `@sahilchaddha`

### Author

Sahil Chaddha

mail@sahilchaddha.com