def runCode(code: str):
    # Splits the code into lines by semicolons
    lines: List[str] = []
    currentLine: str = ""
    for char in code:
        if char == ";":
            lines.append(currentLine)
            currentLine = ""
        else:
            currentLine += char
    # Goes thorugh each line
    # unknown expression:  178
    programVars:  = {}
    eval2: List[str] = []
    freezeEval: List[List[str]] = []
    class chunkModeEnum(Enum):
        running = 0
        collecting = 1
    chunkMode: number = chunkModeEnum.collecting
    currentChunk: str = ""
    lineIndex: number = 0
    lineIndex = 0
    while lineIndex < len(lines):
        line = lines[lineIndex]
        currentChunk = ""
        for char2 in line:
            # freezeEval.push(eval.splice(0,0))
            if char2 == "|":
                evalChunk(currentChunk)
                chunkMode = chunkModeEnum.running
            elif char2 == ",":
                evalChunk(currentChunk)
                chunkMode = chunkModeEnum.collecting
            elif char2 == "(":
                pass
            elif char2 == ")":
                pass
            else:
                currentChunk += char2
        evalChunk(currentChunk)
        lineIndex += 1
    def evalChunk(chunk: str):
        # For editor only
        # unknown expression:  178
        operators:  = {
            "+": function() {
                return((parseFloat(eval[0]) + parseFloat(eval[1])) + "")
            },
            "-": function() {
                return((parseFloat(eval[0]) - parseFloat(eval[1])) + "")
            },
            "/": function() {
                return((parseFloat(eval[0]) / parseFloat(eval[1])) + "")
            },
            "*": function() {
                return((parseFloat(eval[0]) * parseFloat(eval[1])) + "")
            },
            "^": function() {
                return(Math.pow(parseFloat(eval[0]), parseFloat(eval[1])) + "")
            },
            "%": function() {
                return((parseFloat(eval[0]) % parseFloat(eval[1])) + "")
            },
            "write": function() {
                programVars[eval[0]] = eval[1]
                return(eval)
            },
            "read": function() {
                return(programVars[eval[0]])
            },
            "=": function() {
                return((eval[0] == eval[1]) + "")
            },
            ">": function() {
                return((eval[0] > eval[1]) + "")
            },
            "<": function() {
                return((eval[0] < eval[1]) + "")
            },
            ">=": function() {
                return((eval[0] >= eval[1]) + "")
            },
            "<=": function() {
                return((eval[0] <= eval[1]) + "")
            },
            "goto": function() {
                lineIndex = parseInt(eval[0]) - 1
                return(eval)
            },
            "if": function() {
                if (eval[0] == "true") {
                    operators["goto"]()
                }
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
        if chunkMode == chunkModeEnum.collecting:
            eval2.append(chunk)
        elif chunkMode == chunkModeEnum.running:
            operators[chunk]()