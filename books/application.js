function domReady () {
  document.body.className += " javascript";

  var superscripts = document.getElementsByTagName("sup");
  for (var i = 0; i < superscripts.length; i++) {
    var sup = superscripts[i];
    var title = sup['title'];
    if (title != "") {
      sup.addEventListener('click', function(ev) {
        var notes = this.getElementsByClassName("note");
        if (notes.length == 0) {
          var note = document.createElement("span");
          note.setAttribute("class", "note");
          note.innerHTML = this['title'];
          this.appendChild(note);
        }
        else {
          for (var i = 0; i < notes.length; i++) {
            notes[i].parentElement.removeChild(notes[i]);
          }
        }
      })
    }
  }

  if (typeof applicationCache.addEventListener != "function") {
    alert("applicationCache.addEventListern function not found");
  }

  function handleCacheEvent(ev) {
    var p = document.createElement("p");
    p.innerText = "" + new Date() + ev.type + "...";
    if (ev.type == "progress") {
      p.innerText += "(" + ev.loaded + "/" + ev.total + ")";
    }
    document.body.appendChild(p);
  }

  handleCacheEvent({type: "applicationCache.status is " + applicationCache.status});

  function handleCacheError(e) {
    alert('Error: Cache failed to update!');
  };

  // Fired after the first cache of the manifest.
  applicationCache.addEventListener('cached', handleCacheEvent, false);

  // Checking for an update. Always the first event fired in the sequence.
  applicationCache.addEventListener('checking', handleCacheEvent, false);

  // An update was found. The browser is fetching resources.
  applicationCache.addEventListener('downloading', handleCacheEvent, false);

  // The manifest returns 404 or 410, the download failed,
  // or the manifest changed while the download was in progress.
  applicationCache.addEventListener('error', handleCacheError, false);

  // Fired after the first download of the manifest.
  applicationCache.addEventListener('noupdate', handleCacheEvent, false);

  // Fired if the manifest file returns a 404 or 410.
  // This results in the application cache being deleted.
  applicationCache.addEventListener('obsolete', handleCacheEvent, false);

  // Fired for each resource listed in the manifest as it is being fetched.
  applicationCache.addEventListener('progress', handleCacheEvent, false);

  // Fired when the manifest resources have been newly redownloaded.
  applicationCache.addEventListener('updateready', handleCacheEvent, false);

}

// Mozilla, Opera, Webkit 
if ( document.addEventListener ) {
  document.addEventListener( "DOMContentLoaded", function(){
    document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
    domReady();
  }, false );

// If IE event model is used
} else if ( document.attachEvent ) {
  // ensure firing before onload
  document.attachEvent("onreadystatechange", function(){
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", arguments.callee );
      domReady();
    }
  });
}
