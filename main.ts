let runningCode: boolean = false
let codeToRun = 
`fib1,1|write;fib2,1|write;fib3,(fib1|read,(fib2|read)|+)|write;fib3|read|print;fib1,(fib2|read)|write;fib2,(fib3|read)|write;fib1|read,100000000000|<,2|if;`;

let stopCodeFlag: boolean = false

input.onButtonPressed(Button.AB, function () {
    if (!runningCode) {
        runningCode = true
        runCode(codeToRun)
        console.log("done with code")
        runningCode = false
    }
})

function runCode(code:string): void {  
    //Splits the code into lines by semicolons
    let lines: string[] = []
    let currentLine: string = ""
    for (let char of code) {
        if (char == ";") {
            lines.push(currentLine)
            currentLine = ""
        } else {
            currentLine += char
        }
    }
    //Goes thorugh each line
    let programVars: {[key: string]: string} = {}
    let eval: string[] = []
    let freezeEval: string[][] = []
    enum chunkModeEnum {
        running, 
        collecting,
    }
    let chunkMode: number = chunkModeEnum.collecting
    let currentChunk: string = ""
    let lineIndex: number = 0
    for (lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (stopCodeFlag) {
            console.log("finishing")
            stopCodeFlag = false
            return
        }
        let line = lines[lineIndex]
        chunkMode = chunkModeEnum.collecting
        eval = []
        freezeEval = []
        for (let char of line) {
            if (char == "|") {
                evalChunk()
                chunkMode = chunkModeEnum.running
            } else if (char == ",") {
                evalChunk()
                chunkMode = chunkModeEnum.collecting
            } else if (char == "(") {
                freezeEval.push(eval.map((x) => x))
                eval = []
                chunkMode = chunkModeEnum.collecting
            } else if (char == ")") {
                evalChunk()
                let addedEval = freezeEval.pop()
                for (let i = 0; i < addedEval.length; i++) {
                    eval.unshift(addedEval[i])
                }
            } else {
                currentChunk += char
            }
        }
        evalChunk()
    }
    function evalChunk() {
        const operators: {[operatorCall: string]: () => string[]} = {
            "+": function() {
                return([(parseFloat(eval[0]) + parseFloat(eval[1])) + ""])
            },
            "-": function() {
                return([(parseFloat(eval[0]) - parseFloat(eval[1])) + ""])
            },
            "/": function() {
                return([(parseFloat(eval[0]) / parseFloat(eval[1])) + ""])
            },
            "*": function() {
                return([(parseFloat(eval[0]) * parseFloat(eval[1])) + ""])
            },
            "^": function() {
                return([Math.pow(parseFloat(eval[0]), parseFloat(eval[1])) + ""])
            },
            "%": function() {
                return([(parseFloat(eval[0]) % parseFloat(eval[1])) + ""])
            },
            "write": function() {
                programVars[eval[0]] = eval[1]
                return(eval)
            },
            "read": function() {
                return([programVars[eval[0]]])
            },
            "=": function() {
                return([(eval[0] == eval[1]) + ""])
            },
            ">": function() {
                return([(parseFloat(eval[0]) > parseFloat(eval[1])) + ""])
            },
            "<": function() {
                return([(parseFloat(eval[0]) < parseFloat(eval[1])) + ""])
            },
            ">=": function() {
                return([(parseFloat(eval[0]) >= parseFloat(eval[1])) + ""])
            },
            "<=": function() {
                return([(parseFloat(eval[0]) <= parseFloat(eval[1])) + ""])
            },
            "goto": function() {
                lineIndex = parseInt(eval[0]) - 1
                return(eval)
            },
            "if": function() {
                if (eval[0] == "true") {
                    lineIndex = parseInt(eval[1]) - 1
                }
                return(eval)
            },
            "wait": function() {
                basic.pause(parseFloat(eval[0])*1000)
                return(eval)
            },
            "led.plot": function() {
                led.plot(parseInt(eval[0]), parseInt(eval[1]))
                return(eval)
            },
            "led.unplot": function() {
                led.unplot(parseInt(eval[0]), parseInt(eval[1]))
                return(eval)
            },
            "led.toggle": function() {
                led.toggle(parseInt(eval[0]), parseInt(eval[1]))
                return(eval)
            },
            //For editor only
            "print": function() {
                console.log(eval)
                return(eval)
            }
        }
        if (chunkMode == chunkModeEnum.collecting) {
            eval.push(currentChunk)
        } else if (chunkMode == chunkModeEnum.running)  {
            if (operators[currentChunk] != undefined) {
                eval = operators[currentChunk]()
            }
        }
        currentChunk = ""
    }
}