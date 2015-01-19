

module.exports = {
  config:{
    enableTypeChecking:{
      type: 'boolean',
      default: true
    },
    typeCheckerCommand:{
      type: 'string',
      default: 'hh_client'
    },
    enableAutoComplete:{
      type: 'boolean',
      default: true
    }
  },
  v:{},
  activate: function(){
    this.v.FS = require('fs');
    this.v.Path = require('path');
    this.v.H = require('./h')(this.v.FS,this.v.Path);
    this.v.AC = require('./autocomplete');
    this.v.H.readConfig().then(function(){
      atom.config.observe('atom-hack.enableTypeChecking',function(status){
        //TODO: Disable the previous ones
        console.log(status);
      });
    }.bind(this));
  }
};
