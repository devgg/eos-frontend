var socket = io();

$(document).ready(function() {
  function setCmd() {
    const action = $("#actions")
      .find(":selected")
      .data("action");

    let cmd = action.contract + " " + action.name + " '{";
    for (let i = 0; i < action.args.length; i++) {
      let arg = action.args[i];
      if (i > 0) {
        cmd += ", ";
      }
      cmd += '"' + arg.name + '": ' + $("#actionInput_" + arg.name).val();
    }
    cmd += "}' -p " + $("#actionInput_authentification").val();
    $("#cmd").text(cmd);
  }

  function createActionFieldInput(arg) {
    const id = "actionInput_" + arg.name;
    const $label = $("<label></label>")
      .text(arg.name)
      .attr("for", id);
    const $input = $("<input  class='u-full-width' type='text'></input>")
      .val(JSON.stringify(arg.value, null, 1))
      .attr("id", id)
      .data("arg", arg);
    $input.on("input", setCmd);
    $("#actionInputContainer").append($label);
    $("#actionInputContainer").append($input);
    setCmd();
  }

  function updateAction() {
    $("#actionInputContainer").empty();
    const action = $("#actions")
      .find(":selected")
      .data("action");
    for (let i = 0; i < action.args.length; i++) {
      createActionFieldInput(action.args[i]);
    }
    createActionFieldInput(action.auth);
  }

  $("#action").submit(function() {
    $("#error").text("");

    const action = $("#actions")
      .find(":selected")
      .data("action");

    var args = [];
    $("#actionInputContainer > input").each(function() {
      args.push(JSON.parse($(this).val()));
    });
    var data = {
      contract: action.contract,
      action: action.name,
      args: args.slice(0, -1),
      auth: args[args.length - 1]
    };
    socket.emit("action", data);
    return false;
  });

  function createTable(name, data) {
    var $table = $("<table></table>").attr({ id: name });
    var $caption = $("<caption></caption>").text(name);
    var $head = $("<thead></thead>");
    var $body = $("<tbody></tbody>");
    $table.append($caption);
    $table.append($head);
    $table.append($body);

    for (var i = 0; i < data.length; i++) {
      if (i === 0) {
        var $row = $("<tr></tr>").appendTo($head);
        for (var key in data[i]) {
          $("<td></td>")
            .text(key)
            .appendTo($row);
        }
      }
      var $row = $("<tr></tr>").appendTo($body);
      for (var key in data[i]) {
        $("<td></td>")
          .text(JSON.stringify(data[i][key], null, 1).replace(/"/g, ""))
          .appendTo($row);
      }
    }

    $("#tableContainer").append($table);
  }

  socket.on("update", function(tables) {
    $("#tableContainer").empty();
    for (let name in tables) {
      createTable(name, tables[name]);
    }
  });

  socket.on("actions", function(actions) {
    for (let i = 0; i < actions.length; i++) {
      let action = actions[i];
      $option = $("<option></option>")
        .text(action.description)
        .data("action", action);
      $("#actions").append($option);
    }

    $("#actions").change(updateAction);
    updateAction();
  });

  socket.on("err", function(error) {
    $("#error").text(error);
  });
});
