const latteHeight = 46;
function processClient(client, source) {
  if (!client || !client.normalWindow) {
    return;
  }

  print(source + ": Processing window: " + client.caption);
  if (client.y + client.height <= workspace.workspaceHeight - latteHeight) {
    print(source + ": Window is ok: " + client.caption);
    return;
  }
  client.frameGeometry = {
    x: client.x,
    y: client.y,
    width: client.width,
    height: client.height - latteHeight,
  };
  print(source + ": Set frameGeometry for window: " + client.caption);
}

workspace.clientAdded.connect(function (client) {
  processClient(client, "clientAdded");
});

workspace.clientRestored.connect(function (client) {
  processClient(client, "clientRestored");
});

workspace.clientMaximizeSet.connect(function (client, h, v) {
  if (v) {
    processClient(client, "clientMaximizeSet");
  }
});

// Redo clients if Latte Dock is restarted...
var redoClients = false;
workspace.clientAdded.connect(function (client) {
  if (client.caption === "Latte Dock" && client.dock && redoClients) {
    print("Latte Dock added. Will processing windows");
    const clients = workspace.clientList();
    for (var i = 0; i < clients.length; i++) {
      print("Latte Dock added. Processing window: " + clients[i].caption);
      processClient(clients[i], "latteDockAdded");
    }
    redoClients = false;
  }
});

workspace.clientRemoved.connect(function (client) {
  if (client.caption === "Latte Dock" && client.dock) {
    redoClients = true;
  }
});
