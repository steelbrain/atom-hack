

module.exports = function(FS,Path){
  class H{

    static readConfig(){
      return new Promise(function(resolve){
        var configPath = atom.project.path+'/.atom-hack';
        FS.exists(configPath,function(status){
          if(!status){
            return resolve()
          } else {
            FS.readFile(configPath,function(_,config){
              try {
                config = JSON.parse(config.toString())
              } catch(error){
                return alert(`Invalid Configuration, Parse Error: ${error.message}`) && resolve();
              }
              var deConfig = this.defaultConfig;
              for (var attr in config){ if(config.hasOwnProperty(attr)) deConfig[attr] = config[attr]; }
              H.config = deConfig;
              resolve();
            }.bind(this));
          }
        }.bind(this));
      }.bind(this));
    }

  }

  H.defaultConfig = {type:"local"};
  H.config = H.defaultConfig;
  return H;
};