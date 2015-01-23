

module.exports = function(FS,Path,Main){
  var
    LeAutoComplete = null, // Main AutoComplete Package
    Subscription = null,
    AutoComplete = null,
    GenerateAC = function(){
      class AutoComplete extends LeAutoComplete.Provider{
        buildSuggestions(){
          console.log("Build Suggestions");
          try {
            var suggestions = Main.v.H.ACSuggestions(this.editor);
          } catch(error){
            console.log(error);
          }
          return [];
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
      LeAutoComplete.registerProviderForEditor(new AutoComplete(editor), editor)
    }
    static deactivate(){
      if(!Main.status.AutoComplete){
        return ;
      }
      Main.status.AutoComplete = false;
    }
  }
  return AutoCompleteManager;
};