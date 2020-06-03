//desmos lock by @JohnDoesStuff
if (window.location.href.includes("desmos.com/calculator")) {
	var Calc = Calc || false;
	if (Calc) {
		var DLock = {};
		DLock.getLock = function() { //gets the array of all lockable variables
			var expressions = Calc.getState().expressions.list;
			for (var i = 0; i < expressions.length; i++) {
				if (expressions[i].latex) if (expressions[i].latex.startsWith("l_{ock}")) return expressions[i].id;
			}
		}
		DLock.lastSelectedExpression = false;
		DLock.set = function() {
			if (Calc.isAnyExpressionSelected) DLock.lastSelectedExpression = Calc.selectedExpressionId;
			var selected = DLock.lastSelectedExpression;
			if (selected === false) {
				window.alert("Please select an expression");
				return
			}
			var id = DLock.getLock();
			var lock = Calc.expressionAnalysis[id];
			var values = lock.evaluation.value;
			var vars = DLock.getExpression(id).latex.split("[")[1].split("\\right]")[0].split(",");
			var expr = DLock.getExpression(selected);
			var currentLatex = expr.latex;
			for (var i = 0; i < vars.length; i++) {
				currentLatex = currentLatex.split(vars[i]).join(values[i]);
			}
			expr.latex = currentLatex;
			expr.id = "dlock" + (new Date()).getTime();
			Calc.setExpression(expr);
		}
		DLock.getExpression = function(id) {
			var expressions = Calc.getState().expressions.list;
			for (var i = 0; i < expressions.length; i++) {
				if (expressions[i].id === id) return expressions[i]; 
			}
		}
		DLock.handler = function(e) {
			if (e.altKey && e.code == "KeyL") {
				DLock.set();
			}
		}
		document.addEventListener('keyup', DLock.handler);
	} else {
		window.alert("uh oh, something went wrong")
	}
} else {
	window.alert("this only works on desmos.com/calculator :v")
}