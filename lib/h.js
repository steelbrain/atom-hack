

module.exports = function(FS,Path,Main){
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
    static spawn(){
      return this.exec([],null,atom.project.path);
    }
    static exec(args:Array, input:String, path:String){
      var
        toReturn = {stderr:'',stdout:'',status:-1},
        command = atom.config.get('Atom-Hack.typeCheckerCommand');
      return new Promise(function(resolve){
        //TODO: Use ssh thing if it's a remote server
        var Proc = Main.v.CP.spawn(command,args,{cwd:Main.v.Path.dirname(path)});
        if(input && input.length){
          Proc.stdin.write(input);
        }
        Proc.stdin.end();
        Proc.stdout.on('data',function(data){
          toReturn.stdout += data;
        });
        Proc.stderr.on('data',function(data){
          toReturn.stderr += data;
        });
        Proc.on('exit',function(){
          resolve(toReturn);
        });
      });
    }
    static ACSuggestions(editor){
      return new Promise(function(resolve){
        var
          Buffer = editor.getBuffer(),
          Text = Buffer.cachedText,
          Index = Buffer.characterIndexForPosition(editor.getCursorBufferPosition());
        Text = Text.substr(0,Index)+'AUTO332'+Text.substr(Index);
        this.exec(['--auto-complete'],Text,editor.getPath()).then(function(result){
          result = result.stdout.split("\n").filter(e => e);
          console.log(result);
        }.bind(this));
      }.bind(this));
    }
  }

  H.defaultConfig = {type:"local"};
  H.config = H.defaultConfig;
  return H;
};