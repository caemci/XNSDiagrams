var aceEditor = ace.edit("editor");
aceEditor.setOptions({
	theme: "ace/theme/monokai",
	autoScrollEditorIntoView: false,
	minLines: 20,
	maxLines: 30
});
aceEditor.session.setMode("ace/mode/json");
aceEditor.session.setTabSize(2);
aceEditor.session.setUseWrapMode(true);
aceEditor.setFontSize(12);
aceEditor.setShowPrintMargin(false);