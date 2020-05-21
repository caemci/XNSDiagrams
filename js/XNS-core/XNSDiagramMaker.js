// -----------------------------------
// EXTENDED NASSI SCHNEIDERMAN DIAGRAM
// -----------------------------------
function eXtendendNassiShneiderman(params) {

	if (!params) { params = {}; }
	var _self = Object.create(new BaseDiagram({ "graphicType": "Nassi-Shneiderman", "prefix": "xnsd", "onrender": params["onrender"] }));

	/* --- private properties and methods --- */

	function makeCorner(side, caption) {
		var canvas = document.createElement("canvas");
		canvas.className = "corner";
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		if (side == "true") {
			ctx.moveTo(-1, -1);
			ctx.lineTo(canvas.width + 1, canvas.height + 1);
		} else {
			ctx.moveTo(canvas.width + 1, -1);
			ctx.lineTo(-1, canvas.height + 1);
		}
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		//var optblock = _self.newBlock("option-block", _self.newBlock("option-background"));
		var optblock = _self.newBlock("option-block", canvas);
		optblock.appendChild(_self.newBlock("caption", caption));
		return _self.newBlock("option " + side, optblock);
	}

	function appendBlockOrEmpty(container, blockClass, obj) {
		var block = _self.newBlock(blockClass);
		var i;
		if (obj && obj.length > 0) {
			for (i = 0; i < obj.length; i++) {
				_self.process(block, obj[i]["type"], obj[i]["data"]);
			}
		} else {
			block.appendChild(_emptyBuilder());
		}
		container.appendChild(block);
		return container;
	}

	function appendFixedValue(container, value) {
		var div = document.createElement("div");
		div.classList.add("fixed-value-in-statement");
		div.innerHTML = value;
		container.appendChild(div);
	}

	function fixedLoopBuilder(obj, controllerBlockBuilder) {
		var loopController = _self.newBlock("controller");
		loopController.appendChild(_self.newBlock("top", "&nbsp;"));
		loopController.appendChild(controllerBlockBuilder(_self.newBlock("content-block"), obj["control"]));
		loopController.appendChild(_self.newBlock("bottom", "&nbsp;"));
		var container = _self.newBlock("container", loopController);
		appendBlockOrEmpty(container, "statements", obj["statements"]);
		return _self.newBlock("for-statement block-container", container);
	}

	/* --- diagram blocks implementation --- */

	function _declarationBuilder(methodDec) {
		/*function ifHas(value, handler, defaultValue) {
			return (typeof value != "undefined") ?
				handler(value) :
				defaultValue;
		}

		function stringValue(field, defaultValue, ) {
			if (!defaultValue) { defaultValue = ""; }
			return (!field) ? defaultValue : field + " ";
		}

		function argumentsToString(args) {
			var a;
			var output = "";
			if (args) {
				for (a in args) {
					if (output) { output += ", "; }
					output += _self.htmlString(args[a]["type"]) + " " + args[a]["name"];
				}
			}
			return output;
		}

		function exceptionsToString(exceptionList) {
			return (!exceptionList) ? "" : " throws " + exceptionList.join(", ");
		}*/

		function classDeclarationBuilder(className) {
			var box = _self.newBlock("class-declaration");
			appendFixedValue(box, "class");
			box.appendChild(_self.newBlock("class-name", className, false, true));
			appendFixedValue(box, ":");
			return box;
		}

		var methodDeclaration = _self.newBlock("method-declaration");
		if (typeof methodDec["class"] != "undefined") {
			methodDeclaration.appendChild(classDeclarationBuilder(methodDec["class"]));
		}
		var methodSignature = _self.newBlock("method-signature");
		methodSignature.appendChild(_self.newBlock("method-modifiers", methodDec["modifiers"], false, true));
		methodSignature.appendChild(_self.newBlock("method-type", methodDec["type"], false, true));
		methodSignature.appendChild(_self.newBlock("method-name", methodDec["name"], false, true));
		appendFixedValue(methodSignature, "(");
		methodSignature.appendChild(_self.newBlock("method-parameters"));
		appendFixedValue(methodSignature, ")");
		methodDeclaration.appendChild(methodSignature);
		return methodDeclaration;

		/*return _self.newBlock("method-declaration",
			ifHas(methodDec["class"], function (val) { return "<p>class " + val + ":</p>" }, "") +
			stringValue(methodDec["modifiers"]) +
			_self.htmlString(stringValue(methodDec["type"])) +
			stringValue(methodDec["name"], "[" + _self.SYMBOLS[_self.currentLanguage].ANONYMOUS_METHOD + "]").trim() +
			"(" + argumentsToString(methodDec["arguments"]) + ")" +
			exceptionsToString(methodDec["throws"]));*/
	}

	function _localVarsBuilder(localVars) {
		var box = _self.newBlock("local-variable-declaration");
		for (var v in localVars) {
			box.appendChild(_variableDeclarationBuilder(localVars[v]));
		}
		return box;
	}

	function typeNameBuilder(obj, containerName) {
		var type = _self.newBlock("type", _self.htmlString(obj["type"]), false, true);
		var name = _self.newBlock("name", _self.htmlString(obj["name"]), false, true);
		var container = _self.newBlock(containerName);
		appendFixedValue(container, getAnchorIcon());
		container.appendChild(type);
		container.appendChild(name);
		return container;
	}

	function getAnchorIcon() {
		return '<i class="fa fa-xs fa-arrows"></i>';
	}

	function _parameterDeclarationBuilder(obj) {
		return typeNameBuilder(obj, "parameter-declaration");
	}

	function _variableDeclarationBuilder(obj) {
		return typeNameBuilder(obj, "variable-declaration");
	}

	function _initializedVariableDeclarationBuilder(obj) {
		var type = _self.newBlock("type", _self.htmlString(obj["type"]), false, true);
		var name = _self.newBlock("name", _self.htmlString(obj["name"]), false, true);
		var value = _self.newBlock("value", _self.htmlString(obj["value"]), false, true);
		var assignment = _assignmentBuilder({ "variable": name, "value": value });
		var initializedVariableDeclaration = _self.newBlock("initialized-variable-declaration");
		appendFixedValue(initializedVariableDeclaration, getAnchorIcon());
		initializedVariableDeclaration.appendChild(type);
		initializedVariableDeclaration.appendChild(assignment);
		return initializedVariableDeclaration;
	}

	function _statementsBuilder(theStatements) {
		var box = _self.newBlock("statements", undefined, true, false);
		for (var s = 0; s < theStatements.length; s++) {
			_self.process(box, theStatements[s]["type"], theStatements[s]["data"]);
		}
		return box;
	}

	function _emptyBuilder() {
		return _self.newBlock("empty", undefined, "true");
	}

	function _blockBuilder(obj) {
		var box = _self.newBlock("block-statement");
		box.appendChild(_self.newBlock("content", obj["content"], false, true));
		return box;
	}

	function _assignmentBuilder(obj) {
		var box = _self.newBlock("assignment-statement");
		box.appendChild(_self.newBlock("variable", obj["variable"], false, true));
		appendFixedValue(box, " <span class=\"arrow\">&larr;</span> ");
		box.appendChild(_self.newBlock("value", obj["value"], false, true));
		return box;
	}

	function _commentBuilder(obj) {
		var box = _self.newBlock("comment-statement");
		appendFixedValue(box, "/* ");
		box.appendChild(_self.newBlock("content", obj["content"], false, true));
		appendFixedValue(box, " */");
		return box;
	}

	function _conditionalBuilder(obj) {
		var header = _self.newBlock("header")
		header.appendChild(makeCorner("true", _self.SYMBOLS[_self.currentLanguage].TRUE));
		header.appendChild(_self.newBlock("condition", obj["condition"], false, true));
		header.appendChild(makeCorner("false", _self.SYMBOLS[_self.currentLanguage].FALSE));
		var body = _self.newBlock("body");
		appendBlockOrEmpty(body, "then", obj["then"]);
		appendBlockOrEmpty(body, "else", obj["else"]);
		var box = _self.newBlock("conditional-statement conditional block-container");
		box.appendChild(header);
		box.appendChild(body);
		return box;
	}

	function _switchCaseBuilder(obj) {
		var column = _self.newBlock("case", _self.newBlock("test-value", obj["case"], false, true));
		appendBlockOrEmpty(column, "statements", obj["statements"]);
		return column;
	}

	function _switchBuilder(obj) {
		var header = _self.newBlock("header");
		header.appendChild(makeCorner("true", "&nbsp;"));
		header.appendChild(_self.newBlock("condition", obj["expression"], false, true));
		header.appendChild(makeCorner("false", "&nbsp;"));
		var body = _self.newBlock("body");
		for (var c = 0; c < obj["options"].length; c++) {
			body.appendChild(_switchCaseBuilder(obj["options"][c]));
		}
		var box = _self.newBlock("conditional-statement switch block-container");
		box.appendChild(header);
		box.appendChild(body);
		return box;
	}

	function _breakBuilder() {
		var box = _self.newBlock("break-statement");
		appendFixedValue(box, "break");
		return box;
	}

	function _inputBuilder(obj) {
		var box = _self.newBlock("input-statement");
		box.appendChild(_self.newBlock("symbol", _self.SYMBOLS[_self.currentLanguage].INPUT));
		box.appendChild(_self.newBlock("body", obj["variable"], false, true));
		return box;
	}

	function _outputBuilder(obj) {
		var box = _self.newBlock("output-statement");
		box.appendChild(_self.newBlock("symbol", _self.SYMBOLS[_self.currentLanguage].OUTPUT));
		box.appendChild(_self.newBlock("body", obj["message"], false, true));
		return box;
	}

	function _whileBuilder(obj) {
		var box = _self.newBlock("while-statement block-container");
		var conditionBlock = _self.newBlock("condition-block");
		conditionBlock.appendChild(_self.newBlock("condition", obj["condition"], false, true));
		box.appendChild(conditionBlock);
		var container = _self.newBlock("container");
		appendBlockOrEmpty(container, "side-while", "side-while");
		box.appendChild(appendBlockOrEmpty(container, "statements", obj["statements"]));
		return box;
	}

	function _doWhileBuilder(obj) {
		var container = _self.newBlock("container");
		appendBlockOrEmpty(container, "side-dowhile", "side-dowhile");
		appendBlockOrEmpty(container, "statements", obj["statements"]);
		var box = _self.newBlock("dowhile-statement block-container", container);
		var conditionBlock = _self.newBlock("condition-block");
		conditionBlock.appendChild(_self.newBlock("condition", obj["condition"], false, true));
		box.appendChild(conditionBlock);
		return box;
	}

	function _forBuilder(obj) {
		return fixedLoopBuilder(obj, function (container, obj) {
			var box = _self.newBlock("content");
			box.appendChild(_self.newBlock("variable", obj["variable"], false, true));
			appendFixedValue(box, "<span class=\"arrow\">&larr;</span>");
			box.appendChild(_self.newBlock("start", obj["start"], false, true));
			appendFixedValue(box, ",");
			box.appendChild(_self.newBlock("stop", obj["stop"], false, true));
			appendFixedValue(box, ",");
			box.appendChild(_self.newBlock("step", obj["step"], false, true));
			container.appendChild(box);
			//container.appendChild(_self.newBlock("content", obj["variable"] + " &larr; " + obj["start"] + ", " + obj["stop"] + ", " + obj["step"], undefined, "true"));
			return container;
		});
	}

	function _foreachBuilder(obj) {
		return fixedLoopBuilder(obj, function (container, obj) {
			var box = _self.newBlock("content");
			box.appendChild(_self.newBlock("class", obj["class"], false, true));
			box.appendChild(_self.newBlock("variable", obj["variable"], false, true));
			appendFixedValue(box, ":");
			box.appendChild(_self.newBlock("collection", obj["collection"], false, true));
			container.appendChild(box);
			//container.appendChild(_self.newBlock("content", obj["class"] + " " + obj["variable"] + ": " + obj["collection"], undefined, "true"));
			return container;
		});
	}

	function _callBuilder(obj) {
		var box = _self.newBlock("call-statement", _self.newBlock("margin left", "&nbsp;"));
		box.appendChild(_self.newBlock("call", obj["statement"], false, true));
		box.appendChild(_self.newBlock("margin right", "&nbsp;"));
		return box;
	}

	function _returnBuilder(obj) {
		var box = _self.newBlock("return-statement");
		appendFixedValue(box, "return ");
		box.appendChild(_self.newBlock("value", obj["value"], false, true));
		return box;
	}

	/* --- Nassi Shneiderman Extension: Exception blocks implementation --- */

	function _throwBuilder(obj) {
		return _self.newBlock("throw-statement", "<i>throw</i> " + _self.htmlString(obj["value"]));
	}

	function _tryBuilder(obj) {
		var box = _self.newBlock("try-statement", _self.newBlock("margin left", "try"));
		box.appendChild(appendBlockOrEmpty(_self.newBlock("container"), "statements", obj["statements"]));
		return box;
	}

	function _catchBuilder(obj) {
		var exception = _self.newBlock("exception");
		exception.appendChild(_self.newBlock("identifier", obj["exception"]));
		exception.appendChild(_self.newBlock("variable", obj["variable"]));
		var box = _self.newBlock("catch-statement", _self.newBlock("margin left", "catch"));
		box.appendChild(appendBlockOrEmpty(_self.newBlock("container", exception), "statements", obj["statements"]));
		return box;
	}

	function _finallyBuilder(obj) {
		var box = _self.newBlock("finally-statement", _self.newBlock("margin left", "finally"))
		box.appendChild(appendBlockOrEmpty(_self.newBlock("container"), "statements", obj["statements"]));
		return box;
	}

	/* --- object construction --- */
	function init() {
		_self.addProperty("currentLanguage", _self.getValue(params["language"], _self["DEFAULT_LANGUAGE"]));
		_self.addProperty("explicitReturn", _self.getValue(params["explicitReturn"], true));
		_self.addProperty("includeExceptions", _self.getValue(params["includeExceptions"], true));
		var _builders = {
			"declaration": _declarationBuilder,
			"localVars": _localVarsBuilder,
			"statements": _statementsBuilder,
			"newParameter": _parameterDeclarationBuilder,
			"newVariable": _variableDeclarationBuilder,
			"newConstant": _variableDeclarationBuilder,
			"newInitializedVariable": _initializedVariableDeclarationBuilder,
			"newInitializedConstant": _initializedVariableDeclarationBuilder,
			"block": _blockBuilder,
			"assignment": _assignmentBuilder,
			"if": _conditionalBuilder,
			"conditional": _conditionalBuilder,
			"switch": _switchBuilder,
			"switch-case": _switchCaseBuilder,
			"break": _breakBuilder,
			"input": _inputBuilder,
			"output": _outputBuilder,
			"while": _whileBuilder,
			"dowhile": _doWhileBuilder,
			"for": _forBuilder,
			"foreach": _foreachBuilder,
			"call": _callBuilder,
			"return": _returnBuilder,
			"empty": _emptyBuilder,
			"comment": _commentBuilder
		}
		if (_self["includeExceptions"]) {
			_builders["throw"] = _throwBuilder;
			_builders["try"] = _tryBuilder;
			_builders["catch"] = _catchBuilder;
			_builders["finally"] = _finallyBuilder;
		}
		for (var builder in _builders) {
			_self.register(builder, _builders[builder]);
		}
	}

	/* -- instance construction -- */
	init();
	return _self;
}
// -----------------------------------
// EXTENDED NASSI SCHNEIDERMAN DIAGRAM
// -----------------------------------
// Class Synonym
var XNSDiagramMaker = eXtendendNassiShneiderman;