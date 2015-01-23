

module.exports = function(FS,Path,Main){
  class H{
    static readConfig():Promise{
      return new Main.v.Promise(function(resolve){
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
    static spawn():Promise{
      return this.exec([],null,atom.project.path);
    }
    static exec(args:Array, input:String, path:String):Promise{
      var
        toReturn = {stderr:'',stdout:''},
        command = atom.config.get('Atom-Hack.typeCheckerCommand');
      return new Main.v.Promise(function(resolve){
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
    static execSync(args:Array, input:String, path:String):Promise{
      var
        command = atom.config.get('Atom-Hack.typeCheckerCommand');
      return new Main.v.Promise(function(resolve){
        //TODO: Use ssh thing if it's a remote server
        var Proc = Main.v.CP.spawnSync(command,args,{cwd:Main.v.Path.dirname(path),input:input});
        resolve({stderr:Proc.stderr.toString(),stdout:Proc.stdout.toString()});
      },false);
    }
    static ACSuggestions(editor):Promise{
      return new Main.v.Promise(function(resolve){
        var
          Buffer = editor.getBuffer(),
          Text = Buffer.cachedText,
          Index = Buffer.characterIndexForPosition(editor.getCursorBufferPosition()),
          Term = this.ACTerm(Text,Index);
        Text = Text.substr(0,Index)+'AUTO332'+Text.substr(Index);
        this.execSync(['--auto-complete'],Text,editor.getPath()).then(function(result){
          console.log(result);
          result = result.stdout.split("\n").filter(e => e);
          resolve(this.ACProcess(Term,result));
        }.bind(this));
      }.bind(this),false);
    }
    static ACTerm(Text:String,Index:Number):String{
      var
        LeText = [],
        Char = null;
      while((Index = Index-1)){
        Char = Text.substr(Index,1);
        if(H.LeTerms.indexOf(Char) === -1){
          LeText.push(Char);
        } else {
          break;
        }
      }
      return LeText.reverse().join('');
    }
    static ACProcess(Term:String, Results:Array):Array{
      var toReturn = [];
      if(Term && Term.length){
        Results.forEach(function(v){
          v = v.split(' ');
          toReturn.push({term:v[0],label:v.slice(1).join(' ')});
        });
      } else {
        Results.forEach(function(v){
          v = v.split(' ');
          toReturn.push({term:v[0],label:v.slice(1).join(' '),score:v[0].score(Term)});
        });
        toReturn.sort( (a,b) => b.score-a.score);
      }
      return toReturn;
    }
  }

  H.defaultConfig = {type:"local"};
  H.config = H.defaultConfig;
  H.LeTerms = ['"',"'",' ',')','(',',','{','}','::','-','+','>','<',';',"\n","\r"];
  return H;
};