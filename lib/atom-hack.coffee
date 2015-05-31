CP = require 'child_process'
Path = require 'path'

# This is an implementation detail of your own linter.
lintHack = (ActiveEditor) ->
  return new Promise (Resolve)->
    FilePath = ActiveEditor.getPath()
    return unless FilePath # Files that have not be saved
    Data = []
    Process = CP.exec('hh_client --json', {cwd: Path.dirname(FilePath)})
    Process.stderr.on 'data', (data)-> Data.push(data.toString())
    Process.on 'close', ->
      try
        Content = JSON.parse(Data.join(''))
      catch error
        # Ignore weird errors for now
        # We still need to return an array so the transformer doesn't crash
        return []
      return Resolve([]) if Content.passed
      Resolve(Content.errors)

# You will probably need some process to convert the output of your linter
# into Messages compatible with linter-plus
transformer = (errors) ->
  ToReturn = []
  errors.forEach (ErrorEntry)->
    ErrorEntry = ErrorEntry.message
    First = ErrorEntry.shift()
    Traces = []
    for Message in ErrorEntry
      Traces.push(
        Type: 'Trace',
        Message: Message.descr,
        File: Message.path,
        Position: [[Message.line,Message.start],[Message.line,Message.end]]
      )

    ToReturn.push(
      Type: 'Error',
      Message: First.descr,
      File: First.path,
      Position: [[First.line,First.start],[First.line,First.end]]
      Trace: Traces
    )

  return ToReturn

module.exports = LinterHack =

  activate: ->
    if typeof atom.packages.getLoadedPackage("linter-plus") is 'undefined'
      return @showError "[Hack] linter-plus package not found but is required to provide validations for Hack Files"

  deactivate: ->

  showError:(Message)->
    Dismissible = atom.notifications.addError Message, {dismissable: true}
    setTimeout ->
      Dismissible.dismiss()
    , 5000

  # Whatever you name this function it gets setup in `package.json` under
  # `providedServices`
  provideLinter:->
    return {
      lintOnFly: false # optional
      scopes: ['source.hack']
      lint: (ActiveEditor) ->
        # You will need to return a promise or an array of Messages. This
        # implementation needs to use a promise
        return lintHack(ActiveEditor).then(transformer)
    }
