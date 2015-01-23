require("string_score");


module.exports = function(FS,Path,Main){
  var
    LeAutoComplete = null, // Main AutoComplete Package
    Subscription = null,
    AutoComplete = null,
    Providers = [],
    GenerateAC = function(){
      class AutoComplete extends LeAutoComplete.Provider{
        buildSuggestions(){
          var Results = [];
          Main.v.H.ACSuggestions(this.editor).then(function(response){
            response.Results.forEach(function(entry){
              Results.push(new LeAutoComplete.Suggestion(this,{
                word: entry.term,
                prefix: response.Term,
                label: entry.label,
                data: {
                  body: entry.label
                }
              }));
            });
          });
          return Results;
        }
      }
      AutoComplete.prototype.exclusive = true;
      return AutoComplete;
    };

  class AutoCompleteManager{
    static activate(){
      if(Main.status.AutoComplete){
        return ;
      }
      Main.status.AutoComplete = true;
      atom.packages.activatePackage("autocomplete-plus").then(function(pkg){
        LeAutoComplete = pkg.mainModule;
        if(!LeAutoComplete){
          return ;
        }
        AutoComplete = GenerateAC();
        Subscription = atom.workspace.observeTextEditors(editor => this.registerProvider(editor));
      }.bind(this));
    }
    static registerProvider(editor){
      var
        editorView = atom.views.getView(editor),
        Grammar = editor.getGrammar();
      if(editorView.mini || (Grammar.name !== 'C++' && Grammar.name !== 'PHP' && Grammar !== 'Hack')){
        return ;
      }
      Providers.push(LeAutoComplete.registerProviderForEditor(new AutoComplete(editor), editor))
    }
    static deactivate(){
      if(!Main.status.AutoComplete){
        return ;
      }
      Main.status.AutoComplete = false;
      if(Subscription !== null){
        Subscription.dispose();
      }
      Providers.forEach((provider) => LeAutoComplete.unregisterProvider(provider));
      Providers = [];
      Subscription = null;
    }
  }
  return AutoCompleteManager;
};