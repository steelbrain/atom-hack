# Atom-Hack [![Build Status](https://travis-ci.org/steelbrain/Atom-Hack.svg)](https://travis-ci.org/steelbrain/Atom-Hack) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/steelbrain/atom-hack)


[HackLang](https://github.com/facebook/hhvm) support for [Atom editor](http://atom.io).
AutoComplete has split into a separate Package [AutoComplete-Hack][AH].

## Preview
![Preview](https://cloud.githubusercontent.com/assets/4278113/5449170/4b1597b2-8512-11e4-86f0-2ac210f68263.png)

## Installation

```bash
apm install atom-hack
```

## Usage

By default Atom-Hack assumes that HHVM is installed locally and needs zero-configuration if that's the case. But in case the server is remote, Please add your [configuration][1] to the `.atom-hack` file in your Project root.

__Note__: Make sure to restart your Atom Editor after changing your configuration file.

## Features

 * Validation
 * Remote SSH Servers
 * Remote SFTP Deployment

## License

MIT License © steelbrain

[AH]:https://github.com/steelbrain/AutoComplete-Hack
[1]:wiki/Configuration