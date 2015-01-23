

module.exports = {
  config:{
    enableTypeChecking:{
      type: 'boolean',
      default: true
    },
    enableAutoComplete:{
      type: 'boolean',
      default: true
    },
    typeCheckerCommand:{
      type: 'string',
      default: 'hh_client'
    }
  },
  v:{},
  status:{},
  activate: function(){
    this.v.FS = require('fs');
    this.v.Path = require('path');
    this.v.H = require('./h')(this.v.FS,this.v.Path,this);
    this.v.AC = require('./autocomplete')(this.v.FS,this.v.Path,this);
    this.v.TC = require('./typechecker')(this.v.FS,this.v.Path,this);
    this.v.SSH = require('node-ssh');
    this.status = {
      TypeChecking: false,
      AutoComplete: false
    };
    this.v.H.readConfig().then(function(){
      atom.config.observe('atom-hack.enableTypeChecking',function(status){
        if(status){
          this.v.TC.activate();
        } else {
          this.v.TC.deactivate();
        }
      }.bind(this));
      atom.config.observe('atom-hack.enableAutoComplete',function(status){
        if(status){
          this.v.AC.activate();
        } else {
          this.v.AC.deactivate();
        }
      }.bind(this));
    }.bind(this));
  }
};
